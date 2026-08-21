import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies } from "next/headers";
import { z } from "zod";

export const AUTH_SESSION_COOKIE = "tb_session";
export const ANON_WORKSPACE_COOKIE = "tb_workspace";
export const OAUTH_STATE_COOKIE = "tb_oauth_state";
export const OAUTH_VERIFIER_COOKIE = "tb_oauth_verifier";
export const OAUTH_NEXT_COOKIE = "tb_oauth_next";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_TTL_SECONDS = 60 * 10;

const authSchemaSql = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  google_sub TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  owner_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (workspace_id, user_id),
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  workspace_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS workspace_members_user_idx ON workspace_members(user_id);
`;

const googleTokenSchema = z.object({ access_token: z.string().min(1) });
const googleProfileSchema = z.object({
  sub: z.string().min(1),
  email: z.string().email(),
  email_verified: z.boolean(),
  name: z.string().nullish().transform((value) => value ?? ""),
  given_name: z.string().nullish().transform((value) => value ?? ""),
  picture: z.string().url().nullish().transform((value) => value ?? ""),
});

type GoogleProfile = z.infer<typeof googleProfileSchema>;
type SessionRow = {
  user_id: string;
  user_name: string;
  email: string;
  avatar_url: string;
  workspace_id: string;
  workspace_name: string;
  role: "owner" | "member";
  expires_at: string;
};

export type AuthSession = {
  user: { id: string; name: string; email: string; avatarUrl: string };
  workspace: { id: string; name: string; role: "owner" | "member" };
  expiresAt: string;
};

export function isGoogleAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
}

export async function isAuthEnforced() {
  if (isGoogleAuthConfigured()) return true;
  try {
    const env = (await getCloudflareContext({ async: true })).env;
    const row = await env.DB.prepare("SELECT 1 AS present FROM users LIMIT 1").first<{ present: number }>();
    return Boolean(row?.present);
  } catch {
    return false;
  }
}

function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) throw new Error("Google OAuth is not configured.");
  return { clientId, clientSecret };
}

export async function ensureAuthSchema() {
  const env = (await getCloudflareContext({ async: true })).env;
  await env.DB.exec(authSchemaSql);
  return env;
}

type AuthDatabase = Awaited<ReturnType<typeof ensureAuthSchema>>["DB"];

export async function getAnonymousWorkspaceId() {
  return (await cookies()).get(ANON_WORKSPACE_COOKIE)?.value ?? null;
}

export async function getCurrentSession(): Promise<AuthSession | null> {
  const token = (await cookies()).get(AUTH_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getSessionByToken(token);
}

export async function getSessionByToken(token: string): Promise<AuthSession | null> {
  if (!token) return null;
  const env = await ensureAuthSchema();
  const tokenHash = await sha256Hex(token);
  const row = await env.DB.prepare(`
    SELECT s.user_id, u.name AS user_name, u.email, u.avatar_url,
      s.workspace_id, w.name AS workspace_name, wm.role, s.expires_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    JOIN workspaces w ON w.id = s.workspace_id
    JOIN workspace_members wm ON wm.user_id = s.user_id AND wm.workspace_id = s.workspace_id
    WHERE s.token_hash = ? AND s.expires_at > ?
    LIMIT 1
  `).bind(tokenHash, new Date().toISOString()).first<SessionRow>();

  if (!row) return null;
  return {
    user: { id: row.user_id, name: row.user_name, email: row.email, avatarUrl: row.avatar_url },
    workspace: { id: row.workspace_id, name: row.workspace_name, role: row.role },
    expiresAt: row.expires_at,
  };
}

export async function createGoogleAuthorization(origin: string, requestedNext: string | null) {
  const { clientId } = getGoogleConfig();
  const state = randomToken(24);
  const verifier = randomToken(32);
  const challenge = await sha256Base64Url(verifier);
  const nextPath = sanitizeNextPath(requestedNext);
  const redirectUri = `${origin}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "online",
    prompt: "select_account",
  });

  return {
    authorizationUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    state,
    verifier,
    nextPath,
  };
}

export async function exchangeGoogleCode(input: { code: string; verifier: string; origin: string }) {
  const { clientId, clientSecret } = getGoogleConfig();
  const redirectUri = `${input.origin}/api/auth/google/callback`;
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: input.code,
      code_verifier: input.verifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResponse.ok) throw new Error(`Google token exchange failed with status ${tokenResponse.status}.`);
  const token = googleTokenSchema.parse(await tokenResponse.json());
  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!profileResponse.ok) throw new Error(`Google profile request failed with status ${profileResponse.status}.`);

  const profile = googleProfileSchema.parse(await profileResponse.json());
  if (!profile.email_verified) throw new Error("Google account email is not verified.");
  return profile;
}

