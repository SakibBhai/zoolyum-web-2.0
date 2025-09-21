import { NextRequest, NextResponse } from 'next/server'
import { createTestimonial, fetchTestimonials, validateTestimonialData } from '@/lib/testimonial-operations'
import { getCurrentUser } from '@/lib/stack-auth'

// GET /api/testimonials - Fetch testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const approved = searchParams.get('approved')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // For public access, only return approved testimonials
    const user = await getCurrentUser()
    const isAdmin = !!user
    
    const options: any = {
      limit: Math.min(limit, 100), // Cap at 100
      offset: Math.max(offset, 0)
    }
    
    // If not admin, force approved = true
    if (!isAdmin) {
      options.approved = true
    } else {
      // Admin can filter by approved status
      if (approved !== null) {
        options.approved = approved === 'true'
      }
    }
    
    // Featured filter
    if (featured !== null) {
      options.featured = featured === 'true'
    }
    
    // Add retry logic for database operations
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount <= maxRetries) {
      try {
        const testimonials = await fetchTestimonials(options)
        return NextResponse.json(testimonials)
      } catch (dbError: any) {
        retryCount++;
        
        // Check if it's a connection error
        const isConnectionError = dbError.message?.includes('connection') ||
                                 dbError.message?.includes('timeout') ||
                                 dbError.message?.includes('Closed') ||
                                 dbError.code === 'P1001' || // Connection error
                                 dbError.code === 'P1008' || // Timeout
                                 dbError.code === 'P1017';   // Server closed connection
        
        if (isConnectionError && retryCount <= maxRetries) {
          console.warn(`Database connection error in testimonials (attempt ${retryCount}/${maxRetries + 1}):`, dbError.message);
          
          // Exponential backoff: wait 1s, 2s, 4s
          const delay = Math.pow(2, retryCount - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If not a connection error or max retries exceeded, throw the error
        throw dbError;
      }
    }
    
  } catch (error: any) {
    console.error('Error fetching testimonials:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    // Return appropriate error based on error type
    const isConnectionError = error.message?.includes('connection') ||
                             error.message?.includes('timeout') ||
                             error.message?.includes('Closed') ||
                             error.code === 'P1001' ||
                             error.code === 'P1008' ||
                             error.code === 'P1017';
    
    if (isConnectionError) {
      return NextResponse.json(
        { error: 'Database connection temporarily unavailable. Please try again.' },
        { status: 503 } // Service Unavailable
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST /api/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, position, company, content, rating, imageUrl } = body
    
    // Validate required fields
    const testimonialData = {
      name: name?.trim(),
      position: position?.trim(),
      company: company?.trim(),
      content: content?.trim(),
      rating: rating || 5,
      imageUrl: imageUrl?.trim() || undefined,
      featured: false, // New testimonials are not featured by default
      approved: false  // New testimonials need approval
    }
    
    // Validate the testimonial data
    const validation = validateTestimonialData(testimonialData)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }
    
    // Create the testimonial
    const testimonial = await createTestimonial(testimonialData)
    
    // Return success response (don't expose internal data for public submissions)
    return NextResponse.json(
      { 
        message: 'Testimonial submitted successfully',
        id: testimonial.id,
        submittedAt: testimonial.createdAt
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    )
  }
}