import { NextRequest, NextResponse } from 'next/server'
import { fetchContactSettings, updateContactSettings } from '@/lib/contact-operations'
import { getCurrentUser } from '@/lib/stack-auth'

// GET /api/contacts/settings - Get contact settings (Admin only)
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const settings = await fetchContactSettings()
    
    // Return default settings if none exist
    if (!settings) {
      const defaultSettings = {
        id: 'default',
        email: null,
        phone: null,
        address: null,
        workingHours: null,
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
      }
      return NextResponse.json(defaultSettings)
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
    const user = await getCurrentUser()
    
    if (!user) {
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
    
    const settingsData = {
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      workingHours: workingHours?.trim() || null,
      twitterUrl: twitterUrl?.trim() || null,
      linkedinUrl: linkedinUrl?.trim() || null,
      instagramUrl: instagramUrl?.trim() || null,
      behanceUrl: behanceUrl?.trim() || null,
      enablePhoneField: Boolean(enablePhoneField),
      requirePhoneField: Boolean(requirePhoneField),
      autoReplyEnabled: Boolean(autoReplyEnabled),
      autoReplyMessage: autoReplyMessage?.trim() || null,
      notificationEmail: notificationEmail?.trim() || null,
      emailNotifications: Boolean(emailNotifications)
    }
    
    const updatedSettings = await updateContactSettings(settingsData)
    
    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating contact settings:', error)
    return NextResponse.json(
      { error: 'Failed to update contact settings' },
      { status: 500 }
    )
  }
}