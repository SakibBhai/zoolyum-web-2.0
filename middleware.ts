import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Allow access to login and signup pages for everyone
  if (pathname === "/admin/login" || pathname === "/admin/signup") {
    return response;
  }

  // Check if the path is for any admin route
  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If the user is not authenticated or not an admin, redirect to login
    if (!token || token.role !== "ADMIN") {
      const url = new URL("/admin/login", request.url);
      return NextResponse.redirect(url);
    }

    // Add additional security headers for admin routes
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};