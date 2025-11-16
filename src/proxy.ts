import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

const URI_SIGNIN = process.env.NEXT_PUBLIC_URI_SIGNIN ?? "";
const URI_SIGNUP = process.env.NEXT_PUBLIC_URI_SIGNUP ?? "";
const URI_WELCOME = process.env.NEXT_PUBLIC_URI_WELCOME ?? "";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const pathname = request.nextUrl.pathname;
  const isAuthenticated = !!session;

  const protectedRoutes = ["/dashboard", "/users"];
  const publicRoutes = [URI_SIGNIN, URI_SIGNUP];

  if (pathname === "/") {
    return isAuthenticated
      ? NextResponse.redirect(new URL(URI_WELCOME, request.url))
      : NextResponse.redirect(new URL(URI_SIGNIN, request.url));
  }

  if (isMatchSome(pathname, protectedRoutes)) {
    return isAuthenticated
      ? NextResponse.next()
      : NextResponse.redirect(new URL(URI_SIGNIN, request.url));
  }

  if (isMatchSome(pathname, publicRoutes)) {
    return isAuthenticated
      ? NextResponse.redirect(new URL(URI_WELCOME, request.url))
      : NextResponse.next();
  }

  return NextResponse.next();
}

// 일치하는 경로가 존재하는지 확인
function isMatchSome(pathname: string, urls: string[]) {
  return urls.some((url) => pathname.startsWith(url));
}

export const config = {
  // Match all paths except:
  // - /api (API routes handle their own auth via withPermission)
  // - /_next (Next.js internals)
  // - /resources (public static directory)
  // - /favicon.ico, /robots.txt (static files)
  // - Public paths registered in database will be allowed by canAccessPage
  matcher: [
    "/((?!api|_next/static|_next/image|resources|favicon.ico|robots.txt).*)",
  ],
};
