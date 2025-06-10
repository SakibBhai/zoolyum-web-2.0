import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content || '',
        category: data.category,
        imageUrl: data.imageUrl || data.thumbnail_url || '',
        galleryUrls: data.galleryUrls || data.gallery?.map((img: any) => img.url) || [],
        tags: data.tags || [],
        published: data.published || false,
        featured: data.featured || false,
        authorId: user.id,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}