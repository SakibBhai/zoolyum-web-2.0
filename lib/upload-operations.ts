"use server"

import { createServerClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

// Use a single bucket with folders
const DEFAULT_BUCKET = "media"

export async function uploadImage(file: File, folder = "blog") {
  try {
    const supabase = createServerClient()

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return {
        error: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.",
        url: null,
      }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        error: "File size exceeds the 5MB limit.",
        url: null,
      }
    }

    // Check if bucket exists
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(DEFAULT_BUCKET)

      if (bucketError) {
        console.error(`Bucket ${DEFAULT_BUCKET} not found:`, bucketError)
        return {
          error: `Storage bucket "${DEFAULT_BUCKET}" not found. Please use an external URL instead.`,
          url: null,
          bucketMissing: true,
        }
      }
    } catch (bucketCheckError) {
      console.error("Error checking bucket:", bucketCheckError)
      return {
        error: "Unable to access storage. Please use an external URL instead.",
        url: null,
        bucketMissing: true,
      }
    }

    // Generate a unique filename to prevent collisions
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${folder}/${fileName}` // Use folder structure

    // Upload the file
    const { data, error } = await supabase.storage.from(DEFAULT_BUCKET).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)

      // Check if the error is related to missing bucket
      if (error.message.includes("bucket") || error.message.includes("Bucket")) {
        return {
          error: "Storage bucket not found. Please use an external URL instead.",
          url: null,
          bucketMissing: true,
        }
      }

      return { error: error.message, url: null }
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  } catch (error: any) {
    console.error("Unexpected error during upload:", error)
    return {
      error: "An unexpected error occurred during upload. Please use an external URL instead.",
      url: null,
      bucketMissing: true,
    }
  }
}

export async function deleteImage(url: string) {
  try {
    // If it's not a Supabase URL, just return success
    if (!url.includes("supabase")) {
      return { error: null }
    }

    const supabase = createServerClient()

    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")

    // The path will be something like /storage/v1/object/public/media/blog/filename.jpg
    // We need to extract the part after the bucket name
    const bucketIndex = pathParts.indexOf(DEFAULT_BUCKET)
    if (bucketIndex === -1) {
      return { error: "Invalid file URL" }
    }

    const filePath = pathParts.slice(bucketIndex + 1).join("/")

    // Delete the file
    const { error } = await supabase.storage.from(DEFAULT_BUCKET).remove([filePath])

    if (error) {
      console.error("Error deleting file:", error)
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    console.error("Unexpected error during deletion:", error)
    return { error: "An unexpected error occurred during deletion." }
  }
}
