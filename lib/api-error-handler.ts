import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class DatabaseConnectionError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: any): NextResponse {
  console.error('API Error:', error);

  // Handle Prisma-specific errors
  if (error.code) {
    switch (error.code) {
      case 'P1001':
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later.' },
          { status: 503 }
        );
      case 'P1008':
        return NextResponse.json(
          { error: 'Database operation timed out. Please try again.' },
          { status: 504 }
        );
      case 'P2002':
        return NextResponse.json(
          { error: 'A record with this information already exists.' },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          { error: 'Record not found.' },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          { error: 'Database operation failed.' },
          { status: 500 }
        );
    }
  }

  // Handle custom errors
  if (error instanceof DatabaseConnectionError) {
    return NextResponse.json(
      { error: 'Database connection issue. Please try again later.' },
      { status: 503 }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // Handle generic errors
  return NextResponse.json(
    { error: 'An unexpected error occurred.' },
    { status: 500 }
  );
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on validation errors or 4xx errors
      if (error instanceof ValidationError || 
          (error.status && error.status >= 400 && error.status < 500)) {
        throw error;
      }

      // Check if it's a connection error that should be retried
      const isRetryableError = 
        error.code === 'P1001' || // Connection error
        error.code === 'P1008' || // Timeout
        error.message?.includes('connection') ||
        error.message?.includes('timeout') ||
        error.message?.includes('ECONNRESET');

      if (!isRetryableError || attempt === maxRetries) {
        throw error;
      }

      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError;
}