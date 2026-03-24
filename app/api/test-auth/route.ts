import { NextResponse } from 'next/server'
import { auth } from '@/lib/next-auth'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      NODE_ENV: process.env.NODE_ENV || 'MISSING',
    },
    nextauthTest: 'unknown'
  }

  // Test NextAuth without going through middleware
  try {
    const session = await auth()
    diagnostics.nextauthTest = 'SUCCESS'
    diagnostics.session = session ? 'EXISTS' : 'NONE'
  } catch (error) {
    diagnostics.nextauthTest = 'FAILED'
    diagnostics.error = error instanceof Error ? error.message : 'Unknown error'
    diagnostics.errorStack = error instanceof Error ? error.stack : null
  }

  return NextResponse.json(diagnostics)
}
