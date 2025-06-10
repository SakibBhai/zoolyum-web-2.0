import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { deleteFromR2, extractKeyFromUrl } from '@/lib/r2-client'

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
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

    // Extract key from URL if only URL is provided
    let fileKey = key
    if (!fileKey && url) {
      fileKey = extractKeyFromUrl(url)
      if (!fileKey) {
        return NextResponse.json(
          { error: 'Could not extract file key from URL' },
          { status: 400 }
        )
      }
    }

    // Delete from R2
    const result = await deleteFromR2(fileKey)

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