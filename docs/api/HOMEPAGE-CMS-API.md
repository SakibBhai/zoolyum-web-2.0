# Homepage/CMS API

Manage homepage content sections dynamically.

---

## Hero Section

### GET /api/homepage/hero

Get hero section content.

**Authentication:** Public

```json
{
  "id": "xxx-xxx-xxx",
  "title": "Z o o l y u m",
  "subtitle": "Brand Strategy & Digital Innovation",
  "description": "We transform brands through strategic thinking...",
  "primaryCta": "Start Your Project",
  "secondaryCta": "View Our Work",
  "backgroundImage": "https://example.com/hero-bg.jpg",
  "isActive": true
}
```

### PUT /api/homepage/hero

Update hero section (Admin only).

```json
{
  "title": "New Title",
  "subtitle": "New Subtitle",
  "primaryCta": { "text": "Get Started", "url": "/contact" }
}
```

---

## About Section

### GET /api/homepage/about

Get about section content.

**Authentication:** Public

```json
{
  "title": "About Zoolyum",
  "subtitle": "Strategic Brand Alchemy for Growth",
  "description": "Full about content...",
  "image": "https://example.com/about.jpg",
  "ctaText": "Learn More About Us",
  "ctaUrl": "/about"
}
```

### PUT /api/homepage/about

Update about section (Admin only).

---

## Services Section

### GET /api/homepage/services

Get all services for homepage.

**Authentication:** Public

```json
[
  {
    "id": "xxx-xxx-xxx",
    "title": "Brand Strategy",
    "description": "Strategic brand positioning",
    "icon": "target",
    "order": 1,
    "isActive": true
  }
]
```

### POST /api/homepage/services

Create new service item (Admin only).

### PUT /api/homepage/services/:id

Update service item (Admin only).

### DELETE /api/homepage/services/:id

Delete service item (Admin only).

---

## Statistics Section

### GET /api/homepage/statistics

Get statistics items.

**Authentication:** Public

```json
[
  {
    "id": "xxx-xxx-xxx",
    "label": "Projects Completed",
    "value": "50",
    "suffix": "+",
    "order": 1
  }
]
```

### POST /api/homepage/statistics

Create statistics item (Admin only).

### PUT /api/homepage/statistics/:id

Update statistics item (Admin only).

### DELETE /api/homepage/statistics/:id

Delete statistics item (Admin only).

---

## Dynamic Sections

### GET /api/homepage/sections

Get all homepage sections.

**Authentication:** Public

```json
[
  {
    "id": "xxx-xxx-xxx",
    "sectionType": "testimonials",
    "title": "What Our Clients Say",
    "subtitle": "Trusted by industry leaders",
    "description": "Client testimonials",
    "order": 1,
    "isActive": true
  }
]
```

### POST /api/homepage/sections

Create new section (Admin only).

### PUT /api/homepage/sections/:id

Update section (Admin only).

### DELETE /api/homepage/sections/:id

Delete section (Admin only).

---

## Data Models

### HomepageHero

```typescript
interface HomepageHero {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryCta?: string | { text: string; url: string };
  secondaryCta?: string | { text: string; url: string };
  backgroundImage?: string;
  isActive: boolean;
}
```

### HomepageAbout

```typescript
interface HomepageAbout {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  isActive: boolean;
}
```

### HomepageServices

```typescript
interface HomepageService {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}
```

### HomepageStatistics

```typescript
interface HomepageStatistics {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  order: number;
  isActive: boolean;
}
```

### HomepageSection

```typescript
interface HomepageSection {
  id: string;
  sectionType: string;
  title: string;
  subtitle?: string;
  description?: string;
  order: number;
  isActive: boolean;
}
```

---

**Next:** [Jobs API](./JOBS-API.md)
