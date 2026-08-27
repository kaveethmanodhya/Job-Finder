import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const path = req.nextUrl.pathname;
    const role = token?.role;

    // 1. Admin route protection
    if (path.startsWith("/admin")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/signup?error=AccessDenied", req.url));
      }
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/?error=UnauthorizedAdmin", req.url));
      }
    }

    // 2. Onboarding route protection & redirection
    if (path === "/onboarding") {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/signup", req.url));
      }
      if (role && role !== "UNASSIGNED" && role !== "USER") {
        // Already onboarded, redirect based on role
        if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
        if (role === "COMPANY") return NextResponse.redirect(new URL("/search", req.url));
        return NextResponse.redirect(new URL("/jobs", req.url));
      }
    }

    // 3. Force onboarding if UNASSIGNED user visits protected routes
    if (isAuth && (role === "UNASSIGNED" || role === "USER") && path !== "/onboarding" && !path.startsWith("/api")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // 4. Job creation requires COMPANY or ADMIN
    if (path.startsWith("/jobs/create")) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/signup?error=AccessDenied", req.url));
      }
      if (role !== "COMPANY" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/jobs?error=CompanyRoleRequired", req.url));
      }
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/onboarding",
    "/signup",
    "/jobs/create/:path*",
  ],
};
