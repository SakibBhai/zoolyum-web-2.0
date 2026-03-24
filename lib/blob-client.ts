/**
 * Vercel Blob Storage Client
 *
 * Handles file uploads to Vercel Blob storage
 */

import { put } from '@vercel/blob';

export interface UploadOptions {
  file: File;
  folder?: string;
}

export interface UploadResult {
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Upload a file to Vercel Blob storage
 */
export async function uploadToBlob(options: UploadOptions): Promise<UploadResult> {
  try {
    const { file, folder = 'uploads' } = options;

    // Check if Blob is configured
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!blobToken) {
      console.error('BLOB_READ_WRITE_TOKEN environment variable is not set');
      return {
        error: 'Blob storage is not configured. Please add BLOB_READ_WRITE_TOKEN to your environment variables.',
      };
    }

    // Generate a unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${folder}/${timestamp}-${sanitizedFileName}`;

    // Convert File to Blob
    const blob = new Blob([file], { type: file.type });

    // Upload to Vercel Blob
    const { url } = await put(uniqueFileName, blob, {
      access: 'public',
      token: blobToken,
    });

    return {
      url,
      key: uniqueFileName,
    };

  } catch (error) {
    console.error('Blob upload error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to upload file to Blob storage',
    };
  }
}

/**
 * Delete a file from Blob storage
 *
 * Note: Vercel Blob doesn't have a built-in delete API in the SDK.
 * You need to use the Vercel REST API or wait for automatic expiration.
 */
export async function deleteFromBlob(url: string): Promise<{ success: boolean; error?: string }> {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!blobToken) {
      return {
        success: false,
        error: 'Blob storage is not configured',
      };
    }

    // Extract the blob ID from the URL
    // URL format: https://[blob-id].public.blob.vercel-storage.com/[path]
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const blobId = hostname.split('.')[0];

    // Delete using Vercel Blob REST API
    const response = await fetch(`https://vercel.com/api/blob/${blobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN || ''}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to delete blob: ${error}`);
    }

    return { success: true };

  } catch (error) {
    console.error('Blob delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete file',
    };
  }
}

/**
 * Get a list of blobs from a folder
 *
 * Note: This requires the Vercel REST API
 */
export async function listBlobs(prefix?: string): Promise<{
  blobs: Array<{ url: string; key: string; size: number }>;
  error?: string;
}> {
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (!blobToken) {
      return {
        blobs: [],
        error: 'Blob storage is not configured',
      };
    }

    // List blobs using Vercel Blob REST API
    const response = await fetch('https://vercel.com/api/blob', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_TOKEN || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to list blobs');
    }

    const data = await response.json();

    // Filter by prefix if provided
    let blobs = data.blobs || [];
    if (prefix) {
      blobs = blobs.filter((blob: any) => blob.pathname.startsWith(prefix));
    }

    return {
      blobs: blobs.map((blob: any) => ({
        url: blob.url,
        key: blob.pathname,
        size: blob.size,
      })),
    };

  } catch (error) {
    console.error('Blob list error:', error);
    return {
      blobs: [],
      error: error instanceof Error ? error.message : 'Failed to list blobs',
    };
  }
}
