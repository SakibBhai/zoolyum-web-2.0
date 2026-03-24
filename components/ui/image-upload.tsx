'use client'

import { useState, useCallback } from 'react'
import { Upload } from 'lucide-react'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  onError?: (error: string) => void
  folder?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
  children?: React.ReactNode
}

export function ImageUpload({
  onUploadComplete,
  onError,
  folder = 'uploads',
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  maxSize = 5,
  className = '',
  children
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      onError?.(`File size must be less than ${maxSize}MB`)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      // Simulate progress (since fetch doesn't support progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await response.json()
      onUploadComplete(data.url)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      onError?.(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [folder, maxSize, onUploadComplete, onError])

  return (
    <div className={`image-upload ${className}`}>
      <input
        type="file"
        id="file-upload"
        accept={accept}
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
      />
      <label
        htmlFor="file-upload"
        className={`
          flex flex-col items-center justify-center
          w-full h-32 sm:h-48 md:h-64
          border-2 border-dashed border-gray-300 dark:border-gray-600
          rounded-lg cursor-pointer
          hover:border-[#FF5001] hover:bg-gray-50 dark:hover:bg-gray-800
          transition-colors
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#FF5001] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Uploading... {uploadProgress}%
            </p>
          </div>
        ) : children || (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <Upload className="w-10 h-10 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                PNG, JPG, GIF, WebP up to {maxSize}MB
              </p>
            </div>
          </div>
        )}
      </label>
    </div>
  )
}

interface UploadedImageProps {
  url: string
  onRemove?: () => void
  alt?: string
  className?: string
}

export function UploadedImage({ url, onRemove, alt = 'Uploaded image', className = '' }: UploadedImageProps) {
  return (
    <div className={`uploaded-image relative group ${className}`}>
      <img
        src={url}
        alt={alt}
        className="w-full h-auto rounded-lg"
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Remove image"
        >
          ×
        </button>
      )}
    </div>
  )
}
