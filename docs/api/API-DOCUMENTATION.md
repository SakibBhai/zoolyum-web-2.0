# Zoolyum Web API Documentation

Complete API reference for the Zoolyum Web Application.

**Base URL:** `https://zoolyum-web-2-0.vercel.app/api` (Production)
**Local URL:** `http://localhost:3000/api` (Development)

**Version:** 1.0.0
**Total Endpoints:** 41
**Documentation Files:** 17

---

## Table of Contents

- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Response Format](#response-format)
- [Error Handling](#error-handling)

---

## Quick Start

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

---

## Authentication

Most endpoints require authentication using **Stack Auth**.

### Development Mode
In development mode (localhost), authentication is **bypassed** automatically.

### Production
In production, include the session cookie from Stack Auth in your requests.

```typescript
// Authentication is handled automatically via cookies
// No manual token management required
```

---

## API Reference

### 📝 Content Management

| API | Endpoints | Documentation |
|-----|-----------|----------------|
| **Blog Posts** | 5 | [BLOG-POSTS-API.md](./BLOG-POSTS-API.md) |
| **Campaigns** | 5 | [CAMPAIGNS-API.md](./CAMPAIGNS-API.md) |
| **Campaign Submissions** | 2 | [CAMPAIGN-SUBMISSIONS-API.md](./CAMPAIGN-SUBMISSIONS-API.md) |
| **Projects** | 3 | [PROJECTS-API.md](./PROJECTS-API.md) |
| **Team** | 2 | [TEAM-API.md](./TEAM-API.md) |
| **Testimonials** | 5 | [TESTIMONIALS-API.md](./TESTIMONIALS-API.md) |

### 📧 Forms & Contacts

| API | Endpoints | Documentation |
|-----|-----------|----------------|
| **Contacts** | 5 | [CONTACTS-API.md](./CONTACTS-API.md) |
| **Consultations** | 4 | [CONSULTATIONS-API.md](./CONSULTATIONS-API.md) |
| **Jobs** | 4 | [JOBS-API.md](./JOBS-API.md) |

### ⚙️ CMS & Settings

| API | Endpoints | Documentation |
|-----|-----------|----------------|
| **Homepage/CMS** | 9 | [HOMEPAGE-CMS-API.md](./HOMEPAGE-CMS-API.md) |
| **Settings** | 2 | [SETTINGS-API.md](./SETTINGS-API.md) |
| **Site Management** | 4 | [SITE-API.md](./SITE-API.md) |
| **Services** | 1 | [SERVICES-API.md](./SERVICES-API.md) |

### 🔧 System

| API | Endpoints | Documentation |
|-----|-----------|----------------|
| **Health Check** | 1 | [HEALTH-API.md](./HEALTH-API.md) |
| **File Upload** | 2 | [UPLOAD-API.md](./UPLOAD-API.md) |

---

## Endpoint Summary

### Blog Posts API (5 endpoints)
- `GET /api/blog-posts` - Get all posts
- `POST /api/blog-posts` - Create post (Admin)
- `GET /api/blog-posts/:id` - Get post by ID/slug
- `PUT /api/blog-posts/:id` - Update post (Admin)
- `DELETE /api/blog-posts/:id` - Delete post (Admin)

### Campaigns API (5 endpoints)
- `GET /api/campaigns` - Get all campaigns
- `POST /api/campaigns` - Create campaign (Admin)
- `GET /api/campaigns/:id` - Get campaign by ID/slug
- `PUT /api/campaigns/:id` - Update campaign (Admin)
- `DELETE /api/campaigns/:id` - Delete campaign (Admin)
- `GET /api/campaigns/slug/:slug` - Get published campaign by slug

### Campaign Submissions API (2 endpoints)
- `GET /api/campaign-submissions` - Get submissions (Admin)
- `POST /api/campaign-submissions` - Submit form

### Contacts API (5 endpoints)
- `GET /api/contacts` - Get contacts (Admin)
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts/:id` - Get contact (Admin)
- `PUT /api/contacts/:id` - Update contact (Admin)
- `DELETE /api/contacts/:id` - Delete contact (Admin)
- `GET /api/contacts/settings` - Get settings (Admin)
- `PUT /api/contacts/settings` - Update settings (Admin)
- `GET /api/contacts/stats` - Get statistics (Admin)

### Consultations API (4 endpoints)
- `GET /api/consultations` - Get consultations (Admin)
- `POST /api/consultations` - Book consultation
- `GET /api/consultations/stats` - Get statistics (Admin)
- `GET /api/consultations/:id` - Get consultation (Admin)
- `PUT /api/consultations/:id` - Update consultation (Admin)
- `DELETE /api/consultations/:id` - Delete consultation (Admin)

### Projects API (3 endpoints)
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (Admin)
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/slug/:slug` - Get project by slug

### Team API (2 endpoints)
- `GET /api/team` - Get all team members
- `POST /api/team` - Create team member (Admin)
- `GET /api/team/:id` - Get team member

### Testimonials API (5 endpoints)
- `GET /api/testimonials` - Get testimonials
- `POST /api/testimonials` - Create testimonial (Admin)
- `GET /api/testimonials/:id` - Get testimonial
- `PUT /api/testimonials/:id` - Update testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

### Jobs API (4 endpoints)
- `GET /api/jobs` - Get job postings
- `POST /api/jobs` - Create job posting (Admin)
- `GET /api/jobs/:id` - Get job posting
- `POST /api/jobs/:id/apply` - Submit application
- `POST /api/jobs/:id/apply/upload-cv` - Upload CV
- `GET /api/jobs/applications` - Get applications (Admin)

### Homepage/CMS API (9 endpoints)
- `GET /api/homepage/hero` - Get hero section
- `PUT /api/homepage/hero` - Update hero (Admin)
- `GET /api/homepage/about` - Get about section
- `PUT /api/homepage/about` - Update about (Admin)
- `GET /api/homepage/services` - Get services
- `POST /api/homepage/services` - Create service (Admin)
- `PUT /api/homepage/services/:id` - Update service (Admin)
- `DELETE /api/homepage/services/:id` - Delete service (Admin)
- `GET /api/homepage/statistics` - Get statistics
- `POST /api/homepage/statistics` - Create statistic (Admin)
- `PUT /api/homepage/statistics/:id` - Update statistic (Admin)
- `DELETE /api/homepage/statistics/:id` - Delete statistic (Admin)
- `GET /api/homepage/sections` - Get sections
- `POST /api/homepage/sections` - Create section (Admin)
- `PUT /api/homepage/sections/:id` - Update section (Admin)
- `DELETE /api/homepage/sections/:id` - Delete section (Admin)

### Settings API (2 endpoints)
- `GET /api/settings` - Get application settings
- `PUT /api/settings` - Update settings (Admin)

### Site Management API (4 endpoints)
- `GET /api/site/navigation` - Get navigation menu
- `POST /api/site/navigation` - Create nav item (Admin)
- `PUT /api/site/navigation/:id` - Update nav item (Admin)
- `DELETE /api/site/navigation/:id` - Delete nav item (Admin)
- `GET /api/site/settings` - Get site settings
- `PUT /api/site/settings` - Update site settings (Admin)

### Services API (1 endpoint)
- `GET /api/services` - Get all services

### Health Check API (1 endpoint)
- `GET /api/health/database` - Check database health

### File Upload API (2 endpoints)
- `POST /api/upload` - Upload file (Admin)
- `POST /api/upload/delete` - Delete file (Admin)

---

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": { ... }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Database connection issue |

### Common Errors

#### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": {
    "name": "Name is required",
    "email": "Invalid email format"
  }
}
```

#### Unauthorized (401)
```json
{
  "error": "Unauthorized"
}
```

#### Not Found (404)
```json
{
  "error": "Resource not found"
}
```

#### Conflict (409)
```json
{
  "error": "A resource with this identifier already exists"
}
```

---

## CORS Configuration

All API endpoints support CORS:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Max-Age: 86400
```

