# Team API

Manage team member profiles.

---

## GET /api/team

Get all team members.

### Authentication
- **Public** - No authentication required

### Response

```json
[
  {
    "id": "xxx-xxx-xxx",
    "name": "Sakib Chowdhury",
    "role": "Founder & Creative Director",
    "department": "Leadership",
    "employeeId": "EMP001",
    "bio": "Creative visionary with 10+ years experience",
    "email": "sakib@zoolyum.com",
    "avatar": "https://example.com/avatar.jpg",
    "phone": "+880171234567",
    "skills": ["Branding", "Design", "Strategy"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Example

```bash
curl https://zoolyum-web-2-0.vercel.app/api/team
```

---

## POST /api/team

Create a new team member.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "name": "John Doe",
  "role": "Senior Developer",
  "bio": "Full-stack developer with 5 years experience",
  "image": "https://example.com/avatar.jpg",
  "social": {
    "twitter": "https://twitter.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  }
}
```

### Required Fields

- `name` (string) - Team member name

### Optional Fields

- `role` (string) - Job title
- `bio` (string) - Biography
- `image` (string) - Avatar URL
- `social` (object) - Social media links
  - `twitter` (string)
  - `linkedin` (string)
  - `github` (string)

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "name": "John Doe",
  "role": "Senior Developer",
  "bio": "Full-stack developer with 5 years experience",
  "email": "john@zoolyum.com",
  "avatar": "https://example.com/avatar.jpg",
  "department": "Development",
  "employeeId": "EMP002",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/team \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "role": "Senior Developer",
    "bio": "Full-stack developer"
  }'
```

---

## GET /api/team/:id

Get a specific team member.

### Authentication
- **Public** - No authentication required

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Team member UUID |

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "name": "Sakib Chowdhury",
  "role": "Founder & Creative Director",
  "bio": "Creative visionary with 10+ years experience",
  "email": "sakib@zoolyum.com",
  "avatar": "https://example.com/avatar.jpg",
  "department": "Leadership",
  "employeeId": "EMP001",
  "phone": "+880171234567",
  "skills": ["Branding", "Design"],
  "isActive": true
}
```

---

## Data Models

### TeamMember

```typescript
interface TeamMember {
  id: string;              // UUID
  name: string;            // Full name
  email: string;           // Email (unique)
  role: string;            // Job title
  department: string;      // Department name
  employeeId: string;      // Employee ID (unique)
  bio: string;             // Biography
  avatar: string;          // Avatar URL
  phone?: string;          // Phone number
  skills: string[];        // Skills array
  isActive: boolean;       // Active status
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

---

**Next:** [Testimonials API](./TESTIMONIALS-API.md)
