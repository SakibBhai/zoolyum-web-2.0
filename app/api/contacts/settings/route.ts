import { NextRequest, NextResponse } from 'next/server'
import { fetchContactSettings, updateContactSettings } from '@/lib/contact-operations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/contacts/settings - Fetch contact settings
export async function GET() {
  try {
    const settings = await fetchContactSettings()
    
    // Return default settings if none exist
    if (!settings) {
      return NextResponse.json({
        email: 'hello@zoolyum.com',
        phone: '+1 (555) 123-4567',
        address: '123 Creative Street, Design District, San Francisco, CA 94103',
        workingHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
        twitterUrl: null,
        linkedinUrl: null,
        instagramUrl: null,
        behanceUrl: null,
        enablePhoneField: true,
        requirePhoneField: false,
        autoReplyEnabled: false,
        autoReplyMessage: null,
        notificationEmail: null,
        emailNotifications: true
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching contact settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact settings' },
      { status: 500 }
    )
  }
}

// PUT /api/contacts/settings - Update contact settings (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const updatedSettings = await updateContactSettings(body)
    
    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating contact settings:', error)
    return NextResponse.json(
      { error: 'Failed to update contact settings' },
      { status: 500 }
    )
  }
}