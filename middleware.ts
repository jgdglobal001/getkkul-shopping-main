export const config = {
  matcher: [
    "/account/:path*",
    "/cart/:path*",
    "/auth/:path*",
    "/success/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/delivery-dashboard/:path*",
    "/packer-dashboard/:path*",
    "/account-dashboard/:path*",
    "/user-dashboard/:path*",
    "/dashboard/:path*",
  ],
};

import { NextResponse } from "next/server";
import { auth } from "./auth";
import { checkRouteAccess } from "@/lib/rbac/middleware";
import { UserRole, getDefaultDashboardRoute } from "@/lib/rbac/roles";

const protectedRoutes = [
  "/account",
  "/checkout",
  "/success",
  "/admin",
  "/delivery-dashboard",
  "/packer-dashboard",
  "/account-dashboard",
  "/user-dashboard",
  "/dashboard",
];
const authRoutes = ["/auth/signin", "/auth/register"];

export async function middleware(request: any) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  // Restrict protected routes to logged-in users
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session?.user) {
      // 현재 URL을 callbackUrl로 전달 (쿼리 파라미터 포함)
      const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", currentUrl);
      return NextResponse.redirect(signInUrl);
    }

    // Check role-based access
    const userRole = session.user.role as UserRole;

    // Special explicit check for admin routes
    if (pathname.startsWith("/account/admin")) {
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    }

    if (!checkRouteAccess(pathname, userRole)) {
      // Special case: redirect non-admin users trying to access /account/admin to /account
      if (pathname.startsWith("/account/admin") && userRole !== "admin") {
        return NextResponse.redirect(new URL("/account", request.url));
      }

      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Prevent access to auth pages for logged-in users
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (session?.user) {
      const userRole = session.user.role as UserRole;
      const dashboardRoute = getDefaultDashboardRoute(userRole);
      return NextResponse.redirect(new URL(dashboardRoute, request.url));
    }
  }

  // Handle success page - ensure user is logged in and has session_id
  if (pathname.startsWith("/success")) {
    if (!session?.user) {
      const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", currentUrl);
      return NextResponse.redirect(signInUrl);
    }

    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Handle checkout page - ensure user is logged in
  if (pathname.startsWith("/checkout")) {
    if (!session?.user) {
      const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", currentUrl);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}
