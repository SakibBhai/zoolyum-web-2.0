# Health Check API

Database and application health monitoring.

---

## GET /api/health/database

Check database connection health.

### Authentication
- **Public** - No authentication required

### Response

```json
{
  "status": "healthy",
  "database": "connected",
  "connection": "active",
  "schema": "accessible",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production"
}
```

### Error Response

```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection refused",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Example

```bash
curl https://zoolyum-web-2-0.vercel.app/api/health/database
```

### Health Status Values

| Status | Description |
|--------|-------------|
| `healthy` | Database connected and operational |
| `unhealthy` | Database connection failed |

### Monitoring

This endpoint is ideal for:
- Uptime monitoring
- Load balancer health checks
- Database connection monitoring
- Application heartbeat checks

---

**Next:** [Homepage/CMS API](./HOMEPAGE-CMS-API.md)
