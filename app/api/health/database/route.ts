import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test basic database connectivity
    await prisma.$queryRaw`SELECT 1`
    
    // Test a simple query to verify schema access
    const testQuery = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "contacts" LIMIT 1`
    
    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected',
      connection: 'active',
      schema: 'accessible',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      // Don't expose sensitive connection details in production
      ...(process.env.NODE_ENV === 'development' && {
        connectionInfo: {
          hasUrl: !!process.env.DATABASE_URL,
          urlLength: process.env.DATABASE_URL?.length || 0
        }
      })
    })
  } catch (error: any) {
    console.error('Database health check failed:', error)
    
    return NextResponse.json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
}