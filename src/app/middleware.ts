import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token; // NextAuth provides the token here

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Check user role
    const userRole = token.role; // Ensure role exists

    if (userRole !== "ADMIN" && userRole !== "EDITOR") {
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set(
        "error",
        "Access Denied! You do not have permission to access this page."
      );
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth/login", // Redirects unauthenticated users to login
    },
  }
);

export const config = {
  matcher: ["/:path*"], // Protects all routes
};
