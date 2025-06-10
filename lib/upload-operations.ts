// Upload operations for file management

export interface UploadResult {
  url?: string;
  key?: string;
  error?: string;
  bucketMissing?: boolean;
}

export interface DeleteResult {
  success?: boolean;
  error?: string;
}

/**
 * Upload an image file to Cloudflare R2 storage
 * @param file - The file to upload
 * @param folder - Optional folder name (defaults to 'uploads')
 * @returns Promise with upload result
 */
export async function uploadImage(
  file: File,
  folder: string = 'uploads'
): Promise<UploadResult> {
  try {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return {
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
      };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        error: 'File size must be less than 5MB'
      };
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Upload to API
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || 'Failed to upload image',
        bucketMissing: result.bucketMissing
      };
    }

    return {
      url: result.url,
      key: result.key
    };
    
  } catch (error) {
    console.error('Upload error:', error);
    return {
      error: 'Failed to upload image. Please try again.'
    };
  }
}

/**
 * Delete an image from Cloudflare R2 storage
 * @param url - The URL of the image to delete
 * @returns Promise with delete result
 */
export async function deleteImage(url: string): Promise<DeleteResult> {
  try {
    // Call delete API
    const response = await fetch('/api/upload/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || 'Failed to delete image'
      };
    }

    return {
      success: true
    };
    
  } catch (error) {
    console.error('Delete error:', error);
    return {
      error: 'Failed to delete image. Please try again.'
    };
  }
}

// Additional utility functions for future use

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  return `${nameWithoutExt}-${timestamp}-${random}.${extension}`;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, WebP, or GIF)'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size should be less than 5MB'
    };
  }
  
  return { valid: true };
}