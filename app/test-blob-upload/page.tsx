'use client'

import { useState } from 'react'
import { ImageUpload, UploadedImage } from '@/components/ui/image-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Upload } from 'lucide-react'

interface UploadedFile {
  url: string
  key: string
  timestamp: number
}

export default function TestBlobUploadPage() {
  const [images, setImages] = useState<UploadedFile[]>([])
  const [uploadError, setUploadError] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('test-uploads')

  const folders = [
    'test-uploads',
    'blog-posts',
    'projects',
    'services',
    'team',
    'testimonials',
    'campaigns',
  ]

  const handleUploadComplete = (url: string) => {
    const key = url.split('/').pop() || ''
    setImages(prev => [...prev, { url, key, timestamp: Date.now() }])
    setUploadError('')
  }

  const handleUploadError = (error: string) => {
    setUploadError(error)
    setTimeout(() => setUploadError(''), 5000)
  }

  const handleRemove = (url: string) => {
    setImages(prev => prev.filter(img => img.url !== url))
  }

  const handleDeleteFromBlob = async (url: string) => {
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      handleRemove(url)
    } catch (error) {
      alert('Failed to delete image from Blob storage')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('URL copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E9E7E2] mb-2">Vercel Blob Upload Test</h1>
          <p className="text-[#E9E7E2]/70">
            Test image upload functionality with Vercel Blob storage
          </p>
        </div>

        {/* Error Display */}
        {uploadError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400">{uploadError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Upload Image</CardTitle>
              <CardDescription className="text-[#E9E7E2]/70">
                Upload images to Vercel Blob storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Folder Selection */}
              <div>
                <label className="block text-sm font-medium text-[#E9E7E2]/80 mb-2">
                  Upload Folder
                </label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#333333] rounded-lg text-[#E9E7E2] focus:outline-none focus:border-[#FF5001]"
                >
                  {folders.map(folder => (
                    <option key={folder} value={folder}>
                      {folder}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Component */}
              <ImageUpload
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
                folder={selectedFolder}
                maxSize={5}
              />

              {/* Info */}
              <div className="text-sm text-[#E9E7E2]/60 space-y-1">
                <p>• Max file size: 5MB</p>
                <p>• Allowed: JPEG, PNG, WebP, GIF</p>
                <p>• Requires authentication</p>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Images Section */}
          <Card className="bg-[#1A1A1A] border-[#333333]">
            <CardHeader>
              <CardTitle className="text-[#E9E7E2]">Uploaded Images</CardTitle>
              <CardDescription className="text-[#E9E7E2]/70">
                {images.length} image{images.length !== 1 ? 's' : ''} uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <div className="text-center py-12 text-[#E9E7E2]/50">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No images uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {images.map((image) => (
                    <div
                      key={image.timestamp}
                      className="p-3 bg-[#0A0A0A] rounded-lg space-y-2"
                    >
                      <img
                        src={image.url}
                        alt="Uploaded"
                        className="w-full h-auto rounded max-h-48 object-cover"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(image.url)}
                          className="flex-1 border-[#333333] text-[#E9E7E2] hover:bg-[#252525]"
                        >
                          Copy URL
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFromBlob(image.url)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-[#E9E7E2]/50 break-all">
                        {image.key}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Usage Example */}
        <Card className="mt-8 bg-[#1A1A1A] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-[#E9E7E2]">Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-[#0A0A0A] p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-[#E9E7E2]/80">
{`import { ImageUpload } from '@/components/ui/image-upload'

<ImageUpload
  onUploadComplete={(url) => {
    console.log('Image URL:', url)
    // Save URL to database or state
  }}
  onError={(error) => {
    console.error('Upload failed:', error)
  }}
  folder="blog-posts"
  maxSize={5}
/>`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
