import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "tb_session";
const WORKSPACE_COOKIE = "tb_workspace";

export function proxy(request: NextRequest) {
  if (request.cookies.get(SESSION_COOKIE) || request.cookies.get(WORKSPACE_COOKIE)) {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set({
    name: WORKSPACE_COOKIE,
    value: crypto.randomUUID(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = { matcher: ["/app/:path*", "/sign-in"] };
