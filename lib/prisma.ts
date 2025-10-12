import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma client with better error handling and connection management
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  // Enhanced error formatting for better debugging
  errorFormat: 'pretty',
  // Transaction options for better reliability
  transactionOptions: {
    maxWait: 5000, // 5 seconds
    timeout: 10000, // 10 seconds
  },
  // Vercel-specific optimizations for serverless environment
  ...(process.env.VERCEL && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }),
})

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