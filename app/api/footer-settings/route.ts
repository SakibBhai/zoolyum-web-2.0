import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the first (and should be only) footer settings record
    let footerSettings = await prisma.footerSettings.findFirst()
    
    // If no settings exist, create default ones
    if (!footerSettings) {
      footerSettings = await prisma.footerSettings.create({
        data: {
          footerContent: 'Welcome to our website. We are committed to providing excellent service.',
          copyright: '© 2024 Zoolyum. All rights reserved.',
          showSocialMedia: true,
          showLogo: true,
          showLegalLinks: true,
          columnLayout: 3,
          backgroundColor: '#1A1A1A',
          textColor: '#E9E7E2'
        }
      })
    }

    return NextResponse.json(footerSettings)
  } catch (error) {
    console.error('Error fetching footer settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Get the first footer settings record or create if none exists
    let footerSettings = await prisma.footerSettings.findFirst()
    
    if (footerSettings) {
      // Update existing settings
      footerSettings = await prisma.footerSettings.update({
        where: { id: footerSettings.id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new settings
      footerSettings = await prisma.footerSettings.create({
        data
      })
    }

    return NextResponse.json(footerSettings)
  } catch (error) {
    console.error('Error updating footer settings:', error)
    return NextResponse.json(
      { error: 'Failed to update footer settings' },
      { status: 500 }
    )
  }
}