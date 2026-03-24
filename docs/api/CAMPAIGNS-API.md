# Campaigns API

Manage marketing campaigns with dynamic forms and landing pages.

---

## GET /api/campaigns

Get all campaigns with optional status filtering.

### Authentication
- **Public** - No authentication required

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status (`DRAFT`, `PUBLISHED`, `ARCHIVED`) |

### Response

```json
[
  {
    "id": "clxxx...",
    "title": "Summer Sale 2024",
    "slug": "summer-sale-2024",
    "shortDescription": "Massive discounts on all services",
    "status": "PUBLISHED",
    "startDate": "2024-06-01T00:00:00.000Z"
  }
]
```

### Example

```bash
# Get all campaigns
curl https://zoolyum-web-2-0.vercel.app/api/campaigns

# Get published campaigns only
curl https://zoolyum-web-2-0.vercel.app/api/campaigns?status=PUBLISHED
```

---

## POST /api/campaigns

Create a new marketing campaign.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "title": "Summer Sale 2024",
  "slug": "summer-sale-2024",
  "shortDescription": "Massive discounts on all services",
  "content": "<p>Campaign details...</p>",
  "status": "PUBLISHED",
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-06-30T23:59:59.000Z",
  "imageUrls": ["https://example.com/image1.jpg"],
  "videoUrls": ["https://example.com/video1.mp4"],
  "enableForm": true,
  "successMessage": "Thank you for participating!",
  "redirectUrl": "https://example.com/thank-you",
  "ctas": [
    {
      "label": "Learn More",
      "url": "https://example.com/learn-more"
    }
  ],
  "formFields": [
    {
      "id": "name",
      "name": "name",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your name"
    },
    {
      "id": "email",
      "name": "email",
      "label": "Email Address",
      "type": "email",
      "required": true,
      "placeholder": "you@example.com"
    }
  ]
}
```

### Required Fields

- `title` (string) - Campaign title
- `slug` (string) - URL-friendly unique identifier

### Optional Fields

- `shortDescription` (string) - Brief description
- `content` (string) - Full campaign content
- `status` (string) - Status: `DRAFT` | `PUBLISHED` | `ARCHIVED` (default: `DRAFT`)
- `startDate` (string) - ISO 8601 datetime
- `endDate` (string) - ISO 8601 datetime
- `imageUrls` (string[]) - Image URLs
- `videoUrls` (string[]) - Video URLs
- `enableForm` (boolean) - Enable form submission (default: `false`)
- `successMessage` (string) - Form success message
- `redirectUrl` (string) - Post-submission redirect URL
- `ctas` (object[]) - Call-to-action buttons
- `formFields` (object[]) - Dynamic form schema

### Response

```json
{
  "id": "clxxx...",
  "title": "Summer Sale 2024",
  "slug": "summer-sale-2024",
  "shortDescription": "Massive discounts on all services",
  "status": "PUBLISHED",
  "startDate": "2024-06-01T00:00:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Sale 2024",
    "slug": "summer-sale-2024",
    "shortDescription": "Massive discounts",
    "status": "PUBLISHED",
    "enableForm": true,
    "formFields": [
      {
        "id": "email",
        "name": "email",
        "label": "Email",
        "type": "email",
        "required": true
      }
    ]
  }'
```

---

## GET /api/campaigns/:id

Get a specific campaign by ID or slug.

### Authentication
- **Public** - No authentication required

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Campaign ID or slug |

### Response

```json
{
  "id": "clxxx...",
  "title": "Summer Sale 2024",
  "slug": "summer-sale-2024",
  "shortDescription": "Massive discounts on all services",
  "content": "<p>Campaign details...</p>",
  "status": "PUBLISHED",
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-06-30T23:59:59.000Z",
  "imageUrls": ["https://example.com/image1.jpg"],
  "videoUrls": ["https://example.com/video1.mp4"],
  "enableForm": true,
  "formFields": [...],
  "ctas": [...],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Example

```bash
# Get by ID
curl https://zoolyum-web-2-0.vercel.app/api/campaigns/clxxx...

# Get by slug
curl https://zoolyum-web-2-0.vercel.app/api/campaigns/summer-sale-2024
```

---

## PUT /api/campaigns/:id

Update an existing campaign.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Campaign ID |

### Request Body

```json
{
  "title": "Updated Campaign Title",
  "slug": "updated-slug",
  "shortDescription": "Updated description",
  "content": "<p>Updated content...</p>",
  "status": "PUBLISHED",
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-06-30T23:59:59.000Z"
}
```

### Response

```json
{
  "id": "clxxx...",
  "title": "Updated Campaign Title",
  "slug": "updated-slug",
  "shortDescription": "Updated description",
  "status": "PUBLISHED",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### Example

```bash
curl -X PUT https://zoolyum-web-2-0.vercel.app/api/campaigns/clxxx... \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "status": "PUBLISHED"}'
```

---

## DELETE /api/campaigns/:id

Delete a campaign.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Campaign ID |

### Response

```json
{
  "message": "Campaign deleted successfully"
}
```

### Example

```bash
curl -X DELETE https://zoolyum-web-2-0.vercel.app/api/campaigns/clxxx...
```

---

## GET /api/campaigns/slug/:slug

Get a published campaign by slug (public endpoint).

### Authentication
- **Public** - No authentication required

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Campaign slug |

### Response

```json
{
  "id": "clxxx...",
  "title": "Summer Sale 2024",
  "slug": "summer-sale-2024",
  "shortDescription": "Massive discounts on all services",
  "content": "<p>Campaign details...</p>",
  "status": "PUBLISHED",
  "imageUrls": ["https://example.com/image1.jpg"],
  "videoUrls": [],
  "enableForm": true,
  "formFields": [
    {
      "id": "name",
      "name": "name",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your name"
    }
  ],
  "ctas": [
    {
      "label": "Learn More",
      "url": "https://example.com/learn-more"
    }
  ],
  "successMessage": "Thank you for participating!",
  "redirectUrl": "https://example.com/thank-you",
  "startDate": "2024-06-01T00:00:00.000Z",
  "endDate": "2024-06-30T23:59:59.000Z"
}
```

### Example

```bash
curl https://zoolyum-web-2-0.vercel.app/api/campaigns/slug/summer-sale-2024
```

---

## Data Models

### Campaign

```typescript
interface Campaign {
  id: string;                  // CUID
  title: string;               // Campaign title
  slug: string;                // URL slug (unique)
  shortDescription?: string;   // Brief description
  content?: string;            // Full campaign content
  status: string;              // DRAFT | PUBLISHED | ARCHIVED
  startDate?: string;          // ISO 8601 datetime
  endDate?: string;            // ISO 8601 datetime
  imageUrls: string[];         // Image URLs
  videoUrls: string[];         // Video URLs
  enableForm: boolean;         // Form enabled
  successMessage?: string;     // Form success message
  redirectUrl?: string;        // Redirect URL
  ctas?: CTA[];                // Call-to-action buttons
  formFields?: FormField[];    // Dynamic form schema
  createdAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
}

interface CTA {
  label: string;               // Button label
  url: string;                 // Destination URL
}

interface FormField {
  id: string;                  // Field identifier
  name: string;                // Field name
  label: string;               // Field label
  type: string;                // text | email | phone | textarea | select | checkbox | radio | date | number
  required: boolean;           // Required field
  placeholder?: string;        // Placeholder text
  description?: string;        // Field description
  options?: string[];          // Options for select/radio
}
```

---

**Next:** [Campaign Submissions API](./CAMPAIGN-SUBMISSIONS-API.md)
