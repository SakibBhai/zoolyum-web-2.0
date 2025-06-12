import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        ctas: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    // Get the user ID from the session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate slug from title if not provided
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Extract CTAs from the data
    const { ctas, ...campaignData } = data

    const campaign = await prisma.campaign.create({
      data: {
        ...campaignData,
        slug,
        authorId: user.id,
        ctas: {
          create: ctas?.map((cta: any, index: number) => ({
            label: cta.label,
            url: cta.url,
            order: index,
          })) || [],
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
        ctas: {
          orderBy: { order: 'asc' },
        },
      },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    )
  }
}