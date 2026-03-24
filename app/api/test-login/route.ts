import { NextResponse } from 'next/server'
import { signIn } from 'next-auth/react'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const diagnostics = {
      timestamp: new Date().toISOString(),
      email,
      passwordProvided: !!password,
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
        NODE_ENV: process.env.NODE_ENV,
      }
    }

    // Try to sign in
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      diagnostics.signInResult = result

      if (result?.error) {
        diagnostics.error = result.error
        diagnostics.success = false
      } else if (result?.ok) {
        diagnostics.success = true
        diagnostics.message = 'Sign in successful'
      } else {
        diagnostics.success = false
        diagnostics.message = 'Unknown result from signIn'
      }
    } catch (signInError) {
      diagnostics.signInError = signInError instanceof Error ? signInError.message : 'Unknown error'
      diagnostics.success = false
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
