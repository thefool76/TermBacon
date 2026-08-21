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

type OAuthFailureReason = "oauth" | "state" | "token" | "profile" | "session";

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
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(AUTH_SESSION_COOKIE, token, sessionCookieOptions());
    response.cookies.set(ANON_WORKSPACE_COOKIE, session.workspace.id, sessionCookieOptions());
    clearOAuthCookies(response);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown OAuth error";
    const reason = classifyOAuthFailure(message);
    console.error(JSON.stringify({ event: "google_oauth_callback_failed", reason, message }));
    return oauthFailure(request, reason);
  }
}

function classifyOAuthFailure(message: string): OAuthFailureReason {
  if (/token exchange/i.test(message)) return "token";
  if (/profile request|email is not verified|email.*verified/i.test(message)) return "profile";
  return "session";
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
