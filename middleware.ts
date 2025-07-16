import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from './stack'

export async function middleware(request: NextRequest) {
  // Get the user from Stack Auth
  const user = await stackServerApp.getUser({ request })
  
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // Redirect to login if not authenticated
    if (!user) {
      return NextResponse.redirect(new URL('/handler/sign-in', request.url))
    }
  }
  
  // Set security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )
  
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}