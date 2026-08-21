import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE, revokeSessionToken, sessionCookieOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if ((origin && origin !== request.nextUrl.origin) || (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite))) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const token = (await cookies()).get(AUTH_SESSION_COOKIE)?.value ?? null;
  await revokeSessionToken(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
  return response;
}
