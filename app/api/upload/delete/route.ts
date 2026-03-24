import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/next-auth'
import { deleteFromBlob } from '@/lib/blob-client'

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication using NextAuth
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const { url, key } = await request.json()

    if (!url && !key) {
      return NextResponse.json(
        { error: 'Either URL or key must be provided' },
        { status: 400 }
      )
    }

    // Use URL if key is not provided
    const fileUrl = url || `https://vercel.com/blob/${key}`

    // Delete from Blob
    const result = await deleteFromBlob(fileUrl)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}