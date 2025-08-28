import { NextRequest, NextResponse } from 'next/server'
import { createConsultation, fetchConsultations, validateConsultationData } from '@/lib/consultation-operations'
import { getCurrentUser } from '@/lib/stack-auth'

// GET /api/consultations - Fetch consultations (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const consultationType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const options: any = {
      limit: Math.min(limit, 100), // Cap at 100
      offset: Math.max(offset, 0)
    }
    
    if (status) {
      options.status = status.toUpperCase()
    }
    
    if (consultationType) {
      options.consultationType = consultationType
    }
    
    const consultations = await fetchConsultations(options)
    return NextResponse.json(consultations)
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    )
  }
}

// POST /api/consultations - Submit new consultation booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the consultation data
    const validation = validateConsultationData(body)
    if (!validation.isValid) {
      console.error('Validation failed:', validation.errors)
      console.error('Request body:', JSON.stringify(body, null, 2))
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }
    
    // Get client IP and user agent for tracking
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    
    // Create the consultation booking
    const consultationData = {
      fullName: body.fullName,
      email: body.email,
      companyName: body.companyName,
      websiteUrl: body.websiteUrl,
      role: body.role,
      mainChallenge: body.mainChallenge,
      otherChallenge: body.otherChallenge,
      sessionGoal: body.sessionGoal,
      preferredDatetime: body.preferredDatetime ? new Date(body.preferredDatetime) : undefined,
      additionalNotes: body.additionalNotes,
      consultationType: body.consultationType || 'brand_strategy',
      status: 'PENDING' as const,
      ipAddress: ip || undefined,
      userAgent: userAgent || undefined,
    }
    
    const consultation = await createConsultation(consultationData)
    
    // TODO: Send confirmation email to client
    // TODO: Send notification email to admin
    
    return NextResponse.json(
      { 
        message: 'Consultation booking submitted successfully',
        consultation: {
          id: consultation.id,
          fullName: consultation.fullName,
          email: consultation.email,
          consultationType: consultation.consultationType,
          status: consultation.status,
          createdAt: consultation.createdAt
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating consultation:', error)
    return NextResponse.json(
      { error: 'Failed to submit consultation booking' },
      { status: 500 }
    )
  }
}