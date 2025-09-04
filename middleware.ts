import { NextRequest, NextResponse } from 'next/server'
import { getStackServerApp } from './lib/stack-server'

export async function middleware(request: NextRequest) {
  // Skip middleware for Next.js internal requests and static assets
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/_vercel') ||
    request.nextUrl.pathname.includes('.hot-update.') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/) ||
    // Skip for React Server Component requests - Enhanced RSC detection
    request.headers.get('RSC') === '1' ||
    request.headers.get('Next-Router-Prefetch') === '1' ||
    request.nextUrl.searchParams.has('_rsc') ||
    // Skip for navigation requests with RSC parameters
    (request.nextUrl.searchParams.has('_rsc') && request.method === 'GET')
  ) {
    return NextResponse.next()
  }
  
  // Environment detection
  const isDevelopment = process.env.NODE_ENV === 'development' ||
                       request.nextUrl.hostname === 'localhost' || 
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
  
  // Set comprehensive security headers
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )
  
  // Content Security Policy (CSP) - Updated for Next.js 15 compatibility
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live ws: wss:",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Cache control for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }
  
  return response
}

export const config = {
  matcher: [
    // Admin routes
    '/admin/:path*',
    // Public routes - more specific matcher to avoid RSC conflicts
    '/((?!api|_next|_vercel|favicon.ico|.*\\.|.*\\.hot-update\\.).*)',
  ],
}