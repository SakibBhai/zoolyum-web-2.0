"use server"

import { prisma } from '@/lib/prisma'

// Helper function for retry logic with exponential backoff
async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      retryCount++;
      
      // Check if it's a connection error
      const isConnectionError = error.message?.includes('connection') ||
                               error.message?.includes('timeout') ||
                               error.message?.includes('Closed') ||
                               error.code === 'P1001' || // Connection error
                               error.code === 'P1008' || // Timeout
                               error.code === 'P1017';   // Server closed connection
      
      if (isConnectionError && retryCount <= maxRetries) {
        console.warn(`Database connection error (attempt ${retryCount}/${maxRetries + 1}):`, error.message);
        
        // Exponential backoff: wait 1s, 2s, 4s
        const delay = Math.pow(2, retryCount - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If not a connection error or max retries exceeded, throw the error
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}

export async function getProjectCategories(): Promise<string[]> {
  try {
    const projects = await retryDatabaseOperation(async () => {
      return await prisma.project.findMany({
        select: {
          type: true,
        },
        orderBy: {
          type: 'asc',
        },
      });
    });

    // Get unique categories and filter out null/undefined values
    const uniqueCategories = [...new Set(projects.map(item => item.type).filter(Boolean))] as string[]
    return uniqueCategories
  } catch (error: any) {
    console.error('Error fetching project categories:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return []
  }
}

export async function getFeaturedProject() {
  try {
    const featuredProject = await retryDatabaseOperation(async () => {
      return await prisma.project.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    return featuredProject
  } catch (error: any) {
    console.error('Error fetching featured project:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return null
  }
}