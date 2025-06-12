import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { formData } = data

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Verify campaign exists and has form enabled
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      select: { enableForm: true },
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    if (!campaign.enableForm) {
      return NextResponse.json(
        { error: 'Form submissions not enabled for this campaign' },
        { status: 400 }
      )
    }

    // Create submission
    const submission = await prisma.campaignSubmission.create({
      data: {
        campaignId: params.id,
        data: formData,
        ipAddress,
        userAgent,
      },
    })

    // Increment campaign views (optional - you might want to track this separately)
    await prisma.campaign.update({
      where: { id: params.id },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ 
      success: true, 
      submissionId: submission.id 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign submission:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const [submissions, total] = await Promise.all([
      prisma.campaignSubmission.findMany({
        where: { campaignId: params.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.campaignSubmission.count({
        where: { campaignId: params.id },
      }),
    ])

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching campaign submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}