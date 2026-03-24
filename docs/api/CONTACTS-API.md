# Contacts API

Manage contact form submissions and settings.

---

## GET /api/contacts

Get all contact form submissions.

### Authentication
- **Required** - Admin only (Stack Auth)

### Response

```json
[
  {
    "id": "clxxx...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+880171234567",
    "countryCode": "+880",
    "company": "Acme Corp",
    "businessName": "Acme Corporation",
    "businessWebsite": "https://acme.com",
    "services": ["SEO", "Google Ads"],
    "subject": "Project Inquiry",
    "message": "I'd like to discuss a project",
    "status": "NEW",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "chartNumber": "CT-1234567890-ABCD",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Example

```bash
curl https://zoolyum-web-2-0.vercel.app/api/contacts
```

---

## POST /api/contacts

Submit a contact form.

### Authentication
- **Public** - No authentication required

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01712345678",
  "countryCode": "+880",
  "businessName": "Acme Corporation",
  "businessWebsite": "https://acme.com",
  "services": ["SEO", "Google Ads Management & Scaling"],
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project"
}
```

### Validation

- `name` - Required, min 2 characters
- `email` - Optional, must be valid email if provided
- `phone` - Required, Bangladesh format (11 digits starting with 01) or international format (7-15 digits)
- `businessWebsite` - Optional, must be valid URL if provided
- `services` - Optional, array of service names

### Response

```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon.",
  "id": "clxxx...",
  "submittedAt": "2024-01-15T10:30:00.000Z"
}
```

### Errors

| Status | Description |
|--------|-------------|
| 400 | Validation failed |
| 500 | Internal server error |

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "01712345678",
    "countryCode": "+880",
    "businessName": "Acme Corp",
    "services": ["SEO"],
    "message": "Interested in your services"
  }'
```

---

## GET /api/contacts/:id

Get a specific contact submission.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Contact ID |

### Response

```json
{
  "id": "clxxx...",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+880171234567",
  "message": "I'd like to discuss a project",
  "status": "NEW",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## PUT /api/contacts/:id

Update a contact submission.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Contact ID |

### Request Body

```json
{
  "name": "John Doe",
  "status": "REPLIED"
}
```

### Valid Status Values

- `NEW` - New submission
- `READ` - Read but not replied
- `REPLIED` - Replied to
- `ARCHIVED` - Archived

### Response

```json
{
  "id": "clxxx...",
  "name": "John Doe",
  "status": "REPLIED",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

## DELETE /api/contacts/:id

Delete a contact submission.

### Authentication
- **Required** - Admin only (Stack Auth)

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Contact ID |

### Response

```json
{
  "message": "Contact deleted successfully"
}
```

---

## GET /api/contacts/settings

Get contact form settings.

### Authentication
- **Required** - Admin only (Stack Auth)

### Response

```json
{
  "id": "default",
  "email": "contact@zoolyum.com",
  "phone": "01601000950",
  "address": "Mirpur 11, Dhaka",
  "workingHours": "Monday - Friday: 9:00 AM - 6:00 PM",
  "twitterUrl": "https://x.com/zoolyum",
  "linkedinUrl": "https://linkedin.com/company/zoolyum",
  "instagramUrl": "https://instagram.com/zoolyum",
  "behanceUrl": "https://behance.net/zoolyum",
  "enablePhoneField": true,
  "requirePhoneField": true,
  "autoReplyEnabled": false,
  "autoReplyMessage": null,
  "notificationEmail": "admin@zoolyum.com",
  "emailNotifications": true
}
```

---

## PUT /api/contacts/settings

Update contact form settings.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "email": "contact@zoolyum.com",
  "phone": "01601000950",
  "address": "Mirpur 11, Dhaka",
  "workingHours": "Monday - Friday: 9:00 AM - 6:00 PM",
  "twitterUrl": "https://x.com/zoolyum",
  "linkedinUrl": "https://linkedin.com/company/zoolyum",
  "enablePhoneField": true,
  "requirePhoneField": true,
  "autoReplyEnabled": true,
  "autoReplyMessage": "Thank you for contacting us!",
  "emailNotifications": true
}
```

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "email": "contact@zoolyum.com",
  "phone": "01601000950",
  "enablePhoneField": true,
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

## GET /api/contacts/stats

Get contact form statistics.

### Authentication
- **Required** - Admin only (Stack Auth)

### Response

```json
{
  "total": 150,
  "new": 45,
  "read": 30,
  "replied": 50,
  "archived": 25,
  "thisMonth": 35,
  "lastMonth": 28,
  "growth": 25.0
}
```

---

## Data Models

### Contact

```typescript
interface Contact {
  id: string;                  // CUID
  name: string;                // Contact name
  email?: string;              // Email address
  phone?: string;              // Phone number
  countryCode?: string;        // Country code (+880)
  company?: string;            // Company name (legacy)
  businessName?: string;       // Business name
  businessWebsite?: string;    // Business website
  services?: string[];         // Selected services
  subject?: string;            // Subject line
  message: string;             // Message content
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  ipAddress?: string;          // Submitting IP
  userAgent?: string;          // User agent
  chartNumber: string;         // Unique chart number
  createdAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
}
```

### ContactSettings

```typescript
interface ContactSettings {
  id: string | number;
  email?: string;
  phone?: string;
  address?: string;
  workingHours?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  behanceUrl?: string;
  enablePhoneField: boolean;
  requirePhoneField: boolean;
  autoReplyEnabled: boolean;
  autoReplyMessage?: string;
  notificationEmail?: string;
  emailNotifications: boolean;
  updatedAt: string;
}
```

---

**Next:** [Consultations API](./CONSULTATIONS-API.md)
