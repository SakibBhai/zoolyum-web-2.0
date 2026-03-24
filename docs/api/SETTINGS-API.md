# Settings API

Manage application-wide settings.

---

## GET /api/settings

Get all application settings.

### Authentication
- **Public** - No authentication required

### Response

```json
{
  "siteName": "Zoolyum",
  "siteDescription": "Brand Strategy & Digital Innovation Agency",
  "siteUrl": "https://zoolyum.com",
  "logoUrl": "https://zoolyum.com/logo.png",
  "faviconUrl": "https://zoolyum.com/favicon.ico",
  "seoKeywords": ["brand strategy", "digital marketing", "web design"],
  "socialMedia": {
    "twitter": "https://twitter.com/zoolyum",
    "linkedin": "https://linkedin.com/company/zoolyum",
    "instagram": "https://instagram.com/zoolyum"
  },
  "contactInfo": {
    "email": "contact@zoolyum.com",
    "phone": "+8801601000950",
    "address": "Mirpur 11, Dhaka, Bangladesh"
  }
}
```

### Example

```bash
curl https://zoolyum-web-2-0.vercel.app/api/settings
```

---

## PUT /api/settings

Update application settings.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "siteName": "Zoolyum",
  "siteDescription": "Brand Strategy & Digital Innovation",
  "logoUrl": "https://zoolyum.com/logo.png",
  "seoKeywords": ["brand strategy", "digital marketing"]
}
```

### Response

```json
{
  "message": "Settings updated successfully",
  "settings": { ... }
}
```

---

## Data Models

### SiteSettings

```typescript
interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  siteUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  seoKeywords?: string[];
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}
```

---

**Next:** [Site Management API](./SITE-API.md)
