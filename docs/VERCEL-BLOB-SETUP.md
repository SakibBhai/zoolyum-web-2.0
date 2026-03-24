# Vercel Blob Storage Setup Guide

This guide will help you set up Vercel Blob storage for image uploads in your Zoolyum application.

## What is Vercel Blob?

Vercel Blob is a simple, fast way to store files in the cloud. It integrates seamlessly with Vercel deployments and provides:
- **Automatic scaling** - No need to manage storage infrastructure
- **Global CDN** - Files are served from edge locations worldwide
- **Simple API** - Easy to use with excellent TypeScript support
- **Cost-effective** - Pay only for what you use

## Step 1: Install Dependencies

Dependencies are already installed:
```bash
npm install @vercel/blob
```

## Step 2: Create a Blob Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `zoolyum-web-20`
3. Go to the **Storage** tab
4. Click **Create Database**
5. Select **Blob** and click **Continue**
6. Choose a name (e.g., `zoolyum-images`) and click **Create**

## Step 3: Add Environment Variables

After creating the Blob store, Vercel will automatically add the following environment variable to your project:

```
BLOB_READ_WRITE_TOKEN=<your-token>
```

### For Local Development

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Find `BLOB_READ_WRITE_TOKEN` and click to view it
3. Copy the value
4. Add it to your `.env.local` file:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_w_<your-token-here>
```

**Note:** Never commit your `.env.local` file to git!

## Step 4: Update Your Code

The code has been updated to use Vercel Blob:

### Upload API (`app/api/upload/route.ts`)
- Uses `uploadToBlob()` from `lib/blob-client.ts`
- Requires authentication via NextAuth
- Stores files with organized folder structure
- Returns public URL for uploaded files

### Delete API (`app/api/upload/delete/route.ts`)
- Uses `deleteFromBlob()` from `lib/blob-client.ts`
- Requires authentication via NextAuth
- Deletes files by URL or key

## Step 5: Usage Examples

### Using the Image Upload Component

```tsx
import { ImageUpload, UploadedImage } from '@/components/ui/image-upload'

function MyForm() {
  const [imageUrl, setImageUrl] = useState('')

  const handleUploadComplete = (url: string) => {
    setImageUrl(url)
    console.log('Image uploaded:', url)
  }

  const handleUploadError = (error: string) => {
    alert(`Upload failed: ${error}`)
  }

  return (
    <div>
      <ImageUpload
        onUploadComplete={handleUploadComplete}
        onError={handleUploadError}
        folder="blog-images"
        maxSize={5}
      />

      {imageUrl && (
        <UploadedImage
          url={imageUrl}
          onRemove={() => setImageUrl('')}
          alt="Uploaded image"
        />
      )}
    </div>
  )
}
```

### Direct API Usage

```typescript
// Upload an image
const formData = new FormData()
formData.append('file', file)
formData.append('folder', 'blog-posts')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
})

const { url, key } = await response.json()

// Delete an image
await fetch('/api/upload/delete', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url }),
})
```

## Folder Structure

Organize your uploads using the `folder` parameter:

- `blog-posts` - Blog post featured images
- `projects` - Project thumbnails and images
- `services` - Service-related images
- `team` - Team member photos
- `testimonials` - Testimonial avatars
- `campaigns` - Campaign images
- `uploads` - General uploads (default)

## File Size & Type Limits

**Maximum file size:** 5MB (configurable)
**Allowed types:** JPEG, PNG, WebP, GIF

## Image URLs

After upload, you'll receive a public URL like:

```
https://[blob-id].public.blob.vercel-storage.com/blog-posts/1234567890-image.jpg
```

You can store these URLs in your database and use them directly in `<img>` tags.

## Security

- All upload/delete endpoints require authentication
- Only authenticated admin users can upload
- Folder names are sanitized to prevent path traversal
- File types are validated on the server

## Pricing (as of 2025)

Vercel Blob offers a generous free tier:
- **Free:** 500GB storage, 1TB bandwidth per month
- **Paid:** $0.15/GB storage, $0.15/GB bandwidth

Most small to medium websites will stay within the free tier.

## Troubleshooting

### "Blob storage is not configured"
- Make sure `BLOB_READ_WRITE_TOKEN` is set in your environment variables
- For local development, add it to `.env.local`
- For production, add it in Vercel project settings

### Upload fails with 401 Unauthorized
- Make sure you're logged in as an admin user
- Check that NextAuth authentication is working
- Verify your session is valid

### Images not displaying
- Check that the URL is correct
- Verify the image was uploaded successfully
- Check browser console for errors

### Large files fail to upload
- The default limit is 5MB per file
- Adjust `MAX_FILE_SIZE` in `app/api/upload/route.ts` if needed
- Consider optimizing images before upload

## Migration from R2

If you were previously using Cloudflare R2:

1. The upload API has been updated to use Blob
2. Old R2 URLs will continue to work if files still exist
3. You can migrate by re-uploading images through the admin panel
4. Update any hardcoded R2 URLs in your database

## Next Steps

1. Test image uploads in your admin panel
2. Verify images display correctly on your website
3. Set up automatic image optimization (optional)
4. Consider adding image compression for uploads

## Support

For issues with:
- **Vercel Blob:** Check https://vercel.com/docs/storage/vercel-blob
- **This integration:** Open an issue in the repository
