import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.cookies.get("tb_workspace")) return NextResponse.next();

  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set({
    name: "tb_workspace",
    value: crypto.randomUUID(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = { matcher: ["/app/:path*"] };
