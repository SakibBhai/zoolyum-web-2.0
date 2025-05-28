import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function StorageSetupGuide() {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Storage Setup Required</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Before you can upload images, you need to create a storage bucket in your Supabase project.
        </p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Go to your Supabase project dashboard</li>
          <li>Navigate to "Storage" in the left sidebar</li>
          <li>Click "New Bucket"</li>
          <li>Name it "media"</li>
          <li>Check "Public bucket" to make files publicly accessible</li>
          <li>Click "Create bucket"</li>
          <li>
            In the bucket settings, go to "Policies" tab and add these policies:
            <ul className="list-disc ml-5 mt-1">
              <li>
                <strong>SELECT policy (public access):</strong> Set to <code>true</code> to allow anyone to view images
              </li>
              <li>
                <strong>INSERT policy (admin only):</strong> Set to{" "}
                <code>(auth.uid() IN (SELECT id FROM public.admin_users))</code>
              </li>
            </ul>
          </li>
        </ol>
      </AlertDescription>
    </Alert>
  )
}
