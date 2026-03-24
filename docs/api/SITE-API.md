# Site Management API

Manage navigation menu and site-wide settings.

---

## Navigation Menu

### GET /api/site/navigation

Get all navigation menu items.

**Authentication:** Public

```json
[
  {
    "id": "xxx-xxx-xxx",
    "title": "Home",
    "url": "/",
    "parentId": null,
    "orderIndex": 1,
    "isActive": true,
    "children": []
  },
  {
    "id": "xxx-xxx-xxx",
    "title": "Services",
    "url": "/services",
    "parentId": null,
    "orderIndex": 2,
    "isActive": true,
    "children": [
      {
        "id": "xxx-xxx-xxx",
        "title": "Brand Strategy",
        "url": "/services/brand-strategy",
        "parentId": "xxx-xxx-xxx",
        "orderIndex": 1,
        "isActive": true
      }
    ]
  }
]
```

### POST /api/site/navigation

Create new navigation item (Admin only).

```json
{
  "title": "About",
  "url": "/about",
  "parentId": null,
  "orderIndex": 3,
  "isActive": true
}
```

### PUT /api/site/navigation/:id

Update navigation item (Admin only).

### DELETE /api/site/navigation/:id

Delete navigation item (Admin only).

---

## Site Settings

### GET /api/site/settings

Get site-wide settings.

**Authentication:** Public

```json
{
  "siteName": "Zoolyum",
  "tagline": "Brand Strategy & Digital Innovation",
  "description": "Transforming brands through strategic thinking...",
  "keywords": ["brand", "strategy", "digital", "innovation"],
  "logoUrl": "/zoolyum-logo.png",
  "faviconUrl": "/favicon.ico",
  "ogImage": "/og-image.jpg",
  "twitterHandle": "@zoolyum",
  "contactEmail": "contact@zoolyum.com",
  "contactPhone": "+8801601000950"
}
```

### PUT /api/site/settings

Update site settings (Admin only).

```json
{
  "siteName": "Zoolyum",
  "tagline": "New Tagline",
  "description": "Updated description"
}
```

---

## Data Models

### NavigationMenuItem

```typescript
interface NavigationMenuItem {
  id: string;                  // UUID
  title: string;               // Menu title
  url?: string;                // Destination URL
  parentId?: string;            // Parent menu item UUID
  orderIndex: number;          // Display order
  isActive: boolean;           // Active status
  children?: NavigationMenuItem[]; // Child items
}
```

### SiteSettingsConfig

```typescript
interface SiteSettingsConfig {
  siteName?: string;
  tagline?: string;
  description?: string;
  keywords?: string[];
  logoUrl?: string;
  faviconUrl?: string;
  ogImage?: string;
  twitterHandle?: string;
  contactEmail?: string;
  contactPhone?: string;
}
```

---

**Next:** [Services API](./SERVICES-API.md)
