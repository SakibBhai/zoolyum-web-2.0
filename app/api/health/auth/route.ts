import { NextResponse } from 'next/server'
import { auth } from '@/lib/next-auth'

export async function GET() {
  try {
    // Check environment variables
    const envChecks = {
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_SECRET_LENGTH: process.env.NEXTAUTH_SECRET?.length || 0,
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    }

    // Test NextAuth initialization
    let authTest = 'not_tested'
    try {
      const session = await auth()
      authTest = 'success'
    } catch (error) {
      authTest = `failed: ${error instanceof Error ? error.message : 'unknown error'}`
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envChecks,
      auth_test: authTest,
      recommendations: generateRecommendations(envChecks)
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

function generateRecommendations(envChecks: Record<string, any>) {
  const recommendations = []

  if (!envChecks.NEXTAUTH_SECRET) {
    recommendations.push({
      critical: true,
      issue: 'NEXTAUTH_SECRET is missing',
      solution: 'Add NEXTAUTH_SECRET to Vercel environment variables. Generate with: openssl rand -base64 32'
    })
  } else if (envChecks.NEXTAUTH_SECRET_LENGTH < 10) {
    recommendations.push({
      critical: true,
      issue: 'NEXTAUTH_SECRET is too weak',
      solution: 'Use a stronger secret (at least 32 characters). Generate with: openssl rand -base64 32'
    })
  }

  if (!envChecks.NEXTAUTH_URL) {
    recommendations.push({
      critical: true,
      issue: 'NEXTAUTH_URL is missing',
      solution: 'Add NEXTAUTH_URL to Vercel environment variables. Value should be: https://zoolyum-web-20.vercel.app'
    })
  }

  if (!envChecks.DATABASE_URL) {
    recommendations.push({
      critical: true,
      issue: 'DATABASE_URL is missing',
      solution: 'Add DATABASE_URL to Vercel environment variables'
    })
  }

  return recommendations
}
