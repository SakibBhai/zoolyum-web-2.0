import { NextRequest, NextResponse } from 'next/server'
import { createContact, fetchContacts, validateContactData } from '@/lib/contact-operations'
import { getCurrentUser } from '@/lib/stack-auth'

// GET /api/contacts - Fetch all contacts (Admin only)
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
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
    // Parse request body with error handling
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { name, email, phone, countryCode, businessName, businessWebsite, services, subject, message } = body
    
    // Log incoming request for debugging
    console.log('Contact form submission received:', {
      name: name ? '[PROVIDED]' : '[MISSING]',
      email: email ? '[PROVIDED]' : '[MISSING]',
      phone: phone ? '[PROVIDED]' : '[MISSING]',
      countryCode: countryCode || '[DEFAULT]',
      businessName: businessName ? '[PROVIDED]' : '[MISSING]',
      businessWebsite: businessWebsite ? '[PROVIDED]' : '[MISSING]',
      services: Array.isArray(services) ? `[${services.length} items]` : '[INVALID]',
      timestamp: new Date().toISOString()
    })
    
    // Validate required fields before processing
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }
    
    // Prepare contact data with proper validation
    const contactData = {
      name: name.trim(),
      email: email?.trim() || undefined,
      phone: phone.trim(),
      countryCode: countryCode?.trim() || '+880',
      company: undefined, // Legacy field, keeping for compatibility
      businessName: businessName?.trim() || undefined,
      businessWebsite: businessWebsite?.trim() || undefined,
      services: Array.isArray(services) ? services.filter(s => s && s.trim()) : [],
      subject: subject?.trim() || undefined,
      message: message?.trim() || 'Contact form submission',
      status: 'NEW' as const,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined
    }
    
    // Validate the contact data using the validation function
    const validation = validateContactData(contactData)
    if (!validation.isValid) {
      console.error('Contact validation failed:', validation.errors)
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors,
          message: 'Please check your form data and try again'
        },
        { status: 400 }
      )
    }
    
    // Attempt to create the contact with detailed error handling
    let contact
    try {
      contact = await createContact(contactData)
      console.log('Contact created successfully:', contact.id)
    } catch (dbError) {
      console.error('Database error creating contact:', dbError)
      
      // Check for specific database errors
      if (dbError instanceof Error) {
        if (dbError.message.includes('unique constraint')) {
          return NextResponse.json(
            { error: 'A contact with this information already exists' },
            { status: 409 }
          )
        }
        if (dbError.message.includes('connection')) {
          return NextResponse.json(
            { error: 'Database connection error. Please try again later.' },
            { status: 503 }
          )
        }
      }
      
      // Generic database error
      return NextResponse.json(
        { error: 'Failed to save contact information. Please try again.' },
        { status: 500 }
      )
    }
    
    // Return success response (don't expose internal data)
    return NextResponse.json(
      { 
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        id: contact.id,
        submittedAt: contact.createdAt
      },
      { status: 201 }
    )
  } catch (error) {
    // Catch-all error handler
    console.error('Unexpected error in contact form submission:', error)
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred. Please try again later.',
        message: 'If the problem persists, please contact support.'
      },
      { status: 500 }
    )
  }
}