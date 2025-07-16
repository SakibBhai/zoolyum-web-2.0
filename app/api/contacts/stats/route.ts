import { NextRequest, NextResponse } from 'next/server'
import { fetchContactStats } from '@/lib/contact-operations'
import { getCurrentUser } from '@/lib/stack-auth'

// GET /api/contacts/stats - Get contact statistics (Admin only)
export async function GET() {
  try {
    const user = await getCurrentUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
    
    const stats = await getContactStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching contact stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact statistics' },
      { status: 500 }
    )
  }
}