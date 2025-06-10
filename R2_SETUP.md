# Cloudflare R2 Upload Setup Guide

This guide explains how to set up Cloudflare R2 for file uploads in the admin dashboard.

## Prerequisites

1. A Cloudflare account
2. R2 storage enabled in your Cloudflare account
3. An R2 bucket created

## Setup Steps

### 1. Create an R2 Bucket

1. Log in to your Cloudflare dashboard
2. Navigate to R2 Object Storage
3. Click "Create bucket"
4. Choose a unique bucket name
5. Select a location (optional)
6. Click "Create bucket"

### 2. Generate R2 API Tokens

1. In your Cloudflare dashboard, go to "My Profile" > "API Tokens"
2. Click "Create Token"
3. Use the "Custom token" template
4. Configure the token:
   - **Token name**: `R2 Upload Token`
   - **Permissions**: 
     - Account - Cloudflare R2:Edit
   - **Account Resources**: Include - Your Account
   - **Zone Resources**: Include - All zones (or specific zones if preferred)
5. Click "Continue to summary" and then "Create Token"
6. Copy the token - this will be your `R2_ACCESS_KEY_ID`
7. Generate a secret key for the token - this will be your `R2_SECRET_ACCESS_KEY`

### 3. Configure Environment Variables

Update your `.env.local` file with the following variables:

```env
# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-custom-domain.com
```

**Where to find these values:**

- **R2_ENDPOINT**: Replace `your-account-id` with your Cloudflare Account ID (found in the right sidebar of your Cloudflare dashboard)
- **R2_ACCESS_KEY_ID**: The API token you created
- **R2_SECRET_ACCESS_KEY**: The secret key for your API token
- **R2_BUCKET_NAME**: The name of your R2 bucket
- **R2_PUBLIC_URL**: (Optional) Your custom domain for serving files. If not set, files will be served from the R2 endpoint

### 4. Set Up Custom Domain (Optional but Recommended)

For better performance and SEO, set up a custom domain:

1. In your R2 bucket settings, go to "Settings" > "Custom Domains"
2. Click "Connect Domain"
3. Enter your domain (e.g., `cdn.yourdomain.com`)
4. Follow the DNS setup instructions
5. Update the `R2_PUBLIC_URL` environment variable with your custom domain

### 5. Configure Bucket CORS (If Needed)

If you plan to upload directly from the browser, configure CORS:

1. In your R2 bucket, go to "Settings" > "CORS policy"
2. Add a CORS policy:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

## Usage

Once configured, the upload functionality will work automatically in:

- **Projects**: When creating or editing projects, you can upload featured images and gallery images
- **Blog Posts**: When creating or editing blog posts, you can upload featured images
- **Other Admin Sections**: Any component using `ImageUploader` or `GalleryUploader`

## File Validation

The system automatically validates:

- **File Types**: JPEG, PNG, WebP, GIF
- **File Size**: Maximum 5MB per file
- **Authentication**: Only authenticated admin users can upload

## File Organization

Files are organized in folders:

- `uploads/` - Default folder for general uploads
- `projects/` - Project-related images
- `blog/` - Blog post images
- Custom folders can be specified when uploading

## Troubleshooting

### Upload Fails with "R2 storage not configured"

- Check that all environment variables are set correctly
- Verify your Cloudflare Account ID in the endpoint URL
- Ensure your API token has the correct permissions

### Upload Fails with "Unauthorized"

- Verify your R2 API credentials
- Check that your API token hasn't expired
- Ensure the token has R2:Edit permissions

### Files Upload but Don't Display

- Check your `R2_PUBLIC_URL` setting
- Verify your custom domain is configured correctly
- Ensure your bucket allows public read access for uploaded files

### CORS Errors

- Configure CORS policy in your R2 bucket settings
- Add your domain to the allowed origins
- Restart your development server after changing environment variables

## Security Notes

- Never commit your `.env.local` file to version control
- Use different API tokens for development and production
- Regularly rotate your API tokens
- Consider implementing additional rate limiting for production use
- The current implementation validates file types and sizes server-side for security

## Cost Considerations

Cloudflare R2 pricing (as of 2024):

- **Storage**: $0.015 per GB per month
- **Class A Operations** (writes): $4.50 per million requests
- **Class B Operations** (reads): $0.36 per million requests
- **Egress**: Free (no bandwidth charges)

For most applications, R2 is very cost-effective compared to other cloud storage solutions.