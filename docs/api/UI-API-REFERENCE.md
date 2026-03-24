# UI Pages & API Endpoints Reference

Complete mapping of all frontend pages to their backend API endpoints.

---

## 📋 Table of Contents

- [Public Pages](#public-pages)
- [Admin Dashboard](#admin-dashboard)
- [API Endpoint Summary](#api-endpoint-summary)

---

## Public Pages

### 🏠 Homepage

**Route:** `/`

**API Endpoints:**
```
GET  /api/homepage/hero          → Hero section
GET  /api/homepage/about         → About section
GET  /api/homepage/services      → Services section
GET  /api/homepage/statistics    → Statistics
GET  /api/homepage/sections      → All sections
GET  /api/projects               → Featured projects
GET  /api/testimonials           → Client testimonials
GET  /api/team                   → Team members
GET  /api/services               → Services list
```

---

### 📄 About Page

**Route:** `/about`

**API Endpoints:**
```
GET  /api/homepage/about         → About section content
GET  /api/team                   → Team members
GET  /api/testimonials           → Featured testimonials
```

---

### 💼 Services Page

**Route:** `/services`

**API Endpoints:**
```
GET  /api/services               → All services
GET  /api/homepage/services      → Homepage services
```

---

### 🎨 Portfolio Page

**Route:** `/portfolio`

**API Endpoints:**
```
GET  /api/projects               → All projects
GET  /api/projects/slug/:slug    → Project by slug
```

---

### 👥 Team Page

**Route:** `/team`

**API Endpoints:**
```
GET  /api/team                   → All team members
GET  /api/team/:id               → Team member by ID
```

---

### ⭐ Testimonials Page

**Route:** `/testimonials`

**API Endpoints:**
```
GET  /api/testimonials           → All testimonials
GET  /api/testimonials?featured=true  → Featured only
GET  /api/testimonials?approved=true  → Approved only
```

---

### 📝 Blog Page

**Route:** `/blog`

**API Endpoints:**
```
GET  /api/blog-posts             → All posts
GET  /api/blog-posts?published=true  → Published only
GET  /api/blog-posts/:id         → Post by ID/slug
```

---

### 🎯 Campaigns Page

**Route:** `/campaigns`

**API Endpoints:**
```
GET  /api/campaigns              → All campaigns
GET  /api/campaigns?status=PUBLISHED  → Published only
GET  /api/campaigns/slug/:slug    → Campaign by slug
GET  /api/campaigns/:id          → Campaign by ID
```

---

### 💼 Careers Page

**Route:** `/careers`

**API Endpoints:**
```
GET  /api/jobs                   → All job postings
GET  /api/jobs?published=true    → Published jobs
GET  /api/jobs/:id               → Job details
POST  /api/jobs/:id/apply        → Submit application
POST  /api/jobs/:id/apply/upload-cv  → Upload CV
GET  /api/jobs/applications      → All applications (Admin)
```

---

### 📞 Contact Page

**Route:** `/contact`

**API Endpoints:**
```
GET  /api/contacts/settings       → Contact settings
POST  /api/contacts              → Submit contact form
GET  /api/contacts/stats         → Contact statistics (Admin)
```

---

### 🗓️ Consultation Booking

**Modal:** Available on Contact page

**API Endpoints:**
```
GET  /api/consultations           → All consultations (Admin)
POST  /api/consultations           → Book consultation
GET  /api/consultations/stats     → Statistics (Admin)
```

---

## Admin Dashboard

### 🔐 Admin Login

**Route:** `/admin/login`

**API Endpoints:**
```
Authentication via Stack Auth
```

---

### 📊 Admin Dashboard

**Route:** `/admin`

**API Endpoints:**
```
GET  /api/contacts/stats         → Contact statistics
GET  /api/consultations/stats     → Consultation statistics
GET  /api/health/database         → Database health
```

---

### 📝 Blog Management

**Routes:**
- `/admin/blog-posts` - List all posts
- `/admin/blog-posts/new` - Create new post
- `/admin/blog-posts/[id]` - View post
- `/admin/blog-posts/[id]/edit` - Edit post
- `/admin/blog-posts/preview` - Preview

**API Endpoints:**
```
GET    /api/blog-posts                    → List all posts
POST   /api/blog-posts                    → Create post
GET    /api/blog-posts/:id                → Get post
PUT    /api/blog-posts/:id                → Update post
DELETE /api/blog-posts/:id                → Delete post
```

---

### 🎯 Campaign Management

**Routes:**
- `/admin/campaigns` - List all campaigns
- `/admin/campaigns/new` - Create new campaign
- `/admin/campaigns/[id]` - View campaign
- `/admin/campaigns/[id]/edit` - Edit campaign
- `/admin/campaigns/[id]/analytics` - View analytics

**API Endpoints:**
```
GET    /api/campaigns                     → List all
POST   /api/campaigns                     → Create campaign
GET    /api/campaigns/:id                 → Get campaign
PUT    /api/campaigns/:id                 → Update campaign
DELETE /api/campaigns/:id                 → Delete campaign
GET    /api/campaigns/slug/:slug           → Public campaign
GET    /api/campaign-submissions           → Get submissions
```

---

### 📨 Contact Submissions

**Route:** `/admin/contacts`

**API Endpoints:**
```
GET    /api/contacts                      → List all contacts
GET    /api/contacts/:id                  → Get contact
PUT    /api/contacts/:id                  → Update contact
DELETE /api/contacts/:id                  → Delete contact
GET    /api/contacts/settings             → Get settings
PUT    /api/contacts/settings             → Update settings
GET    /api/contacts/stats                → Statistics
```

---

### 🗓️ Consultation Bookings

**Route:** `/admin/dashboard` (Consultations section)

**API Endpoints:**
```
GET    /api/consultations                 → List all
GET    /api/consultations/:id             → Get consultation
PUT    /api/consultations/:id             → Update consultation
DELETE /api/consultations/:id             → Delete consultation
GET    /api/consultations/stats           → Statistics
```

---

### 💼 Projects Portfolio

**Routes:**
- `/admin/projects` - List all projects
- `/admin/projects/new` - Create new project
- `/admin/projects/[id]` - View project
- `/admin/projects/[id]/edit` - Edit project

**API Endpoints:**
```
GET    /api/projects                      → List all
POST   /api/projects                      → Create project
GET    /api/projects/:id                  → Get project
GET    /api/projects/slug/:slug           → By slug
```

---

### 👥 Team Management

**Routes:**
- `/admin/team` - List all team members
- `/admin/team/new` - Add new member
- `/admin/team/[id]` - View member
- `/admin/team/[id]/edit` - Edit member

**API Endpoints:**
```
GET    /api/team                         → List all
POST   /api/team                         → Create member
GET    /api/team/:id                      → Get member
```

---

### ⭐ Testimonials Management

**Routes:**
- `/admin/testimonials` - List all testimonials
- `/admin/testimonials/new` - Add new testimonial
- `/admin/testimonials/[id]` - View testimonial
- `/admin/testimonials/[id]/edit` - Edit testimonial

**API Endpoints:**
```
GET    /api/testimonials                  → List all
POST   /api/testimonials                  → Create testimonial
GET    /api/testimonials/:id              → Get testimonial
PUT    /api/testimonials/:id              → Update testimonial
DELETE /api/testimonials/:id              → Delete testimonial
```

---

### 💼 Job Postings

**Routes:**
- `/admin/jobs` - List all jobs
- `/admin/jobs/new` - Create new job posting
- `/admin/jobs/[id]` - View job posting
- `/admin/jobs/[id]/edit` - Edit job posting
- `/admin/jobs/applications` - View applications

**API Endpoints:**
```
GET    /api/jobs                         → List all jobs
POST   /api/jobs                         → Create job
GET    /api/jobs/:id                      → Get job
GET    /api/jobs/applications             → List applications
POST   /api/jobs/:id/apply               → Submit application
POST   /api/jobs/:id/apply/upload-cv      → Upload CV
```

---

### 🎨 Services Management

**Routes:**
- `/admin/services` - List all services
- `/admin/services/new` - Add new service
- `/admin/services/[id]` - View service
- `/admin/services/[id]/edit` - Edit service

**API Endpoints:**
```
GET    /api/services                      → List all services
```

---

### 🏠 Homepage CMS

**Route:** `/admin/cms`

**API Endpoints:**
```
# Hero Section
GET    /api/homepage/hero                 → Get hero
PUT    /api/homepage/hero                 → Update hero

# About Section
GET    /api/homepage/about                → Get about
PUT    /api/homepage/about                → Update about

# Services
GET    /api/homepage/services             → Get services
POST   /api/homepage/services             → Create service
PUT    /api/homepage/services/:id         → Update service
DELETE /api/homepage/services/:id         → Delete service

# Statistics
GET    /api/homepage/statistics          → Get stats
POST   /api/homepage/statistics          → Create stat
PUT    /api/homepage/statistics/:id      → Update stat
DELETE /api/homepage/statistics/:id      → Delete stat

# Sections
GET    /api/homepage/sections            → Get sections
POST   /api/homepage/sections            → Create section
PUT    /api/homepage/sections/:id         → Update section
DELETE /api/homepage/sections/:id         → Delete section
```

---

### ⚙️ Settings

**Route:** `/admin/settings`

**API Endpoints:**
```
GET    /api/settings                      → Get settings
PUT    /api/settings                      → Update settings

# Site Settings
GET    /api/site/settings                 → Get site settings
PUT    /api/site/settings                 → Update site settings

# Navigation
GET    /api/site/navigation              → Get navigation
POST   /api/site/navigation              → Create nav item
PUT    /api/site/navigation/:id          → Update nav item
DELETE /api/site/navigation/:id          → Delete nav item
```

---

### 📤 File Upload

**Used throughout admin for image uploads**

**API Endpoints:**
```
POST   /api/upload                        → Upload file
POST   /api/upload/delete                 → Delete file
```

---

## API Endpoint Summary

### 📊 Statistics

| Category | Total Endpoints |
|----------|-----------------|
| **Blog Posts** | 5 |
| **Campaigns** | 5 |
| **Campaign Submissions** | 2 |
| **Contacts** | 5 |
| **Consultations** | 4 |
| **Projects** | 3 |
| **Services** | 1 |
| **Team** | 2 |
| **Testimonials** | 5 |
| **Jobs** | 4 |
| **Homepage/CMS** | 9 |
| **Settings** | 2 |
| **Site** | 4 |
| **Upload** | 2 |
| **Health** | 1 |
| **TOTAL** | **41** |

---

## Quick Reference Cards

### 🌐 Public APIs (No Authentication)
```
GET  /api/blog-posts
GET  /api/blog-posts/:id
GET  /api/campaigns
GET  /api/campaigns/slug/:slug
GET  /api/campaigns/:id
GET  /api/projects
GET  /api/projects/slug/:slug
GET  /api/services
GET  /api/team
GET  /api/testimonials
GET  /api/jobs
GET  /api/contacts
POST /api/contacts
GET  /api/health/database
POST /api/consultations
POST /api/jobs/:id/apply
POST /api/jobs/:id/apply/upload-cv
```

### 🔒 Protected APIs (Admin Only - Stack Auth)
```
POST /api/blog-posts
PUT  /api/blog-posts/:id
DELETE /api/blog-posts/:id

POST /api/campaigns
PUT  /api/campaigns/:id
DELETE /api/campaigns/:id

POST /api/projects
GET  /api/campaign-submissions

GET  /api/contacts
PUT  /api/contacts/:id
DELETE /api/contacts/:id
PUT  /api/contacts/settings
GET  /api/contacts/stats

GET  /api/consultations
PUT  /api/consultations/:id
DELETE /api/consultations/:id
GET  /api/consultations/stats

POST /api/testimonials
PUT  /api/testimonials/:id
DELETE /api/testimonials/:id

POST /api/jobs
GET  /api/jobs/applications

POST /api/team

PUT  /api/homepage/hero
PUT  /api/homepage/about
POST /api/homepage/services
PUT  /api/homepage/services/:id
DELETE /api/homepage/services/:id
POST /api/homepage/statistics
PUT  /api/homepage/statistics/:id
DELETE /api/homepage/statistics/:id
POST /api/homepage/sections
PUT  /api/homepage/sections/:id
DELETE /api/homepage/sections/:id

PUT  /api/settings
PUT  /api/site/settings
POST /api/site/navigation
PUT  /api/site/navigation/:id
DELETE /api/site/navigation/:id

POST /api/upload
POST /api/upload/delete
```

---

## Page → API Mapping Diagram

```
PUBLIC PAGES                    API ENDPOINTS
─────────────────────────────────────────────────────
/ (Home)               ───────→  GET /api/homepage/hero
                             ├──→  GET /api/homepage/about
                             ├──→  GET /api/homepage/services
                             ├──→  GET /api/homepage/statistics
                             ├──→  GET /api/projects (Featured)
                             ├──→  GET /api/team
                             └──→  GET /api/testimonials

/about                ───────→  GET /api/homepage/about
                             ├──→  GET /api/team
                             └──→  GET /api/testimonials

/services              ───────→  GET /api/services
                             └──→  GET /api/homepage/services

/portfolio             ───────→  GET /api/projects
                             └──→  GET /api/projects/slug/:slug

/team                  ───────→  GET /api/team
                             └──→  GET /api/team/:id

/testimonials          ───────→  GET /api/testimonials

/blog                  ───────→  GET /api/blog-posts
                             └──→  GET /api/blog-posts/:id

/campaigns             ───────→  GET /api/campaigns
                             └──→  GET /api/campaigns/slug/:slug

/careers               ───────→  GET /api/jobs
                             └──→  POST /api/jobs/:id/apply

/contact               ───────→  GET /api/contacts/settings
                             └──→  POST /api/contacts

ADMIN PAGES                     API ENDPOINTS
─────────────────────────────────────────────────────
/admin/login            ───────→  Stack Auth

/admin/blog-posts      ───────→  GET /api/blog-posts
                             ├──→  POST /api/blog-posts
                             ├──→  PUT /api/blog-posts/:id
                             └──→  DELETE /api/blog-posts/:id

/admin/campaigns       ───────→  GET /api/campaigns
                             ├──→  POST /api/campaigns
                             ├──→  PUT /api/campaigns/:id
                             ├──→  DELETE /api/campaigns/:id
                             └──→  GET /api/campaign-submissions

/admin/contacts        ───────→  GET /api/contacts
                             ├──→  PUT /api/contacts/:id
                             ├──→  DELETE /api/contacts/:id
                             ├──→  GET /api/contacts/settings
                             ├──→  PUT /api/contacts/settings
                             └──→  GET /api/contacts/stats

/admin/projects        ───────→  GET /api/projects
                             └──→  POST /api/projects

/admin/team            ───────→  GET /api/team
                             └──→  POST /api/team

/admin/testimonials    ───────→  GET /api/testimonials
                             ├──→  POST /api/testimonials
                             ├──→  PUT /api/testimonials/:id
                             └──→  DELETE /api/testimonials/:id

/admin/jobs            ───────→  GET /api/jobs
                             ├──→  POST /api/jobs
                             └──  GET /api/jobs/applications

/admin/cms             ───────→  GET /api/homepage/hero
                             ├──→  PUT /api/homepage/hero
                             ├──→  GET /api/homepage/about
                             ├──→  PUT /api/homepage/about
                             ├──→  GET /api/homepage/services
                             ├──→  POST /api/homepage/services
                             ├──→  PUT /api/homepage/services/:id
                             ├──→  DELETE /api/homepage/services/:id
                             └──→  [More CMS endpoints...]

/admin/settings        ───────→  GET /api/settings
                             ├──→  PUT /api/settings
                             ├──→  GET /api/site/settings
                             ├──→  PUT /api/site/settings
                             ├──→  GET /api/site/navigation
                             ├──→  POST /api/site/navigation
                             ├──→  PUT /api/site/navigation/:id
                             └──→  DELETE /api/site/navigation/:id
```

---

## 📱 Mobile App Integration

If you're building a mobile app or integrating with other services, use these primary endpoints:

### Core Content APIs
```
GET  /api/blog-posts             → Blog content
GET  /api/projects              → Portfolio
GET  /api/team                  → Team info
GET  /api/testimonials           → Reviews
GET  /api/services              → Services
GET  /api/jobs                  → Job openings
```

### Form Submission APIs
```
POST /api/contacts              → Contact form
POST /api/consultations          → Book consultation
POST /api/jobs/:id/apply        → Job application
POST /api/campaign-submissions  → Campaign forms
```

---

## 🚀 Quick Start Examples

### Fetch All Blog Posts
```typescript
const response = await fetch('https://zoolyum-web-2-0.vercel.app/api/blog-posts?published=true');
const posts = await response.json();
```

### Get Team Members
```typescript
const response = await fetch('https://zoolyum-web-2-0.vercel.app/api/team');
const team = await response.json();
```

### Submit Contact Form
```typescript
const response = await fetch('https://zoolyum-web-2-0.vercel.app/api/contacts', {
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

### Get All Projects
```typescript
const response = await fetch('https://zoolyum-web-2-0.vercel.app/api/projects');
const projects = await response.json();
```

---

**📁 Location:** [`docs/api/UI-API-REFERENCE.md`](c:\Users\USER\zoolyum-web-2.0\docs\api\UI-API-REFERENCE.md)

**🔗 Related Documentation:**
- [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) - Detailed API reference
- [README.md](./README.md) - Quick start guide

---

**Last Updated:** March 24, 2026
