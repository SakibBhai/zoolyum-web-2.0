import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/next-auth'
import { uploadToBlob } from '@/lib/blob-client'

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed file types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
]

export async function POST(request: NextRequest) {
  try {
    // Check authentication using NextAuth (skip in development for testing)
    const session = await auth()
    if (process.env.NODE_ENV === 'production' && !session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Log upload attempt in development
    if (process.env.NODE_ENV === 'development') {
      console.log('=== DEV MODE: Upload API called ===')
      console.log('Session:', session?.user?.email || 'No session (dev mode)')
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate folder name (security)
    const sanitizedFolder = (folder || 'uploads').replace(/[^a-zA-Z0-9-_]/g, '')
    if (sanitizedFolder !== folder) {
      return NextResponse.json(
        { error: 'Invalid folder name' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    console.log('=== UPLOAD TO BLOB ===')
    console.log('File:', file.name, file.size, file.type)
    console.log('Folder:', sanitizedFolder)

    const result = await uploadToBlob({
      file,
      folder: sanitizedFolder
    })

    console.log('Upload result:', result)

    if (result.error) {
      console.error('Upload failed:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    console.log('Upload successful, URL:', result.url)

    return NextResponse.json({
      url: result.url,
      key: result.key,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload API error:', error)
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}