"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadImage, deleteImage } from "@/lib/upload-operations"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface GalleryImage {
  url: string
  caption?: string
}

interface GalleryUploaderProps {
  label: string
  initialImages?: GalleryImage[]
  onImagesChange: (images: GalleryImage[]) => void
  className?: string
  helpText?: string
}

export function GalleryUploader({
  label,
  initialImages = [],
  onImagesChange,
  className = "",
  helpText,
}: GalleryUploaderProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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
      const result = await uploadImage(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.error) {
        setError(result.error)
        toast({
          title: "Upload failed",
          description: result.error,
          variant: "destructive",
        })
      } else if (result.url) {
        const newImage: GalleryImage = { url: result.url, caption: "" }
        const updatedImages = [...images, newImage]
        setImages(updatedImages)
        onImagesChange(updatedImages)
        toast({
          title: "Upload successful",
          description: "Image has been added to the gallery",
        })
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError("An unexpected error occurred during upload")
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

  const handleRemoveImage = async (index: number) => {
    const imageToRemove = images[index]

    try {
      setIsUploading(true)
      const result = await deleteImage(imageToRemove.url)

      if (result.error) {
        toast({
          title: "Removal failed",
          description: result.error,
          variant: "destructive",
        })
      } else {
        const updatedImages = images.filter((_, i) => i !== index)
        setImages(updatedImages)
        onImagesChange(updatedImages)
        toast({
          title: "Image removed",
          description: "Image has been removed from the gallery",
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

  const handleCaptionChange = (index: number, caption: string) => {
    const updatedImages = [...images]
    updatedImages[index].caption = caption
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label>{label}</Label>
        {helpText && <p className="text-sm text-gray-500 mt-1">{helpText}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
            <div className="relative aspect-video w-full">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.caption || `Gallery image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2">
              <Input
                type="text"
                placeholder="Image caption (optional)"
                value={image.caption || ""}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                className="text-sm"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleRemoveImage(index)}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Add image button */}
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md flex flex-col items-center justify-center p-4 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Plus className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Add to gallery</p>
          </div>
        </div>
      </div>

      <Input
        id={`gallery-upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
        ref={fileInputRef}
      />

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading {uploadProgress}%
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
