import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  ANON_WORKSPACE_COOKIE,
  AUTH_SESSION_COOKIE,
  exchangeGoogleCode,
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  sanitizeNextPath,
  sessionCookieOptions,
} from "@/lib/auth";
import {
  provisionGoogleSession,
  SessionProvisionError,
  type SessionProvisionStage,
} from "@/lib/auth-session";

type OAuthFailureReason = "oauth" | "state" | "token" | "profile" | SessionProvisionStage;

export async function GET(request: NextRequest) {
  const store = await cookies();
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = store.get(OAUTH_STATE_COOKIE)?.value;
  const code = request.nextUrl.searchParams.get("code");
  const verifier = store.get(OAUTH_VERIFIER_COOKIE)?.value;
  const nextPath = sanitizeNextPath(store.get(OAUTH_NEXT_COOKIE)?.value);

  if (request.nextUrl.searchParams.get("error")) return oauthFailure(request, "oauth");
  if (!state || !expectedState || state !== expectedState || !code || !verifier) {
    return oauthFailure(request, "state");
  }

  let profile: Awaited<ReturnType<typeof exchangeGoogleCode>>;
  try {
    profile = await exchangeGoogleCode({ code, verifier, origin: request.nextUrl.origin });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Google OAuth error";
    const reason: OAuthFailureReason = /token exchange/i.test(message)
      ? "token"
      : /profile request|email is not verified/i.test(message)
        ? "profile"
        : "oauth";
    console.error(JSON.stringify({ event: "google_oauth_exchange_failed", reason, message }));
    return oauthFailure(request, reason);
  }

  try {
    const anonymousWorkspaceId = store.get(ANON_WORKSPACE_COOKIE)?.value ?? null;
    const { token, session } = await provisionGoogleSession(profile, anonymousWorkspaceId);
    const response = NextResponse.redirect(new URL(nextPath, request.nextUrl.origin), 302);
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(AUTH_SESSION_COOKIE, token, sessionCookieOptions());
    response.cookies.set(ANON_WORKSPACE_COOKIE, session.workspace.id, sessionCookieOptions());
    clearOAuthCookies(response);
    return response;
  } catch (error) {
    const reason: OAuthFailureReason = error instanceof SessionProvisionError ? error.stage : "session";
    const message = error instanceof Error ? error.message : "Unknown session provisioning error";
    console.error(JSON.stringify({ event: "google_session_provision_failed", reason, message }));
    return oauthFailure(request, reason);
  }
}

function oauthFailure(request: NextRequest, reason: OAuthFailureReason) {
  const response = NextResponse.redirect(new URL(`/sign-in?error=${reason}`, request.nextUrl.origin), 302);
  response.headers.set("Cache-Control", "no-store");
  clearOAuthCookies(response);
  return response;
}

function clearOAuthCookies(response: NextResponse) {
  response.cookies.delete(OAUTH_STATE_COOKIE);
  response.cookies.delete(OAUTH_VERIFIER_COOKIE);
  response.cookies.delete(OAUTH_NEXT_COOKIE);
}
