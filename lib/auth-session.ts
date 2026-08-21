import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import {
  ANON_WORKSPACE_COOKIE,
  AUTH_SESSION_COOKIE,
  type AuthSession,
} from "@/lib/auth";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type SessionProvisionStage = "database" | "user" | "workspace" | "session";

type GoogleIdentity = {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  picture: string;
};

type SessionRow = {
  user_id: string;
  user_name: string;
  email: string;
  avatar_url: string;
  workspace_id: string;
  workspace_name: string;
  role: string;
  expires_at: string;
};

export class SessionProvisionError extends Error {
  constructor(
    public readonly stage: SessionProvisionStage,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "SessionProvisionError";
  }
}

async function getDb() {
  try {
    const env = (await getCloudflareContext({ async: true })).env;
    if (!env.DB) throw new Error("D1 binding DB is unavailable.");
    return env.DB;
  } catch (error) {
    throw asStageError("database", error);
  }
}

type AuthDatabase = Awaited<ReturnType<typeof getDb>>;

export async function getCurrentSessionFromD1(): Promise<AuthSession | null> {
  const token = (await cookies()).get(AUTH_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionByTokenFromD1(token);
}

export async function getSessionByTokenFromD1(token: string): Promise<AuthSession | null> {
  if (!token) return null;
  const db = await getDb();
  const tokenHash = await sha256Hex(token);
  const row = await db.prepare(`
    SELECT s.user_id, u.name AS user_name, u.email, u.avatar_url,
      s.workspace_id, w.name AS workspace_name, wm.role, s.expires_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    JOIN workspaces w ON w.id = s.workspace_id
    JOIN workspace_members wm ON wm.user_id = s.user_id AND wm.workspace_id = s.workspace_id
    WHERE s.token_hash = ? AND s.expires_at > ?
    LIMIT 1
  `).bind(tokenHash, new Date().toISOString()).first<SessionRow>();

  return row ? rowToSession(row) : null;
}

export async function provisionGoogleSession(
  profile: GoogleIdentity,
  anonymousWorkspaceId: string | null,
) {
  const db = await getDb();
  const now = new Date().toISOString();
  const email = profile.email.trim().toLowerCase();
  const name = profile.name.trim() || profile.given_name.trim() || email.split("@")[0] || "TermBeacon user";

  const user = await runStage("user", async () => {
    let row = await db.prepare("SELECT id FROM users WHERE google_sub = ? LIMIT 1")
      .bind(profile.sub)
      .first<{ id: string }>();

    if (!row) {
      const emailOwner = await db.prepare("SELECT id, google_sub FROM users WHERE email = ? LIMIT 1")
        .bind(email)
        .first<{ id: string; google_sub: string }>();

      if (emailOwner && emailOwner.google_sub !== profile.sub) {
        throw new Error("Verified email is already linked to a different Google identity.");
      }

      if (emailOwner) {
        row = { id: emailOwner.id };
      } else {
        row = { id: crypto.randomUUID() };
        await db.prepare(
          "INSERT INTO users (id, google_sub, email, name, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        ).bind(row.id, profile.sub, email, name, profile.picture, now, now).run();
      }
    }

    await db.prepare(
      "UPDATE users SET google_sub = ?, email = ?, name = ?, avatar_url = ?, updated_at = ? WHERE id = ?",
    ).bind(profile.sub, email, name, profile.picture, now, row.id).run();

    return row;
  });

  const workspace = await runStage("workspace", async () => {
    let row = await db.prepare(`
      SELECT w.id, w.name, wm.role
      FROM workspace_members wm
      JOIN workspaces w ON w.id = wm.workspace_id
      WHERE wm.user_id = ?
      ORDER BY wm.created_at ASC
      LIMIT 1
    `).bind(user.id).first<{ id: string; name: string; role: string }>();

    const validAnonymousWorkspace = isUuid(anonymousWorkspaceId) ? anonymousWorkspaceId : null;

    if (!row) {
      let workspaceId = crypto.randomUUID();
      if (validAnonymousWorkspace) {
        const claimed = await db.prepare("SELECT id FROM workspaces WHERE id = ? LIMIT 1")
          .bind(validAnonymousWorkspace)
          .first<{ id: string }>();
        if (!claimed && await hasAnonymousData(db, validAnonymousWorkspace)) {
          workspaceId = validAnonymousWorkspace;
        }
      }

      const workspaceName = workspaceNameFor(name);
      await db.batch([
        db.prepare(
          "INSERT INTO workspaces (id, name, owner_user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        ).bind(workspaceId, workspaceName, user.id, now, now),
        db.prepare(
          "INSERT INTO workspace_members (workspace_id, user_id, role, created_at) VALUES (?, ?, 'owner', ?)",
        ).bind(workspaceId, user.id, now),
      ]);
      row = { id: workspaceId, name: workspaceName, role: "owner" };
    } else if (validAnonymousWorkspace && validAnonymousWorkspace !== row.id) {
      const claimed = await db.prepare("SELECT id FROM workspaces WHERE id = ? LIMIT 1")
        .bind(validAnonymousWorkspace)
        .first<{ id: string }>();
      if (!claimed && await hasAnonymousData(db, validAnonymousWorkspace)) {
        await db.batch([
          db.prepare("UPDATE contracts SET workspace_id = ? WHERE workspace_id = ?")
            .bind(row.id, validAnonymousWorkspace),
          db.prepare("UPDATE contract_files SET workspace_id = ? WHERE workspace_id = ?")
            .bind(row.id, validAnonymousWorkspace),
        ]);
      }
    }

    return row;
  });

  return runStage("session", async () => {
    const rawToken = randomToken(32);
    const tokenHash = await sha256Hex(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();

    await db.prepare(
      "INSERT INTO sessions (token_hash, user_id, workspace_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)",
    ).bind(tokenHash, user.id, workspace.id, expiresAt, now).run();

    const persisted = await db.prepare(`
      SELECT s.user_id, u.name AS user_name, u.email, u.avatar_url,
        s.workspace_id, w.name AS workspace_name, wm.role, s.expires_at
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      JOIN workspaces w ON w.id = s.workspace_id
      JOIN workspace_members wm ON wm.user_id = s.user_id AND wm.workspace_id = s.workspace_id
      WHERE s.token_hash = ?
      LIMIT 1
    `).bind(tokenHash).first<SessionRow>();

    if (!persisted) throw new Error("Session write completed but joined session verification returned no row.");

    try {
      await db.prepare("DELETE FROM sessions WHERE expires_at <= ?").bind(now).run();
    } catch (error) {
      console.warn(JSON.stringify({
        event: "expired_session_cleanup_failed",
        message: errorMessage(error),
      }));
    }

    return { token: rawToken, session: rowToSession(persisted) };
  });
}

export async function revokeSessionFromD1(token: string | null) {
  if (!token) return;
  const db = await getDb();
  await db.prepare("DELETE FROM sessions WHERE token_hash = ?")
    .bind(await sha256Hex(token))
    .run();
}

async function hasAnonymousData(db: AuthDatabase, workspaceId: string) {
  try {
    const row = await db.prepare(`
      SELECT (SELECT COUNT(*) FROM contracts WHERE workspace_id = ?) +
        (SELECT COUNT(*) FROM contract_files WHERE workspace_id = ?) AS item_count
    `).bind(workspaceId, workspaceId).first<{ item_count: number }>();
    return Number(row?.item_count ?? 0) > 0;
  } catch (error) {
    console.warn(JSON.stringify({
      event: "anonymous_workspace_probe_failed",
      message: errorMessage(error),
    }));
    return false;
  }
}

async function runStage<T>(stage: SessionProvisionStage, operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof SessionProvisionError) throw error;
    throw asStageError(stage, error);
  }
}

function asStageError(stage: SessionProvisionStage, error: unknown) {
  if (error instanceof SessionProvisionError) return error;
  return new SessionProvisionError(stage, errorMessage(error), {
    cause: error instanceof Error ? error : undefined,
  });
}

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    const cause = error.cause instanceof Error ? ` | cause: ${error.cause.message}` : "";
    return `${error.message}${cause}`;
  }
  return String(error);
}

function rowToSession(row: SessionRow): AuthSession {
  return {
    user: {
      id: row.user_id,
      name: row.user_name,
      email: row.email,
      avatarUrl: row.avatar_url,
    },
    workspace: {
      id: row.workspace_id,
      name: row.workspace_name,
      role: row.role === "owner" ? "owner" : "member",
    },
    expiresAt: row.expires_at,
  };
}

function workspaceNameFor(name: string) {
  const firstName = name.trim().split(/\s+/)[0];
  return firstName ? `${firstName}'s workspace` : "My workspace";
}

function isUuid(value: string | null): value is string {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

function randomToken(byteLength: number) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

async function sha256Hex(value: string) {
  const digest = new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
