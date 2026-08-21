import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  ANON_WORKSPACE_COOKIE,
  AUTH_SESSION_COOKIE,
  createSessionForGoogleProfile,
  exchangeGoogleCode,
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  sanitizeNextPath,
  sessionCookieOptions,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const store = await cookies();
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = store.get(OAUTH_STATE_COOKIE)?.value;
  const code = request.nextUrl.searchParams.get("code");
  const verifier = store.get(OAUTH_VERIFIER_COOKIE)?.value;
  const nextPath = sanitizeNextPath(store.get(OAUTH_NEXT_COOKIE)?.value);

  if (request.nextUrl.searchParams.get("error")) return oauthFailure(request, "oauth");
  if (!state || !expectedState || state !== expectedState || !code || !verifier) return oauthFailure(request, "state");

  try {
    const profile = await exchangeGoogleCode({ code, verifier, origin: request.nextUrl.origin });
    const anonymousWorkspaceId = store.get(ANON_WORKSPACE_COOKIE)?.value ?? null;
    const { token, session } = await createSessionForGoogleProfile(profile, anonymousWorkspaceId);

    const response = NextResponse.redirect(new URL(nextPath, request.nextUrl.origin), 302);
    response.cookies.set(AUTH_SESSION_COOKIE, token, sessionCookieOptions());
    response.cookies.set(ANON_WORKSPACE_COOKIE, session.workspace.id, sessionCookieOptions());
    clearOAuthCookies(response);
    return response;
  } catch (error) {
    console.error(JSON.stringify({
      event: "google_oauth_callback_failed",
      message: error instanceof Error ? error.message : "Unknown OAuth error",
    }));
    return oauthFailure(request, "oauth");
  }
}

function oauthFailure(request: NextRequest, reason: "oauth" | "state") {
  const response = NextResponse.redirect(new URL(`/sign-in?error=${reason}`, request.nextUrl.origin), 302);
  clearOAuthCookies(response);
  return response;
}

function clearOAuthCookies(response: NextResponse) {
  response.cookies.delete(OAUTH_STATE_COOKIE);
  response.cookies.delete(OAUTH_VERIFIER_COOKIE);
  response.cookies.delete(OAUTH_NEXT_COOKIE);
}
