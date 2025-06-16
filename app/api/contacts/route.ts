import { NextRequest, NextResponse } from 'next/server'
import { createContact, fetchContacts, validateContactData } from '@/lib/contact-operations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/contacts - Fetch all contacts (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const contacts = await fetchContacts()
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

// POST /api/contacts - Create new contact submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body
    
    // Validate required fields
    const contactData = {
      name: name?.trim(),
      email: email?.trim(),
      phone: phone?.trim() || undefined,
      subject: subject?.trim() || undefined,
      message: message?.trim(),
      status: 'NEW' as const,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined
    }
    
    // Validate the contact data
    const validation = validateContactData(contactData)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }
    
    // Create the contact
    const contact = await createContact(contactData)
    
    // Return success response (don't expose internal data)
    return NextResponse.json(
      { 
        message: 'Contact form submitted successfully',
        id: contact.id,
        submittedAt: contact.createdAt
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}