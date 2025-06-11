import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
    
    // Validate required fields
    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug is unique
    const existingService = await prisma.service.findUnique({
      where: { slug: data.slug }
    })

    if (existingService) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || '',
        content: data.content || '',
        imageUrl: data.imageUrl || '',
        icon: data.icon || '',
        featured: data.featured || false,
        order: data.order || 0,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}