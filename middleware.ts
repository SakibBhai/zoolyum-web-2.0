import { NextRequest, NextResponse } from 'next/server'
import { getStackServerApp } from './lib/stack-server'

export async function middleware(request: NextRequest) {
  // Skip middleware for Next.js internal requests
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('_rsc=') ||
    request.nextUrl.search.includes('_rsc=') ||
    request.nextUrl.pathname.includes('.hot-update.') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next()
  }
  
  // Development bypass for Stack Auth issues
  // Check if we're in development by looking for localhost or dev indicators
  const isDevelopment = request.nextUrl.hostname === 'localhost' || 
                       request.nextUrl.hostname === '127.0.0.1' ||
                       request.nextUrl.hostname.includes('192.168') ||
                       request.nextUrl.port === '3000' ||
    request.nextUrl.port === '3001' ||
    request.nextUrl.port === '3002'
  
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // In development, bypass authentication for admin routes
    if (isDevelopment) {
      console.log('Development mode: Bypassing Stack Auth for admin routes')
      return NextResponse.next()
    }
    
    // Production: Get the user from Stack Auth
    try {
      const stackServerApp = await getStackServerApp()
      const user = await stackServerApp.getUser()
      
      // Redirect to login if not authenticated
      if (!user) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch (error) {
      console.error('Stack Auth error in middleware:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
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
    '/((?!api|_next|favicon.ico|.*\\.).*)',
  ],
}