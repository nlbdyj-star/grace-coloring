import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for auth token (in production, verify with Supabase)
    const authToken = request.cookies.get("sb-auth-token")?.value;

    if (!authToken) {
      // Redirect to login if no token
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
