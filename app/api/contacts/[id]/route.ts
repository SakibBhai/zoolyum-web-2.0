import { NextRequest, NextResponse } from 'next/server'
import { fetchContact, updateContact, deleteContact } from '@/lib/contact-operations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/contacts/[id] - Fetch single contact (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const contact = await fetchContact(params.id)
    
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    
    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error fetching contact:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    )
  }
}

// PUT /api/contacts/[id] - Update contact (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, email, phone, subject, message, status } = body
    
    // Check if contact exists
    const existingContact = await fetchContact(params.id)
    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    
    // Update the contact
    const updatedContact = await updateContact(params.id, {
      name: name?.trim(),
      email: email?.trim(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || null,
      message: message?.trim(),
      status: status?.trim()
    })
    
    return NextResponse.json(updatedContact)
  } catch (error) {
    console.error('Error updating contact:', error)
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/[id] - Delete contact (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if contact exists
    const existingContact = await fetchContact(params.id)
    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    
    // Delete the contact
    await deleteContact(params.id)
    
    return NextResponse.json({ message: 'Contact deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}