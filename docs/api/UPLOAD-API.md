# File Upload API

Handle file uploads to Cloudflare R2 or AWS S3.

---

## POST /api/upload

Upload a file to cloud storage.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body (multipart/form-data)

```
file: [image.jpg, video.mp4, document.pdf]
folder: "blog-posts" (optional)
```

### Response

```json
{
  "url": "https://zoolyum-uploads.r2.dev/blog-posts/image-xxx.jpg",
  "key": "blog-posts/image-xxx.jpg",
  "filename": "image-xxx.jpg",
  "size": 123456,
  "type": "image/jpeg"
}
```

### Supported File Types

- Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- Videos: `.mp4`, `.mov`, `.avi`, `.webm`
- Documents: `.pdf`, `.doc`, `.docx`, `.txt`

### File Size Limits

- Images: Max 10MB
- Videos: Max 100MB
- Documents: Max 25MB

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/upload \
  -F "file=@image.jpg" \
  -F "folder=blog-posts"
```

---

## DELETE /api/upload/delete

Delete a file from cloud storage.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "key": "blog-posts/image-xxx.jpg"
}
```

### Response

```json
{
  "message": "File deleted successfully",
  "key": "blog-posts/image-xxx.jpg"
}
```

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/upload/delete \
  -H "Content-Type: application/json" \
  -d '{"key": "blog-posts/image-xxx.jpg"}'
```

---

## Configuration

### Environment Variables

Required for file upload functionality:

```env
# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=zoolyum-uploads
R2_PUBLIC_URL=https://zoolyum-uploads.r2.dev

# OR AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
```

---

## Data Models

### UploadResponse

```typescript
interface UploadResponse {
  url: string;          // Public URL
  key: string;          // Storage key
  filename: string;     // Generated filename
  size: number;         // File size in bytes
  type: string;         // MIME type
}
```

### DeleteRequest

```typescript
interface DeleteRequest {
  key: string;          // Storage key to delete
}
```

---

**Back to:** [API Documentation Index](./API-DOCUMENTATION.md)
