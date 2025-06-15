import { NextResponse } from 'next/server'
import { getContactStats } from '@/lib/contact-operations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/contacts/stats - Get contact statistics (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
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