import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()
  const results = {
    status: 'unknown',
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      error: null as string | null,
      adminUsersCount: 0,
      blogPostsCount: 0,
    },
    environment: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    }
  }

  try {
    // Test database connection
    await prisma.$connect()
    results.database.connected = true

    // Test queries
    const adminUsers = await prisma.adminUser.count()
    const blogPosts = await prisma.blogPost.count()

    results.database.adminUsersCount = adminUsers
    results.database.blogPostsCount = blogPosts
    results.status = 'healthy'

  } catch (error) {
    results.status = 'error'
    results.database.error = error instanceof Error ? error.message : 'Unknown error'
    results.database.connected = false
  } finally {
    await prisma.$disconnect()
  }

  return NextResponse.json(results)
}
