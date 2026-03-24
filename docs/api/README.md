# Complete API Reference - Zoolyum Web Application

**Version:** 1.0.0
**Base URL:** `https://zoolyum-web-2-0.vercel.app/api`
**Total Endpoints:** 41

---

## Quick Navigation

### Content Management
- [Blog Posts API](./BLOG-POSTS-API.md) - 2 endpoints
- [Campaigns API](./CAMPAIGNS-API.md) - 3 endpoints
- [Campaign Submissions API](./CAMPAIGN-SUBMISSIONS-API.md) - 2 endpoints
- [Projects API](./PROJECTS-API.md) - 3 endpoints
- [Team API](./TEAM-API.md) - 2 endpoints
- [Testimonials API](./TESTIMONIALS-API.md) - 2 endpoints

### Forms & Contacts
- [Contacts API](./CONTACTS-API.md) - 5 endpoints
- [Consultations API](./CONSULTATIONS-API.md) - 4 endpoints
- [Jobs API](./JOBS-API.md) - 4 endpoints

### CMS & Settings
- [Homepage/CMS API](./HOMEPAGE-CMS-API.md) - 9 endpoints
- [Settings API](./SETTINGS-API.md) - 2 endpoints
- [Site Management API](./SITE-API.md) - 2 endpoints
- [Services API](./SERVICES-API.md) - 1 endpoint

### System
- [Health Check API](./HEALTH-API.md) - 1 endpoint
- [File Upload API](./UPLOAD-API.md) - 2 endpoints

---

## Authentication

### Quick Start
- 📖 **Setup Guide**: [Stack Auth Setup Guide](../STACK-AUTH-SETUP.md)
- 🔐 **Detailed Docs**: [Authentication Guide](../AUTHENTICATION.md)
- 🚀 **Quick Reference**: See below

### Public Endpoints
No authentication required:
- Blog Posts (GET)
- Campaigns (GET)
- Campaigns by slug (GET)
- Projects (GET)
- Projects by slug (GET)
- Team (GET)
- Testimonials (GET)
- Health check
- Homepage/CMS (GET)
- Services (GET)
- Settings (GET)
- Site navigation (GET)
- Jobs (GET)
- Contact form (POST)

### Protected Endpoints
Admin authentication required (Stack Auth):
- All POST, PUT, DELETE operations
- Contact management
- Consultation management
- Job application management
- CMS editing
- File uploads

### Development Mode
In development mode, authentication is **bypassed** for easy testing:
- `localhost` and `127.0.0.1` automatically bypass auth
- Mock user provided: `admin@zoolyum.com`
- No Stack Auth setup required for local development

### Production Mode
In production, **Stack Auth** is required:
- Configure environment variables (see [Stack Auth Setup](../STACK-AUTH-SETUP.md))
- Admin email whitelist in `lib/admin-utils.ts`
- Automatic redirect to login for unauthenticated users

---

## Rate Limiting

Current limits (subject to change):
- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- File uploads: 10 uploads/minute

---

## CORS

All API endpoints support CORS for cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Max-Age: 86400
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message",
  "details": { ... }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Common Patterns

### Pagination

```bash
GET /api/resource?limit=10&offset=20
```

### Filtering

```bash
GET /api/resource?status=published&type=blog
```

### ID/Slug Lookup

Many endpoints support lookup by both ID and slug:

```bash
GET /api/blog-posts/clxxx...    # By ID
GET /api/blog-posts/my-post     # By slug
```

---

## Quick Examples

### Fetch Blog Posts

```typescript
const response = await fetch('/api/blog-posts?published=true');
const posts = await response.json();
```

### Submit Contact Form

```typescript
const response = await fetch('/api/contacts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '01712345678',
    message: 'Interested in your services'
  })
});
```

### Get Team Members

```typescript
const response = await fetch('/api/team');
const members = await response.json();
```

### Upload File (Admin)

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'blog-posts');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

---

## Testing

### cURL Examples

```bash
# Health check
curl https://zoolyum-web-2-0.vercel.app/api/health/database

# Get blog posts
curl https://zoolyum-web-2-0.vercel.app/api/blog-posts

# Get published campaigns
curl https://zoolyum-web-2-0.vercel.app/api/campaigns?status=PUBLISHED

# Submit contact form
curl -X POST https://zoolyum-web-2-0.vercel.app/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"Hello"}'

# Get team members
curl https://zoolyum-web-2-0.vercel.app/api/team
```

---

## Support

For API issues or questions:
- GitHub Issues: [zoolyum-web-2.0](https://github.com/SakibBhai/zoolyum-web-2.0)
- Email: contact@zoolyum.com

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial release with 41 API endpoints
- Blog posts, campaigns, contacts, consultations management
- Job postings and applications
- CMS for homepage content
- File uploads to R2/S3
- Team and testimonials management
- Portfolio projects
- Site settings and navigation

---

**Last Updated:** January 15, 2024
