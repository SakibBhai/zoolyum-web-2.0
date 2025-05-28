import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // Update headers to set the cookie
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
          return response
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          // Update headers to remove the cookie
          const response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
          return response
        },
      },
    },
  )

  // Get the session from the request
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  const publicRoutes = ["/admin/login", "/admin/signup"]
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  // If there's no session and the request is for an admin route
  if (!session && !isPublicRoute && request.nextUrl.pathname.startsWith("/admin")) {
    // Redirect to the login page
    const redirectUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session, check if the user is an admin
  if (session && request.nextUrl.pathname.startsWith("/admin") && !isPublicRoute) {
    // Check if the user exists in the admin_users table
    const { data: adminUser, error } = await supabase.from("admin_users").select("*").eq("id", session.user.id).single()

    if (error || !adminUser) {
      // User is authenticated but not an admin, redirect to login
      const redirectUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If there's a session and the request is for the login page
  if (session && (request.nextUrl.pathname === "/admin/login" || request.nextUrl.pathname === "/admin/signup")) {
    // Redirect to the dashboard
    const redirectUrl = new URL("/admin/dashboard", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
