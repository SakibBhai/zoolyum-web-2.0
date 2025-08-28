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
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
}

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}