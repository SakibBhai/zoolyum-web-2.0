import { NextRequest, NextResponse } from 'next/server'
import { getContactStats } from '@/lib/contact-operations'
import { getStackServerApp } from '@/lib/stack-server'

// GET /api/contacts/stats - Get contact statistics (Admin only)
export async function GET() {
  try {
    const stackServerApp = await getStackServerApp();
    const user = await stackServerApp.getUser();
  
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