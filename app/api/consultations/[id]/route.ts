import { NextRequest, NextResponse } from 'next/server'
import { 
  fetchConsultationById, 
  updateConsultation, 
  deleteConsultation,
  validateConsultationData 
} from '@/lib/consultation-operations'
import { getCurrentUser } from '@/lib/stack-auth'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// GET /api/consultations/[id] - Get specific consultation (Admin only)
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
    const consultation = await fetchConsultationById(id)
    
    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(consultation)
  } catch (error) {
    console.error('Error fetching consultation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    )
  }
}

// PUT /api/consultations/[id] - Update consultation (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate the consultation data if it's a full update
    if (Object.keys(body).length > 2) { // More than just status update
      const validation = validateConsultationData(body)
      if (!validation.isValid) {
        return NextResponse.json(
          { error: 'Validation failed', details: validation.errors },
          { status: 400 }
        )
      }
    }
    
    const { id } = await params
    const updatedConsultation = await updateConsultation(id, body)
    
    if (!updatedConsultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedConsultation)
  } catch (error) {
    console.error('Error updating consultation:', error)
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    )
  }
}

// DELETE /api/consultations/[id] - Delete consultation (Admin only)
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
    const deleted = await deleteConsultation(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Consultation deleted successfully' })
  } catch (error) {
    console.error('Error deleting consultation:', error)
    return NextResponse.json(
      { error: 'Failed to delete consultation' },
      { status: 500 }
    )
  }
}