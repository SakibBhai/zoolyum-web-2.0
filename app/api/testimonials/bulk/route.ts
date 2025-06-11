import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action, ids, featured } = await request.json()

    if (!action || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'delete':
        await prisma.testimonial.deleteMany({
          where: {
            id: {
              in: ids,
            },
          },
        })
        return NextResponse.json({ 
          success: true, 
          message: `${ids.length} testimonials deleted successfully` 
        })

      case 'updateStatus':
        if (typeof featured !== 'boolean') {
          return NextResponse.json(
            { error: 'Featured status must be a boolean' },
            { status: 400 }
          )
        }
        
        await prisma.testimonial.updateMany({
          where: {
            id: {
              in: ids,
            },
          },
          data: {
            featured,
          },
        })
        return NextResponse.json({ 
          success: true, 
          message: `${ids.length} testimonials updated successfully` 
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error performing bulk operation:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}