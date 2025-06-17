import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function StorageSetupGuide() {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Storage Setup Required</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Image storage is not currently configured. Please use external image URLs for now.
        </p>
        <p className="text-sm">
          You can upload images to services like Imgur, ImgBB, or PostImages and use the direct URL.
        </p>
      </AlertDescription>
    </Alert>
  )
}
