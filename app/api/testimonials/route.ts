import { NextRequest, NextResponse } from 'next/server'
import { createTestimonial, fetchTestimonials, validateTestimonialData } from '@/lib/testimonial-operations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/testimonials - Fetch testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const approved = searchParams.get('approved')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // For public access, only return approved testimonials
    const session = await getServerSession(authOptions)
    const isAdmin = !!session?.user
    
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
    
    const testimonials = await fetchTestimonials(options)
    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
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