# Jobs API

Manage job postings and applications.

---

## GET /api/jobs

Get all job postings.

### Authentication
- **Public** - No authentication required

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `published` | boolean | No | Filter by published status |
| `department` | string | No | Filter by department |
| `type` | string | No | Filter by job type |
| `active` | boolean | No | Filter by active status |

### Response

```json
[
  {
    "id": "xxx-xxx-xxx",
    "title": "Senior Full Stack Developer",
    "description": "We're looking for an experienced developer...",
    "requirements": "5+ years experience with React, Node.js...",
    "responsibilities": "Build and maintain web applications...",
    "location": "Remote / Dhaka",
    "type": "full-time",
    "salaryMin": 80000,
    "salaryMax": 120000,
    "department": "Engineering",
    "experienceMin": 5,
    "published": true,
    "allowCvSubmission": true,
    "isActive": true,
    "postedDate": "2024-01-15T10:30:00.000Z",
    "closingDate": "2024-03-15T23:59:59.000Z"
  }
]
```

### Example

```bash
# Get all published jobs
curl https://zoolyum-web-2-0.vercel.app/api/jobs?published=true

# Get full-time remote jobs
curl https://zoolyum-web-2-0.vercel.app/api/jobs?type=full-time&location=Remote
```

---

## POST /api/jobs

Create a new job posting.

### Authentication
- **Required** - Admin only (Stack Auth)

### Request Body

```json
{
  "title": "Senior Full Stack Developer",
  "description": "We're looking for an experienced developer...",
  "requirements": "5+ years experience with React, Node.js...",
  "responsibilities": "Build and maintain web applications...",
  "location": "Remote / Dhaka",
  "type": "full-time",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "department": "Engineering",
  "experienceMin": 5,
  "experienceMax": 10,
  "published": true,
  "allowCvSubmission": true,
  "isActive": true,
  "applicationDeadline": "2024-03-15T23:59:59.000Z"
}
```

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "title": "Senior Full Stack Developer",
  "published": true,
  "isActive": true,
  "postedDate": "2024-01-15T10:30:00.000Z"
}
```

---

## GET /api/jobs/:id

Get a specific job posting.

### Authentication
- **Public** - No authentication required

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Job UUID |

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "title": "Senior Full Stack Developer",
  "description": "Full job description...",
  "requirements": "Requirements...",
  "responsibilities": "Responsibilities...",
  "location": "Remote",
  "type": "full-time",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "published": true,
  "postedDate": "2024-01-15T10:30:00.000Z"
}
```

---

## POST /api/jobs/:id/apply

Submit a job application.

### Authentication
- **Public** - No authentication required

### Request Body (multipart/form-data)

```
name: "John Doe"
email: "john@example.com"
phone: "+880171234567"
resume: [file]
coverLetter: "I'm excited to apply..."
```

### Response

```json
{
  "id": "xxx-xxx-xxx",
  "jobId": "xxx-xxx-xxx",
  "name": "John Doe",
  "email": "john@example.com",
  "resumeUrl": "https://r2.dev/resume-xxx.pdf",
  "status": "pending",
  "appliedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## POST /api/jobs/:id/apply/upload-cv

Upload CV for job application.

### Authentication
- **Public** - No authentication required

### Request Body (multipart/form-data)

```
file: [resume.pdf]
```

### Response

```json
{
  "url": "https://r2.dev/resume-xxx.pdf",
  "key": "resumes/resume-xxx.pdf"
}
```

---

## GET /api/jobs/applications

Get all job applications.

### Authentication
- **Required** - Admin only (Stack Auth)

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `jobId` | string | No | Filter by job ID |
| `status` | string | No | Filter by status |

### Response

```json
[
  {
    "id": "xxx-xxx-xxx",
    "jobId": "xxx-xxx-xxx",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+880171234567",
    "resumeUrl": "https://r2.dev/resume.pdf",
    "coverLetter": "I'm excited to apply...",
    "status": "pending",
    "notes": "Strong candidate",
    "appliedAt": "2024-01-15T10:30:00.000Z",
    "reviewedAt": null
  }
]
```

---

## Data Models

### Job

```typescript
interface Job {
  id: string;                  // UUID
  title: string;               // Job title
  description?: string;        // Job description
  requirements?: string;       // Requirements
  responsibilities?: string;   // Responsibilities
  location?: string;           // Job location
  type: string;                // full-time | part-time | contract | internship
  salaryMin?: number;          // Minimum salary
  salaryMax?: number;          // Maximum salary
  department?: string;         // Department name
  experienceMin?: number;      // Minimum experience (years)
  experienceMax?: number;      // Maximum experience (years)
  published: boolean;          // Published status
  allowCvSubmission: boolean;  // Allow CV upload
  isActive: boolean;           // Active status
  postedDate: string;          // ISO 8601 timestamp
  closingDate?: string;        // Application deadline
}
```

### JobApplication

```typescript
interface JobApplication {
  id: string;              // UUID
  jobId: string;           // Job UUID
  name: string;            // Applicant name
  email: string;           // Applicant email
  phone?: string;          // Phone number
  resumeUrl?: string;      // Resume file URL
  coverLetter?: string;    // Cover letter
  status: string;          // pending | reviewing | accepted | rejected
  notes?: string;          // Admin notes
  appliedAt: string;       // ISO 8601 timestamp
  reviewedAt?: string;     // ISO 8601 timestamp
}
```

---

**Next:** [Settings API](./SETTINGS-API.md)
