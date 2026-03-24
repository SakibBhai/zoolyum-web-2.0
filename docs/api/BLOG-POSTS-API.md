# Blog Posts API

Manage blog articles and content.

---

## GET /api/blog-posts

Get all blog posts with optional filtering.

### Authentication
- **Public** - No authentication required

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `published` | boolean | No | Filter by published status (`true`/`false`) |

### Response

```json
[
  {
    "id": "clxxx...",
    "title": "Getting Started with Next.js 15",
    "slug": "getting-started-with-nextjs-15",
    "excerpt": "Learn the fundamentals of Next.js 15...",
    "content": "<p>Full article content...</p>",
    "imageUrl": "https://example.com/image.jpg",
    "published": true,
    "tags": ["Next.js", "React", "Web Development"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "authorId": "user@example.com"
  }
]
```

### Example

```bash
# Get all published posts
curl https://zoolyum-web-2-0.vercel.app/api/blog-posts?published=true

# Get all posts
curl https://zoolyum-web-2-0.vercel.app/api/blog-posts
```

### Errors

| Status | Description |
|--------|-------------|
| 500 | Internal server error |

---

## POST /api/blog-posts

Create a new blog post.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "title": "Getting Started with Next.js 15",
  "slug": "getting-started-with-nextjs-15",
  "excerpt": "Learn the fundamentals of Next.js 15...",
  "content": "<p>Full article content...</p>",
  "imageUrl": "https://example.com/image.jpg",
  "published": true,
  "tags": ["Next.js", "React", "Web Development"]
}
```

### Required Fields

- `title` (string) - Post title
- `slug` (string) - URL-friendly unique identifier
- `excerpt` (string) - Short summary
- `content` (string) - Full article content (HTML/Markdown)

### Optional Fields

- `imageUrl` (string) - Featured image URL
- `published` (boolean) - Publication status (default: `false`)
- `tags` (string[]) - Content tags

### Response

```json
{
  "id": "clxxx...",
  "title": "Getting Started with Next.js 15",
  "slug": "getting-started-with-nextjs-15",
  "excerpt": "Learn the fundamentals of Next.js 15...",
  "content": "<p>Full article content...</p>",
  "imageUrl": "https://example.com/image.jpg",
  "published": true,
  "tags": ["Next.js", "React", "Web Development"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "authorId": "user@example.com"
}
```

### Errors

| Status | Description |
|--------|-------------|
| 400 | Missing required fields |
| 401 | Unauthorized |
| 409 | Slug already exists |
| 500 | Internal server error |

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/blog-posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with Next.js 15",
    "slug": "getting-started-with-nextjs-15",
    "excerpt": "Learn the fundamentals...",
    "content": "<p>Full article content...</p>",
    "published": true,
    "tags": ["Next.js", "React"]
  }'
```

---

## GET /api/blog-posts/:id

Get a specific blog post by ID or slug.

### Authentication
- **Public** - No authentication required

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Blog post ID or slug |

### Response

```json
{
  "id": "clxxx...",
  "title": "Getting Started with Next.js 15",
  "slug": "getting-started-with-nextjs-15",
  "excerpt": "Learn the fundamentals of Next.js 15...",
  "content": "<p>Full article content...</p>",
  "imageUrl": "https://example.com/image.jpg",
  "published": true,
  "tags": ["Next.js", "React", "Web Development"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "authorId": "user@example.com"
}
```

### Example

```bash
# Get by ID
curl https://zoolyum-web-2-0.vercel.app/api/blog-posts/clxxx...

# Get by slug
curl https://zoolyum-web-2-0.vercel.app/api/blog-posts/getting-started-with-nextjs-15
```

### Errors

| Status | Description |
|--------|-------------|
| 404 | Blog post not found |
| 500 | Internal server error |

---

## PUT /api/blog-posts/:id

Update an existing blog post.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Blog post ID |

### Request Body

```json
{
  "title": "Updated Title",
  "slug": "updated-slug",
  "excerpt": "Updated excerpt...",
  "content": "<p>Updated content...</p>",
  "imageUrl": "https://example.com/new-image.jpg",
  "published": true,
  "tags": ["Updated", "Tags"]
}
```

All fields are optional. Only provided fields will be updated.

### Response

```json
{
  "id": "clxxx...",
  "title": "Updated Title",
  "slug": "updated-slug",
  "excerpt": "Updated excerpt...",
  "content": "<p>Updated content...</p>",
  "imageUrl": "https://example.com/new-image.jpg",
  "published": true,
  "tags": ["Updated", "Tags"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z",
  "authorId": "user@example.com"
}
```

### Example

```bash
curl -X PUT https://zoolyum-web-2-0.vercel.app/api/blog-posts/clxxx... \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "published": true
  }'
```

### Errors

| Status | Description |
|--------|-------------|
| 400 | Invalid request data |
| 401 | Unauthorized |
| 404 | Blog post not found |
| 409 | Slug already exists |
| 500 | Internal server error |

---

## DELETE /api/blog-posts/:id

Delete a blog post.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Blog post ID |

### Response

```json
{
  "message": "Blog post deleted successfully"
}
```

### Example

```bash
curl -X DELETE https://zoolyum-web-2-0.vercel.app/api/blog-posts/clxxx...
```

### Errors

| Status | Description |
|--------|-------------|
| 401 | Unauthorized |
| 404 | Blog post not found |
| 500 | Internal server error |

---

## Data Models

### BlogPost

```typescript
interface BlogPost {
  id: string;              // CUID
  title: string;           // Post title
  slug: string;            // URL slug (unique)
  excerpt: string;         // Short summary
  content: string;         // Full content
  imageUrl?: string;       // Featured image
  published: boolean;      // Published status
  tags: string[];          // Content tags
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
  authorId?: string;       // Author email/ID
}
```

---

## Usage Examples

### React (Next.js)

```typescript
// Fetch all published posts
const response = await fetch('/api/blog-posts?published=true');
const posts = await response.json();

// Create new post
const createPost = async (postData) => {
  const response = await fetch('/api/blog-posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  return await response.json();
};

// Update post
const updatePost = async (id, updates) => {
  const response = await fetch(`/api/blog-posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return await response.json();
};

// Delete post
const deletePost = async (id) => {
  await fetch(`/api/blog-posts/${id}`, {
    method: 'DELETE'
  });
};
```

### cURL

```bash
# Get all posts
curl https://zoolyum-web-2-0.vercel.app/api/blog-posts

# Get published posts
curl https://zoolyum-web-2-0.vercel.app/api/blog-posts?published=true

# Get specific post
curl https://zoolyum-web-2-0.vercel.app/api/blog-posts/getting-started-with-nextjs-15

# Create post
curl -X POST https://zoolyum-web-2-0.vercel.app/api/blog-posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Post",
    "slug": "new-post",
    "excerpt": "Summary...",
    "content": "Content...",
    "published": true
  }'

# Update post
curl -X POST https://zoolyum-web-2-0.vercel.app/api/blog-posts/clxxx... \
  -H "Content-Type: application/json" \
  -d '{"published": false}'

# Delete post
curl -X DELETE https://zoolyum-web-2-0.vercel.app/api/blog-posts/clxxx...
```

---

**Next:** [Campaigns API](./CAMPAIGNS-API.md)
