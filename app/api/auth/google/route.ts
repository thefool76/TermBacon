import { NextRequest, NextResponse } from "next/server";
import {
  createGoogleAuthorization,
  isGoogleAuthConfigured,
  oauthCookieOptions,
  OAUTH_NEXT_COOKIE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!isGoogleAuthConfigured()) {
    return NextResponse.redirect(new URL("/sign-in?error=config", request.url));
  }

  const { authorizationUrl, state, verifier, nextPath } = await createGoogleAuthorization(
    request.nextUrl.origin,
    request.nextUrl.searchParams.get("next"),
  );

  const response = NextResponse.redirect(authorizationUrl);
  const options = oauthCookieOptions();
  response.cookies.set(OAUTH_STATE_COOKIE, state, options);
  response.cookies.set(OAUTH_VERIFIER_COOKIE, verifier, options);
  response.cookies.set(OAUTH_NEXT_COOKIE, nextPath, options);
  return response;
}
