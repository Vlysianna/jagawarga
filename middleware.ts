import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/citizen": ["citizen"],
  "/rt": ["rt"],
  "/rw": ["rw"],
  "/pemda": ["pemda"],
};

const ROLE_DASHBOARD: Record<string, string> = {
  citizen: "/citizen/dashboard",
  rt: "/rt/dashboard",
  rw: "/rw/dashboard",
  pemda: "/pemda/dashboard",
};

function getAuthFromCookie(request: NextRequest) {
  const cookie = request.cookies.get("jagawarga_auth");
  if (!cookie?.value) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie.value));
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = getAuthFromCookie(request);

  // auth page
  if (pathname.startsWith("/auth")) {
    if (user && user.role && ROLE_DASHBOARD[user.role]) {
      return NextResponse.redirect(
        new URL(ROLE_DASHBOARD[user.role], request.url)
      );
    }
    return NextResponse.next();
  }

  // auth checking
  for (const [prefix, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (!user) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      if (!allowedRoles.includes(user.role)) {
        const correctDashboard = ROLE_DASHBOARD[user.role] || "/auth/login";
        return NextResponse.redirect(new URL(correctDashboard, request.url));
      }

      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/citizen/:path*",
    "/rt/:path*",
    "/rw/:path*",
    "/pemda/:path*",
    "/auth/:path*",
  ],
};