---

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| Public endpoints | 100 req/min |
| Authenticated endpoints | 1000 req/min |
| File uploads | 10 uploads/min |

---

## Quick Reference Cards

### Authentication Badge
```
🔒 = Admin Authentication Required
🌐 = Public Access
```

### HTTP Methods
```
GET    = Retrieve data
POST   = Create resource
PUT    = Update resource
DELETE = Remove resource
```

---

## Documentation Files

All documentation files are located in `/docs/api/`:

1. [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) - This file
2. [BLOG-POSTS-API.md](./BLOG-POSTS-API.md) - Blog management
3. [CAMPAIGNS-API.md](./CAMPAIGNS-API.md) - Marketing campaigns
4. [CAMPAIGN-SUBMISSIONS-API.md](./CAMPAIGN-SUBMISSIONS-API.md) - Campaign forms
5. [CONSULTATIONS-API.md](./CONSULTATIONS-API.md) - Consultation bookings
6. [CONTACTS-API.md](./CONTACTS-API.md) - Contact forms
7. [HEALTH-API.md](./HEALTH-API.md) - Health checks
8. [HOMEPAGE-CMS-API.md](./HOMEPAGE-CMS-API.md) - Homepage content
9. [JOBS-API.md](./JOBS-API.md) - Job postings
10. [PROJECTS-API.md](./PROJECTS-API.md) - Portfolio projects
11. [README.md](./README.md) - Quick reference
12. [SERVICES-API.md](./SERVICES-API.md) - Services
13. [SETTINGS-API.md](./SETTINGS-API.md) - App settings
14. [SITE-API.md](./SITE-API.md) - Navigation & site settings
15. [TEAM-API.md](./TEAM-API.md) - Team members
16. [TESTIMONIALS-API.md](./TESTIMONIALS-API.md) - Testimonials
17. [UPLOAD-API.md](./UPLOAD-API.md) - File uploads

---

## Support

For API issues or questions:
- GitHub: [zoolyum-web-2.0](https://github.com/SakibBhai/zoolyum-web-2.0)
- Email: contact@zoolyum.com

---

**Last Updated:** March 24, 2026
