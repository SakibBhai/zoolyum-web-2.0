"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, X, ImageIcon, Loader2, AlertCircle, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage, deleteImage } from "@/lib/upload-operations"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ImageUploaderProps {
  label: string
  initialImageUrl?: string
  onImageChange: (url: string | null) => void
  className?: string
  helpText?: string
  folder?: string
}

export function ImageUploader({
  label,
  initialImageUrl,
  onImageChange,
  className = "",
  helpText,
  folder = "blog",
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [bucketError, setBucketError] = useState<boolean>(false)
  const [externalUrl, setExternalUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<string>("url") // Default to URL tab due to storage issues

  // Check for storage bucket on component mount
  useEffect(() => {
    const checkBucket = async () => {
      try {
        // Create a small test file
        const testFile = new File(["test"], "test.txt", { type: "text/plain" })

        // Try to upload it
        const result = await uploadImage(testFile, "test")

        // If there's a bucket error, set the state
        if (result.bucketMissing) {
          setBucketError(true)
          setActiveTab("url")
        } else {
          // If upload succeeded, delete the test file
          if (result.url) {
            await deleteImage(result.url)
          }
          setActiveTab("upload") // Only set to upload if bucket exists
        }
      } catch (err) {
        console.error("Error checking storage bucket:", err)
        setBucketError(true)
        setActiveTab("url")
      }
    }

    checkBucket()
  }, [])

  // Simulate upload progress
  const simulateProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)
    return interval
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, WebP, or GIF)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setError(null)
    setIsUploading(true)

    // Start progress simulation
    const progressInterval = simulateProgress()

    try {
      const result = await uploadImage(file, folder)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.error) {
        setError(result.error)

        // Check if it's a bucket error
        if (result.bucketMissing) {
          setBucketError(true)
          setActiveTab("url") // Switch to URL tab if bucket is missing

          toast({
            title: "Storage not available",
            description: "Please use the external URL option instead.",
            variant: "warning",
          })
        } else {
          toast({
            title: "Upload failed",
            description: result.error,
            variant: "destructive",
          })
        }
      } else if (result.url) {
        setImageUrl(result.url)
        onImageChange(result.url)
        toast({
          title: "Upload successful",
          description: "Image has been uploaded successfully",
        })
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError("An unexpected error occurred during upload")
      setBucketError(true)
      setActiveTab("url")

      toast({
        title: "Upload failed",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = async () => {
    if (!imageUrl) return

    try {
      setIsUploading(true)

      // If it's an external URL, just remove it without calling the API
      if (!imageUrl.includes("supabase")) {
        setImageUrl(null)
        onImageChange(null)
        toast({
          title: "Image removed",
          description: "Image has been removed successfully",
        })
        setIsUploading(false)
        return
      }

      const result = await deleteImage(imageUrl)

      if (result.error) {
        toast({
          title: "Removal failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        setImageUrl(null)
        onImageChange(null)
        toast({
          title: "Image removed",
          description: "Image has been removed successfully",
        })
      }
    } catch (err) {
      toast({
        title: "Removal failed",
        description: "An unexpected error occurred while removing the image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleExternalUrlSubmit = () => {
    if (!externalUrl) {
      setError("Please enter an image URL")
      return
    }

    // Basic URL validation
    try {
      new URL(externalUrl)
    } catch (err) {
      setError("Please enter a valid URL")
      return
    }

    setImageUrl(externalUrl)
    onImageChange(externalUrl)
    setExternalUrl("")
    setError(null)
    toast({
      title: "Image added",
      description: "External image URL has been added successfully",
    })
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={`image-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}>{label}</Label>

      {bucketError && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Storage Not Available</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              The storage bucket "media" doesn't exist. Please use the "External URL" tab to add images from external
              sources.
            </p>
            <p className="text-sm">You can use image hosting services like:</p>
            <ul className="list-disc ml-5 mt-1 text-sm">
              <li>
                <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline">
                  Imgur
                </a>
              </li>
              <li>
                <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline">
                  ImgBB
                </a>
              </li>
              <li>
                <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="underline">
                  PostImages
                </a>
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {imageUrl ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="relative aspect-video w-full">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={label}
              fill
              className="object-cover"
              onError={() => {
                setError("Failed to load image. Please check the URL and try again.")
                setImageUrl(null)
                onImageChange(null)
              }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={bucketError}>
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="url">External URL</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <div className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md">
              <div className="flex flex-col items-center justify-center gap-2">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {helpText || "Upload an image (JPEG, PNG, WebP, GIF, max 5MB)"}
                </p>
              </div>
              <Input
                id={`image-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || bucketError}
                ref={fileInputRef}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || bucketError}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="url">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="external-url">Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="external-url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                  <Button type="button" onClick={handleExternalUrlSubmit}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Enter the URL of an image hosted elsewhere (e.g., Imgur, ImgBB)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {error && !bucketError && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
