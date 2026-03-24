# Services API

Manage service offerings.

---

## GET /api/services

Get all services.

### Authentication
- **Public** - No authentication required

### Response

```json
[
  {
    "id": "clxxx...",
    "title": "Brand Strategy",
    "slug": "brand-strategy",
    "description": "Strategic brand positioning and identity development",
    "icon": "target",
    "features": [
      "Brand Audit",
      "Competitor Analysis",
      "Brand Guidelines",
      "Messaging Framework"
    ],
    "process": [
      "Discovery",
      "Strategy",
      "Design",
      "Implementation"
    ],
    "pricing": {
      "startingFrom": 5000,
      "currency": "USD"
    },
    "isActive": true,
    "order": 1
  }
]
```

### Example

```bash
curl https://zoolyum-web-2-0.vercel.app/api/services
```

---

## Data Models

### Service

```typescript
interface Service {
  id: string;                  // CUID
  title: string;               // Service title
  slug: string;                // URL slug
  description: string;         // Service description
  icon?: string;               // Icon name
  features?: string[];         // Service features
  process?: string[];          // Process steps
  pricing?: {
    startingFrom: number;
    currency: string;
  };
  isActive: boolean;           // Active status
  order: number;               // Display order
}
```

---

**Next:** [File Upload API](./UPLOAD-API.md)
