# Consultations API

Manage consultation booking requests.

---

## GET /api/consultations

Get all consultation bookings (Admin only).

### Authentication
- **Required** - Admin only (Stack Auth)

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`) |
| `type` | string | No | Filter by consultation type |
| `limit` | number | No | Results per page (max: 100) |
| `offset` | number | No | Pagination offset |

### Response

```json
[
  {
    "id": "xxx-xxx-xxx",
    "fullName": "John Doe",
    "email": "john@example.com",
    "companyName": "Acme Corp",
    "websiteUrl": "https://acme.com",
    "role": "CEO",
    "mainChallenge": "Brand Awareness",
    "otherChallenge": "",
    "sessionGoal": "Develop brand strategy",
    "preferredDatetime": "2024-02-01T10:00:00.000Z",
    "additionalNotes": "Looking for comprehensive rebrand",
    "consultationType": "brand_strategy",
    "status": "PENDING",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Example

```bash
# Get all consultations
curl https://zoolyum-web-2-0.vercel.app/api/consultations

# Get pending consultations
curl https://zoolyum-web-2-0.vercel.app/api/consultations?status=PENDING

# Get brand strategy consultations
curl https://zoolyum-web-2-0.vercel.app/api/consultations?type=brand_strategy
```

---

## POST /api/consultations

Submit a consultation booking request.

### Authentication
- **Public** - No authentication required

### Request Body

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "companyName": "Acme Corporation",
  "websiteUrl": "https://acme.com",
  "role": "CEO",
  "mainChallenge": "Brand Awareness",
  "otherChallenge": "",
  "sessionGoal": "Develop brand strategy",
  "preferredDatetime": "2024-02-01T10:00:00.000Z",
  "additionalNotes": "Looking for comprehensive rebrand",
  "consultationType": "brand_strategy"
}
```

### Required Fields

- `fullName` (string) - Full name (min 2 characters)
- `email` (string) - Valid email address
- `mainChallenge` (string) - Main business challenge
- `sessionGoal` (string) - Goal for consultation session

### Optional Fields

- `companyName` (string) - Company name
- `websiteUrl` (string) - Company website URL
- `role` (string) - Job role
- `otherChallenge` (string) - Other challenges
- `preferredDatetime` (string) - ISO 8601 datetime
- `additionalNotes` (string) - Additional notes
- `consultationType` (string) - `brand_strategy` | `digital_strategy` | `creative_direction` (default: `brand_strategy`)

### Response

```json
{
  "message": "Consultation booking submitted successfully",
  "consultation": {
    "id": "xxx-xxx-xxx",
    "fullName": "John Doe",
    "email": "john@example.com",
    "consultationType": "brand_strategy",
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/consultations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "mainChallenge": "Brand Awareness",
    "sessionGoal": "Develop brand strategy",
    "consultationType": "brand_strategy"
  }'
```

---

## GET /api/consultations/stats

Get consultation booking statistics.

### Authentication
- **Required** - Admin only (Stack Auth)

### Response

```json
{
  "total": 150,
  "pending": 45,
  "confirmed": 60,
  "completed": 35,
  "cancelled": 10,
  "thisMonth": 25,
  "lastMonth": 20,
  "byType": {
    "brand_strategy": 60,
    "digital_strategy": 50,
    "creative_direction": 40
  }
}
```

### Example

```bash
curl https://zoolyum-web-2-0.vercel.app/api/consultations/stats
```

---

## GET /api/consultations/:id

Get a specific consultation.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Consultation UUID |

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "fullName": "John Doe",
  "email": "john@example.com",
  "consultationType": "brand_strategy",
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## PUT /api/consultations/:id

Update consultation status or details.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Consultation UUID |

### Request Body

```json
{
  "status": "CONFIRMED"
}
```

### Valid Status Values

- `PENDING` - Awaiting confirmation
- `CONFIRMED` - Booking confirmed
- `COMPLETED` - Consultation completed
- `CANCELLED` - Booking cancelled

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "status": "CONFIRMED",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

## DELETE /api/consultations/:id

Delete a consultation booking.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Consultation UUID |

### Response

```json
{
  "message": "Consultation deleted successfully"
}
```

---

## Data Models

### Consultation

```typescript
interface Consultation {
  id: string;                  // UUID
  fullName: string;            // Full name
  email: string;               // Email address
  companyName?: string;        // Company name
  websiteUrl?: string;         // Website URL
  role?: string;               // Job role
  mainChallenge: string;       // Main challenge
  otherChallenge?: string;     // Other challenges
  sessionGoal: string;         // Session goal
  preferredDatetime?: string;  // ISO 8601 datetime
  additionalNotes?: string;    // Additional notes
  consultationType: 'brand_strategy' | 'digital_strategy' | 'creative_direction';
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  ipAddress?: string;          // Submitting IP
  userAgent?: string;          // User agent
  createdAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
}
```

---

**Next:** [Contacts API](./CONTACTS-API.md)
