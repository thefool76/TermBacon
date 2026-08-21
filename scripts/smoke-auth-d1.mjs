import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";

const suffix = randomUUID();
const userId = `__termbeacon_ci_user_${suffix}`;
const workspaceId = `__termbeacon_ci_workspace_${suffix}`;
const tokenHash = `__termbeacon_ci_session_${suffix}`;
const email = `termbeacon-ci-${suffix}@example.invalid`;
const now = new Date().toISOString();
const expiresAt = new Date(Date.now() + 60_000).toISOString();

function sql(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function execute(statement) {
  const output = execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "DB", "--remote", "--yes", "--json", "--command", statement],
    { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
  );
  const parsed = JSON.parse(output);
  const entries = Array.isArray(parsed) ? parsed : [parsed];
  for (const entry of entries) {
    if (entry && entry.success === false) {
      throw new Error(`D1 command reported failure: ${JSON.stringify(entry)}`);
    }
  }
  return entries.flatMap((entry) => Array.isArray(entry?.results) ? entry.results : []);
}

function cleanup() {
  try {
    execute(`DELETE FROM users WHERE id = ${sql(userId)};`);
  } catch (error) {
    console.error(`Auth smoke cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

try {
  const tables = execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('users','workspaces','workspace_members','sessions') ORDER BY name;");
  const names = new Set(tables.map((row) => row.name));
  for (const required of ["users", "workspaces", "workspace_members", "sessions"]) {
    if (!names.has(required)) throw new Error(`Missing auth table: ${required}`);
  }

  const foreignKeyProblems = execute("PRAGMA foreign_key_check;");
  if (foreignKeyProblems.length > 0) {
    throw new Error(`D1 foreign-key check returned ${foreignKeyProblems.length} problem(s).`);
  }

  execute(`INSERT INTO users (id, google_sub, email, name, avatar_url, created_at, updated_at) VALUES (${sql(userId)}, ${sql(userId)}, ${sql(email)}, 'CI Auth Smoke', '', ${sql(now)}, ${sql(now)});`);
  execute(`INSERT INTO workspaces (id, name, owner_user_id, created_at, updated_at) VALUES (${sql(workspaceId)}, 'CI workspace', ${sql(userId)}, ${sql(now)}, ${sql(now)});`);
  execute(`INSERT INTO workspace_members (workspace_id, user_id, role, created_at) VALUES (${sql(workspaceId)}, ${sql(userId)}, 'owner', ${sql(now)});`);
  execute(`INSERT INTO sessions (token_hash, user_id, workspace_id, expires_at, created_at) VALUES (${sql(tokenHash)}, ${sql(userId)}, ${sql(workspaceId)}, ${sql(expiresAt)}, ${sql(now)});`);

  const joined = execute(`SELECT COUNT(*) AS count FROM sessions s JOIN users u ON u.id = s.user_id JOIN workspaces w ON w.id = s.workspace_id JOIN workspace_members wm ON wm.workspace_id = s.workspace_id AND wm.user_id = s.user_id WHERE s.token_hash = ${sql(tokenHash)} AND wm.role = 'owner';`);
  if (Number(joined[0]?.count ?? 0) !== 1) {
    throw new Error("Joined auth session read did not return exactly one row.");
  }

  cleanup();
  const leftovers = execute(`SELECT (SELECT COUNT(*) FROM users WHERE id = ${sql(userId)}) + (SELECT COUNT(*) FROM workspaces WHERE id = ${sql(workspaceId)}) + (SELECT COUNT(*) FROM sessions WHERE token_hash = ${sql(tokenHash)}) AS count;`);
  if (Number(leftovers[0]?.count ?? 0) !== 0) {
    throw new Error("Auth smoke cleanup/cascade verification left rows behind.");
  }

  console.log("Remote D1 auth smoke test passed: schema, foreign keys, user, workspace, membership, session, joined read, cleanup.");
} catch (error) {
  cleanup();
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
}
