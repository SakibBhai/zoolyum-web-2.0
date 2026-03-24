# Campaign Submissions API

Handle campaign form submissions.

---

## GET /api/campaign-submissions

Get all campaign form submissions.

### Authentication
- **Required** - Admin only (Stack Auth)

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaignId` | string | No | Filter by campaign ID |
| `limit` | number | No | Results per page (max: 100) |
| `offset` | number | No | Pagination offset |

### Response

```json
[
  {
    "id": "clxxx...",
    "campaignId": "clxxx...",
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "message": "I'm interested in this campaign"
    },
    "submittedAt": "2024-01-15T10:30:00.000Z",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
]
```

### Example

```bash
# Get all submissions
curl https://zoolyum-web-2-0.vercel.app/api/campaign-submissions

# Get submissions for specific campaign
curl https://zoolyum-web-2-0.vercel.app/api/campaign-submissions?campaignId=clxxx...
```

---

## POST /api/campaign-submissions

Submit a campaign form.

### Authentication
- **Public** - No authentication required

### Request Body

```json
{
  "campaignId": "clxxx...",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I'm interested in this campaign"
  }
}
```

### Required Fields

- `campaignId` (string) - Campaign ID
- `data` (object) - Form submission data (must match campaign's form fields)

### Response

```json
{
  "id": "clxxx...",
  "campaignId": "clxxx...",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I'm interested in this campaign"
  },
  "submittedAt": "2024-01-15T10:30:00.000Z",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/campaign-submissions \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "clxxx...",
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Interested!"
    }
  }'
```

---

## Data Models

### CampaignSubmission

```typescript
interface CampaignSubmission {
  id: string;              // CUID
  campaignId: string;      // Campaign CUID
  data: Record<string, any>; // Form submission data
  submittedAt: string;     // ISO 8601 timestamp
  ipAddress?: string;      // Submitting IP
  userAgent?: string;      // User agent string
}
```

---

**Next:** [Consultations API](./CONSULTATIONS-API.md)
