import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(teamMembers)
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
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

    // Find the highest order value to place new member at the end
    const highestOrder = await prisma.teamMember.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    })
    
    const nextOrder = highestOrder ? highestOrder.order + 1 : 1

    const teamMember = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio || '',
        imageUrl: data.imageUrl || '',
        active: data.active || true,
        order: data.order || nextOrder,
        socialLinks: data.socialLinks || {},
      },
    })

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}