export async function createSessionForGoogleProfile(profile: GoogleProfile, anonymousWorkspaceId: string | null) {
  const env = await ensureAuthSchema();
  const db = env.DB;
  const now = new Date().toISOString();
  const email = profile.email.trim().toLowerCase();
  const name = profile.name.trim() || profile.given_name.trim() || email.split("@")[0] || "TermBeacon user";

  let user = await db.prepare("SELECT id FROM users WHERE google_sub = ? OR email = ? LIMIT 1")
    .bind(profile.sub, email)
    .first<{ id: string }>();

  if (!user) {
    user = { id: crypto.randomUUID() };
    await db.prepare("INSERT INTO users (id, google_sub, email, name, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(user.id, profile.sub, email, name, profile.picture, now, now).run();
  } else {
    await db.prepare("UPDATE users SET google_sub = ?, email = ?, name = ?, avatar_url = ?, updated_at = ? WHERE id = ?")
      .bind(profile.sub, email, name, profile.picture, now, user.id).run();
  }

  let workspace = await db.prepare(`
    SELECT w.id, w.name, wm.role
    FROM workspace_members wm
    JOIN workspaces w ON w.id = wm.workspace_id
    WHERE wm.user_id = ?
    ORDER BY wm.created_at ASC
    LIMIT 1
  `).bind(user.id).first<{ id: string; name: string; role: "owner" | "member" }>();

  const validAnonymousWorkspace = isUuid(anonymousWorkspaceId) ? anonymousWorkspaceId : null;
  if (!workspace) {
    let workspaceId = crypto.randomUUID();
    if (validAnonymousWorkspace) {
      const claimed = await db.prepare("SELECT id FROM workspaces WHERE id = ? LIMIT 1")
        .bind(validAnonymousWorkspace).first<{ id: string }>();
      if (!claimed && await hasAnonymousData(db, validAnonymousWorkspace)) workspaceId = validAnonymousWorkspace;
    }

    const workspaceName = workspaceNameFor(name);
    await db.batch([
      db.prepare("INSERT INTO workspaces (id, name, owner_user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
        .bind(workspaceId, workspaceName, user.id, now, now),
      db.prepare("INSERT INTO workspace_members (workspace_id, user_id, role, created_at) VALUES (?, ?, 'owner', ?)")
        .bind(workspaceId, user.id, now),
    ]);
    workspace = { id: workspaceId, name: workspaceName, role: "owner" };
  } else if (validAnonymousWorkspace && validAnonymousWorkspace !== workspace.id) {
    const claimed = await db.prepare("SELECT id FROM workspaces WHERE id = ? LIMIT 1")
      .bind(validAnonymousWorkspace).first<{ id: string }>();
    if (!claimed && await hasAnonymousData(db, validAnonymousWorkspace)) {
      await db.batch([
        db.prepare("UPDATE contracts SET workspace_id = ? WHERE workspace_id = ?").bind(workspace.id, validAnonymousWorkspace),
        db.prepare("UPDATE contract_files SET workspace_id = ? WHERE workspace_id = ?").bind(workspace.id, validAnonymousWorkspace),
      ]);
    }
  }

  const rawToken = randomToken(32);
  const tokenHash = await sha256Hex(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
  await db.batch([
    db.prepare("DELETE FROM sessions WHERE expires_at <= ?").bind(now),
    db.prepare("INSERT INTO sessions (token_hash, user_id, workspace_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(tokenHash, user.id, workspace.id, expiresAt, now),
  ]);

  return {
    token: rawToken,
    session: {
      user: { id: user.id, name, email, avatarUrl: profile.picture },
      workspace: { id: workspace.id, name: workspace.name, role: workspace.role },
      expiresAt,
    } satisfies AuthSession,
  };
}

export async function revokeSessionToken(token: string | null) {
  if (!token) return;
  const env = await ensureAuthSchema();
  await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
}

export function sanitizeNextPath(value: string | null | undefined) {
  if (!value) return "/app";
  if (value === "/app" || value.startsWith("/app/") || value.startsWith("/app?")) return value;
  return "/app";
}

export function sessionCookieOptions() {
  return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL_SECONDS };
}

export function oauthCookieOptions() {
  return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: OAUTH_TTL_SECONDS };
}

function workspaceNameFor(name: string) {
  const firstName = name.trim().split(/\s+/)[0];
  return firstName ? `${firstName}'s workspace` : "My workspace";
}

function isUuid(value: string | null): value is string {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

async function hasAnonymousData(db: AuthDatabase, workspaceId: string) {
  try {
    const row = await db.prepare(`
      SELECT (SELECT COUNT(*) FROM contracts WHERE workspace_id = ?) +
        (SELECT COUNT(*) FROM contract_files WHERE workspace_id = ?) AS item_count
    `).bind(workspaceId, workspaceId).first<{ item_count: number }>();
    return Number(row?.item_count ?? 0) > 0;
  } catch {
    return false;
  }
}

function randomToken(byteLength: number) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return toBase64Url(bytes);
}

async function sha256Base64Url(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(digest));
}

async function sha256Hex(value: string) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  return Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
