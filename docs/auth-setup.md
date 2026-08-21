# TermBeacon authentication setup

TermBeacon uses Google OAuth for identity and D1 for users, workspaces, memberships, and hashed sessions. No Google access or refresh token is stored.

## Google Cloud

Create an OAuth 2.0 Client ID with application type **Web application**.

For the current production Worker add:

- Authorized origin: `https://termbeacon.sumitmishra1135.workers.dev`
- Authorized redirect URI: `https://termbeacon.sumitmishra1135.workers.dev/api/auth/google/callback`

If a custom domain is added later, add the same `/api/auth/google/callback` URI for that domain before switching traffic.

The requested scopes are only `openid email profile`.

## GitHub Actions secrets

In the repository, open **Settings → Secrets and variables → Actions** and add:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

The deployment workflow uploads them to the Cloudflare Worker as encrypted Worker secrets after a successful code deploy and D1 migration. If they are absent, the app remains in temporary-workspace mode until the first account is activated.

After adding the secrets, re-run **Deploy TermBeacon to Cloudflare** once.

## Access behavior

- Before OAuth is configured, the current anonymous testing workspace continues to work.
- On the first Google sign-in, existing contracts from that browser's anonymous workspace are claimed into the signed-in workspace when safe to do so.
- After the first real user exists, authenticated access stays enforced even if OAuth secrets are accidentally removed later. Existing workspaces never fall back to anonymous access.
- Session cookies are HTTP-only, Secure in production, SameSite=Lax, and the database stores only a SHA-256 hash of each session token.
