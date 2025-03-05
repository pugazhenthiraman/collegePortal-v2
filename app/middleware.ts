/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const roleRoutes: Record<string, string[]> = {
  SUPER_ADMIN: ["/admin", "/admin/dashboard"],
  COLLEGE: ["/college", "/college/dashboard"],
  DEPARTMENT: ["/department", "/department/dashboard"],
  HOD: ["/hod", "/hod/dashboard"],
  FACULTY: ["/faculty", "/faculty/dashboard"],
  STUDENT: ["/student", "/student/dashboard"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // ✅ Allow public routes (Improved to allow /auth/* sub-routes)
  const publicRoutes = [
    "/",
    "/auth",
    "/auth/login",
    "/api/auth/signin",
    "/auth/superadmin",
    "/auth/college",
    "/auth/department",
    "/auth/hod",
    "/auth/faculty",
    "/auth/student",
  ];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ✅ Unauthorized API requests return JSON instead of redirecting
  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // ✅ Prevent crashes if `role` is missing
  const userRole: any = token.role || "UNKNOWN";

  const allowedRoutes = roleRoutes[userRole] || [];
  if (!allowedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next(); // ✅ Allow request to proceed
}

// ✅ Apply middleware only to protected routes
export const config = {
  matcher: [
    "/admin/:path*",
    "/college/:path*",
    "/department/:path*",
    "/hod/:path*",
    "/faculty/:path*",
    "/student/:path*",
    "/api/admin/:path*", // ✅ Secure API routes for admin
    "/api/college/:path*", // ✅ Secure API routes for colleges
  ],
};
