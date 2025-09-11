import { NextResponse } from 'next/server';

/**
 * CORS configuration for API routes
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours
};

/**
 * Handle CORS preflight requests
 */
export function handleCorsOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * Create a NextResponse with CORS headers
 */
export function createCorsResponse(data: any, init?: ResponseInit) {
  const response = NextResponse.json(data, init);
  
  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Create an error response with CORS headers
 */
export function createCorsErrorResponse(message: string, status: number = 500) {
  return createCorsResponse({ error: message }, { status });
}