# Projects API

Manage portfolio projects.

---

## GET /api/projects

Get all projects with optional filtering.

### Authentication
- **Public** - No authentication required

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status |
| `type` | string | No | Filter by project type |
| `limit` | number | No | Limit results |

### Response

```json
[
  {
    "id": "xxx-xxx-xxx",
    "name": "E-commerce Platform Redesign",
    "description": "Complete redesign of e-commerce platform",
    "imageUrl": "https://example.com/project.jpg",
    "heroImageUrl": "https://example.com/hero.jpg",
    "type": "Web Development",
    "status": "completed",
    "priority": "high",
    "progress": 100,
    "startDate": "2024-01-01",
    "endDate": "2024-03-31",
    "budget": 50000,
    "estimatedBudget": 45000,
    "actualBudget": 48000,
    "manager": "Jane Smith",
    "clientId": "xxx-xxx-xxx",
    "createdBy": "xxx-xxx-xxx",
    "tasksTotal": 50,
    "tasksCompleted": 50,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-03-31T00:00:00.000Z"
  }
]
```

### Example

```bash
# Get all projects
curl https://zoolyum-web-2-0.vercel.app/api/projects

# Get completed projects
curl https://zoolyum-web-2-0.vercel.app/api/projects?status=completed

# Get web development projects
curl https://zoolyum-web-2-0.vercel.app/api/projects?type=Web%20Development

# Get limited results
curl https://zoolyum-web-2-0.vercel.app/api/projects?limit=10
```

---

## POST /api/projects

Create a new project.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "title": "New E-commerce Platform",
  "name": "E-commerce Platform",
  "slug": "ecommerce-platform",
  "description": "Build modern e-commerce solution",
  "category": "Web Development",
  "type": "Web Development",
  "status": "planning",
  "priority": "high",
  "startDate": "2024-04-01",
  "endDate": "2024-06-30",
  "budget": 50000,
  "estimatedBudget": 45000,
  "actualBudget": 0,
  "progress": 0,
  "manager": "Jane Smith",
  "clientId": "xxx-xxx-xxx",
  "createdBy": "xxx-xxx-xxx",
  "tasksTotal": 50,
  "tasksCompleted": 0
}
```

### Required Fields

- `title` or `name` (string) - Project name

### Optional Fields

- `slug` (string) - URL slug
- `description` (string) - Project description
- `category` or `type` (string) - Project type (default: `General`)
- `status` (string) - Project status (default: `planning`)
- `priority` (string) - Priority level (default: `medium`)
- `startDate` (string) - ISO 8601 date
- `endDate` (string) - ISO 8601 date
- `budget` (number) - Project budget
- `estimatedBudget` (number) - Estimated cost
- `actualBudget` (number) - Actual cost
- `progress` (number) - Progress percentage (0-100)
- `manager` (string) - Project manager name
- `clientId` (string) - Client UUID
- `createdBy` (string) - Creator UUID
- `tasksTotal` (number) - Total tasks
- `tasksCompleted` (number) - Completed tasks

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "name": "E-commerce Platform",
  "description": "Build modern e-commerce solution",
  "status": "planning",
  "progress": 0,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Example

```bash
curl -X POST https://zoolyum-web-2-0.vercel.app/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "E-commerce Platform",
    "description": "Modern e-commerce solution",
    "status": "planning",
    "priority": "high",
    "budget": 50000
  }'
```

---

## GET /api/projects/:id

Get a specific project by ID or slug.

### Authentication
- **Public** - No authentication required

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Project ID |

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "name": "E-commerce Platform",
  "description": "Complete project details",
  "imageUrl": "https://example.com/image.jpg",
  "status": "completed",
  "progress": 100,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## GET /api/projects/slug/:slug

Get a project by slug (public endpoint).

### Authentication
- **Public** - No authentication required

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Project slug |

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "name": "E-commerce Platform",
  "slug": "ecommerce-platform",
  "description": "Complete project details"
}
```

---

## Data Models

### Project

```typescript
interface Project {
  id: string;                  // UUID
  name: string;                // Project name
  description?: string;        // Project description
  imageUrl?: string;           // Project image
  heroImageUrl?: string;       // Hero image
  type: string;                // Project type
  status: string;              // planning | in_progress | completed | on_hold
  priority: string;            // low | medium | high
  progress: number;            // 0-100
  startDate?: string;          // ISO 8601 date
  endDate?: string;            // ISO 8601 date
  budget: number;              // Project budget
  estimatedBudget: number;     // Estimated cost
  actualBudget: number;        // Actual cost
  manager?: string;            // Manager name
  clientId?: string;           // Client UUID
  createdBy?: string;          // Creator UUID (team member)
  tasksTotal: number;          // Total tasks
  tasksCompleted: number;      // Completed tasks
  createdAt: string;           // ISO 8601 timestamp
  updatedAt: string;           // ISO 8601 timestamp
}
```

---

**Next:** [Team API](./TEAM-API.md)
