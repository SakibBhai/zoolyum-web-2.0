import { NextRequest, NextResponse } from 'next/server'
import { fetchContact, updateContact, deleteContact } from '@/lib/contact-operations'
import { getCurrentUser } from '@/lib/stack-auth'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/contacts/[id] - Fetch single contact (Admin only)
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    const contact = await fetchContact(id)
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
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
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    const body = await request.json()
    const { name, email, phone, subject, message, status } = body
    
    // Prepare update data (only include provided fields)
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (email !== undefined) updateData.email = email.trim()
    if (phone !== undefined) updateData.phone = phone?.trim() || null
    if (subject !== undefined) updateData.subject = subject?.trim() || null
    if (message !== undefined) updateData.message = message.trim()
    if (status !== undefined) {
      if (!['NEW', 'READ', 'REPLIED', 'ARCHIVED'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value' },
          { status: 400 }
        )
      }
      updateData.status = status
    }
    
    const contact = await updateContact(id, updateData)
    
    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(contact)
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
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = await params
    const deleted = await deleteContact(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: 'Contact deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    )
  }
}