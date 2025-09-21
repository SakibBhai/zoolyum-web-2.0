import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Edge runtime compatible Prisma client initialization
function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL environment variable is not set');
    // Return a mock client for development or testing without database
    return new PrismaClient();
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    // Connection pool configuration for better stability
    connectionLimit: 10,
    // Retry configuration for connection issues
    errorFormat: 'pretty',
    // Transaction options
    transactionOptions: {
      maxWait: 5000, // 5 seconds
      timeout: 10000, // 10 seconds
    }
  });
}

// Create a singleton instance with connection management
let prismaInstance: PrismaClient | undefined;

function getPrismaClient() {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient();
    
    // Handle connection errors gracefully
    prismaInstance.$on('error' as any, (e) => {
      console.error('Prisma connection error:', e);
    });
  }
  
  return prismaInstance;
}

export const prisma = global.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
  }
});