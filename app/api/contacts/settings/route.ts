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
        twitterUrl: 'https://twitter.com',
        linkedinUrl: 'https://linkedin.com',
        instagramUrl: 'https://instagram.com',
        behanceUrl: 'https://behance.com',
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
    const {
      email,
      phone,
      address,
      workingHours,
      twitterUrl,
      linkedinUrl,
      instagramUrl,
      behanceUrl,
      enablePhoneField,
      requirePhoneField,
      autoReplyEnabled,
      autoReplyMessage,
      notificationEmail,
      emailNotifications
    } = body
    
    // Update the settings
    const updatedSettings = await updateContactSettings({
      email: email?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      workingHours: workingHours?.trim(),
      twitterUrl: twitterUrl?.trim(),
      linkedinUrl: linkedinUrl?.trim(),
      instagramUrl: instagramUrl?.trim(),
      behanceUrl: behanceUrl?.trim(),
      enablePhoneField,
      requirePhoneField,
      autoReplyEnabled,
      autoReplyMessage: autoReplyMessage?.trim(),
      notificationEmail: notificationEmail?.trim(),
      emailNotifications
    })
    
    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating contact settings:', error)
    return NextResponse.json(
      { error: 'Failed to update contact settings' },
      { status: 500 }
    )
  }
}