'use client'

import { useState } from 'react'
import { ImageUploader } from '@/components/admin/image-uploader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Upload, ExternalLink } from 'lucide-react'

export default function TestImageUploadPage() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [testResults, setTestResults] = useState<{
    upload: 'pending' | 'success' | 'error'
    preview: 'pending' | 'success' | 'error'
    delete: 'pending' | 'success' | 'error'
    externalUrl: 'pending' | 'success' | 'error'
  }>({
    upload: 'pending',
    preview: 'pending',
    delete: 'pending',
    externalUrl: 'pending'
  })

  const handleImageChange = async (url: string | null) => {
    console.log('Image changed:', url)
    setImageUrl(url || '')
    
    // Test preview functionality
    if (url) {
      setTestResults(prev => ({ ...prev, preview: 'success' }))
    } else {
      setTestResults(prev => ({ ...prev, preview: 'error' }))
    }
  }

  const testExternalUrl = () => {
    const testUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'
    setImageUrl(testUrl)
    setTestResults(prev => ({ ...prev, externalUrl: 'success' }))
  }

  const clearImage = () => {
    setImageUrl('')
    setTestResults(prev => ({ ...prev, delete: 'success' }))
  }

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Upload Test Page</h1>
        <p className="text-gray-600">
          This page tests the ImageUploader component functionality including upload, preview, delete, and external URL features.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Uploader Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Image Uploader Component
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploader
              label="Test Featured Image"
              initialImageUrl={imageUrl}
              onImageChangeAction={handleImageChange}
              folder="test-uploads"
              helpText="Upload an image or enter an external URL to test functionality"
            />
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Image Preview</span>
                {getStatusIcon(testResults.preview)}
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Upload Functionality</span>
                {getStatusIcon(testResults.upload)}
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Delete/Remove</span>
                {getStatusIcon(testResults.delete)}
              </div>
              <div className="flex items-center justify-between p-3 border rounded">
                <span>External URL</span>
                {getStatusIcon(testResults.externalUrl)}
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={testExternalUrl} 
                variant="outline" 
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Test External URL
              </Button>
              <Button 
                onClick={clearImage} 
                variant="outline" 
                className="w-full"
              >
                Clear Image
              </Button>
            </div>

            {imageUrl && (
              <Alert>
                <AlertDescription>
                  <strong>Current Image URL:</strong><br />
                  <code className="text-sm bg-gray-100 p-1 rounded">{imageUrl}</code>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Current Image Preview */}
      {imageUrl && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Current Image Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img 
                src={imageUrl} 
                alt="Test preview" 
                className="max-w-full max-h-96 object-contain rounded-lg border"
                onLoad={() => setTestResults(prev => ({ ...prev, preview: 'success' }))}
                onError={() => setTestResults(prev => ({ ...prev, preview: 'error' }))}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
