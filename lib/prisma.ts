import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Environment validation with fallback for build time
import { getDatabaseConfig } from './env-validation'

const getDatabaseUrl = (): string => {
  try {
    return getDatabaseConfig()
  } catch (error) {
    // During build time, provide a placeholder URL to prevent constructor errors
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.warn('DATABASE_URL not found. Using placeholder for build.')
      return 'postgresql://placeholder:placeholder@placeholder:5432/placeholder'
    }
    throw error
  }
}

// Enhanced Prisma client with better error handling and connection management
const createPrismaClient = () => {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      // Enhanced error formatting for better debugging
      errorFormat: 'pretty',
      // Transaction options for better reliability
      transactionOptions: {
        maxWait: 5000, // 5 seconds
        timeout: 10000, // 10 seconds
      },
      datasources: {
        db: {
          url: getDatabaseUrl(),
        },
      },
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Connection health check with retry logic
export async function checkDatabaseConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch (error: any) {
      console.warn(`Database connection attempt ${i + 1}/${retries} failed:`, error.message)
      if (i === retries - 1) {
        console.error('All database connection attempts failed')
        return false
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
  return false
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})