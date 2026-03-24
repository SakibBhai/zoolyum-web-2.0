import { NextResponse } from 'next/server'
import { auth } from '@/lib/next-auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      email,
      passwordProvided: !!password,
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
        NODE_ENV: process.env.NODE_ENV,
      },
      test: 'Server-side authentication check'
    }

    // Test 1: Check if credentials match
    const ADMIN_CREDENTIALS = {
      email: "admin@zoolyum.com",
      password: "admin123"
    }

    const credentialsMatch = email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password
    diagnostics.credentialsMatch = credentialsMatch

    // Test 2: Try to get current session (without logging in)
    try {
      const session = await auth()
      diagnostics.currentSession = session ? 'EXISTS' : 'NONE'
      if (session?.user) {
        diagnostics.sessionUser = {
          email: session.user.email,
          isAdmin: session.user.isAdmin
        }
      }
    } catch (authError) {
      diagnostics.authError = authError instanceof Error ? authError.message : 'Unknown auth error'
    }

    // Test 3: Verify NextAuth configuration
    try {
      diagnostics.nextAuthConfigured = true
    } catch (configError) {
      diagnostics.nextAuthConfigured = false
      diagnostics.configError = configError instanceof Error ? configError.message : 'Unknown error'
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

