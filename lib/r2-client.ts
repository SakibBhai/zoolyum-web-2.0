import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// R2 Configuration
const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.warn('R2 configuration is incomplete. Upload functionality will be limited.')
}

// Create S3 client configured for Cloudflare R2
export const r2Client = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto' as region
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for R2
})

export interface UploadParams {
  file: File
  folder?: string
  filename?: string
}

export interface UploadResult {
  url?: string
  key?: string
  error?: string
  bucketMissing?: boolean
}

export interface DeleteResult {
  success?: boolean
  error?: string
}

/**
 * Generate a unique filename with timestamp and random string
 */
function generateUniqueFilename(originalName: string, folder?: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()
  const baseName = originalName.split('.').slice(0, -1).join('.')
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '-')
  
  const filename = `${sanitizedBaseName}-${timestamp}-${randomString}.${extension}`
  
  return folder ? `${folder}/${filename}` : filename
}

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadToR2({ file, folder = 'uploads', filename }: UploadParams): Promise<UploadResult> {
  try {
    // Check if R2 is properly configured
    if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
      return {
        error: 'R2 storage not configured. Please set up environment variables.',
        bucketMissing: true
      }
    }

    // Generate unique filename if not provided
    const key = filename || generateUniqueFilename(file.name, folder)
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    
    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
      ContentLength: file.size,
    })

    await r2Client.send(command)

    // Generate public URL
    const publicUrl = R2_PUBLIC_URL 
      ? `${R2_PUBLIC_URL}/${key}`
      : `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`

    return {
      url: publicUrl,
      key: key
    }
  } catch (error) {
    console.error('R2 upload error:', error)
    return {
      error: 'Failed to upload file to R2 storage'
    }
  }
}

/**
 * Delete a file from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<DeleteResult> {
  try {
    // Check if R2 is properly configured
    if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
      return {
        error: 'R2 storage not configured'
      }
    }

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)

    return {
      success: true
    }
  } catch (error) {
    console.error('R2 delete error:', error)
    return {
      error: 'Failed to delete file from R2 storage'
    }
  }
}

/**
 * Extract the key from a full R2 URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    if (R2_PUBLIC_URL && url.startsWith(R2_PUBLIC_URL)) {
      return url.replace(`${R2_PUBLIC_URL}/`, '')
    }
    
    if (R2_ENDPOINT && R2_BUCKET_NAME && url.includes(R2_ENDPOINT)) {
      const pattern = new RegExp(`${R2_ENDPOINT}/${R2_BUCKET_NAME}/(.+)`)
      const match = url.match(pattern)
      return match ? match[1] : null
    }
    
    return null
  } catch (error) {
    console.error('Error extracting key from URL:', error)
    return null
  }
}

/**
 * Check if R2 is properly configured
 */
export function isR2Configured(): boolean {
  return !!(R2_ENDPOINT && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME)
}