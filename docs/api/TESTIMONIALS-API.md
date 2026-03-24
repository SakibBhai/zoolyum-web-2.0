# Testimonials API

Manage client testimonials.

---

## GET /api/testimonials

Get all testimonials with optional filtering.

### Authentication
- **Public** - No authentication required

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `featured` | boolean | No | Filter by featured status |
| `approved` | boolean | No | Filter by approval status |

### Response

```json
[
  {
    "id": "clxxx...",
    "name": "John Smith",
    "company": "Acme Corporation",
    "position": "CEO",
    "content": "Zoolyum transformed our brand completely. Amazing work!",
    "rating": 5,
    "imageUrl": "https://example.com/avatar.jpg",
    "featured": true,
    "approved": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Example

```bash
# Get all testimonials
curl https://zoolyum-web-2-0.vercel.app/api/testimonials

# Get featured testimonials
curl https://zoolyum-web-2-0.vercel.app/api/testimonials?featured=true

# Get approved testimonials
curl https://zoolyum-web-2-0.vercel.app/api/testimonials?approved=true
```

---

## POST /api/testimonials

Create a new testimonial.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "name": "Jane Doe",
  "company": "Tech Corp",
  "position": "CTO",
  "content": "Outstanding service and exceptional results!",
  "rating": 5,
  "imageUrl": "https://example.com/avatar.jpg",
  "featured": true,
  "approved": true
}
```

### Required Fields

- `name` (string) - Client name
- `content` (string) - Testimonial content
- `rating` (number) - Rating (1-5)

### Optional Fields

- `company` (string) - Company name
- `position` (string) - Job position
- `imageUrl` (string) - Client photo URL
- `featured` (boolean) - Featured status (default: `false`)
- `approved` (boolean) - Approval status (default: `false`)

### Response

```json
{
  "id": "clxxx...",
  "name": "Jane Doe",
  "company": "Tech Corp",
  "position": "CTO",
  "content": "Outstanding service and exceptional results!",
  "rating": 5,
  "imageUrl": "https://example.com/avatar.jpg",
  "featured": true,
  "approved": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "company": "Tech Corp",
    "content": "Amazing work!",
    "rating": 5,
    "featured": true,
    "approved": true
  }'
```

---

## GET /api/testimonials/:id

Get a specific testimonial.

### Authentication
- **Public** - No authentication required

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Testimonial ID |

### Response

```json
{
  "id": "clxxx...",
  "name": "John Smith",
  "company": "Acme Corporation",
  "content": "Great service!",
  "rating": 5,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## PUT /api/testimonials/:id

Update a testimonial.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Testimonial ID |

### Request Body

```json
{
  "name": "Updated Name",
  "approved": true,
  "featured": true
}
```

### Response

```json
{
  "id": "clxxx...",
  "name": "Updated Name",
  "approved": true,
  "featured": true,
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

## DELETE /api/testimonials/:id

Delete a testimonial.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Testimonial ID |

### Response

```json
{
  "message": "Testimonial deleted successfully"
}
```

---

## Data Models

### Testimonial

```typescript
interface Testimonial {
  id: string;              // CUID
  name: string;            // Client name
  company?: string;        // Company name
  position?: string;       // Job position
  content: string;         // Testimonial content
  rating: number;          // 1-5 rating
  imageUrl?: string;       // Client photo
  featured: boolean;       // Featured status
  approved: boolean;       // Approval status
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

---

**Next:** [Jobs API](./JOBS-API.md)
