import { NextRequest, NextResponse } from 'next/server'
import { getConsultationStats } from '@/lib/consultation-operations'
import { getCurrentUser } from '@/lib/stack-auth'

// GET /api/consultations/stats - Get consultation statistics (Admin only)
export async function GET() {
  try {
    const user = await getCurrentUser()
  
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const stats = await getConsultationStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching consultation stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultation statistics' },
      { status: 500 }
    )
  }
}