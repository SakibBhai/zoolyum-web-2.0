# Docker Deployment Guide

This guide provides comprehensive instructions for deploying the Zoolyum Web 2.0 application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- 4GB+ RAM recommended
- 10GB+ disk space

## Quick Start

### Production Deployment

```bash
# Clone the repository
git clone <repository-url>
cd zoolyum-web-2.0

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

# Build and start services
docker-compose up -d

# Run database migrations
docker-compose exec web npx prisma migrate deploy

# Check service status
docker-compose ps
```

### Development Setup

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f web-dev

# Access development tools
# - Application: http://localhost:3000
# - Prisma Studio: http://localhost:5555
# - MailHog: http://localhost:8025
# - MinIO: http://localhost:9001
```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:password@postgres:5432/zoolyum
DIRECT_URL=postgresql://postgres:password@postgres:5432/zoolyum
POSTGRES_DB=zoolyum
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password

# Stack Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_server_key

# NextAuth Configuration
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_nextauth_secret_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Cloudflare R2 Storage (Optional)
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_ENDPOINT=your_r2_endpoint
CLOUDFLARE_R2_PUBLIC_URL=your_public_url

# Redis Configuration (Optional)
REDIS_PASSWORD=your_redis_password
```

### Development Environment Variables

```bash
# Development-specific variables
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
WATCHPACK_POLLING=true
```

## Docker Services

### Production Services

1. **web**: Next.js application (port 3000)
2. **postgres**: PostgreSQL database (port 5432)
3. **redis**: Redis cache (port 6379)
4. **nginx**: Reverse proxy (ports 80, 443) - optional

### Development Services

1. **web-dev**: Next.js development server with hot reload
2. **postgres-dev**: PostgreSQL development database
3. **redis-dev**: Redis development cache
4. **prisma-studio**: Database management UI
5. **mailhog**: Email testing service
6. **minio**: S3-compatible storage for development

## Deployment Commands

### Production Deployment

```bash
# Build and start all services
docker-compose up -d

# Build specific service
docker-compose build web

# Start with nginx reverse proxy
docker-compose --profile production up -d

# Scale web service
docker-compose up -d --scale web=3

# Update and restart services
docker-compose pull
docker-compose up -d
```

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Start with development tools
docker-compose -f docker-compose.dev.yml --profile tools up -d

# Rebuild development image
docker-compose -f docker-compose.dev.yml build web-dev

# Run tests in container
docker-compose -f docker-compose.dev.yml run --rm web-dev npm test

# Access container shell
docker-compose -f docker-compose.dev.yml exec web-dev sh
```

## Database Management

### Initial Setup

```bash
# Generate Prisma client
docker-compose exec web npx prisma generate

# Run database migrations
docker-compose exec web npx prisma migrate deploy

# Seed database (if seed script exists)
docker-compose exec web npx prisma db seed
```

### Database Operations

```bash
# Create new migration
docker-compose exec web npx prisma migrate dev --name migration_name

# Reset database
docker-compose exec web npx prisma migrate reset

# View database with Prisma Studio
docker-compose -f docker-compose.dev.yml --profile tools up prisma-studio

# Backup database
docker-compose exec postgres pg_dump -U postgres zoolyum > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres zoolyum < backup.sql
```

## Monitoring and Logging

### View Logs

```bash
# View all service logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs web

# View last 100 lines
docker-compose logs --tail=100 web
```

### Health Checks

```bash
# Check service health
docker-compose ps

# Manual health check
docker-compose exec web node healthcheck.js

# View health check logs
docker inspect --format='{{json .State.Health}}' container_name
```

### Resource Monitoring

```bash
# View resource usage
docker stats

# View specific container stats
docker stats container_name

# System-wide Docker info
docker system df
docker system info
```

## Performance Optimization

### Multi-stage Build Benefits

1. **Smaller Images**: Production images exclude development dependencies
2. **Security**: Minimal attack surface with only necessary files
3. **Caching**: Efficient layer caching for faster builds
4. **Separation**: Clear separation between build and runtime environments

### Build Optimization

```bash
# Build with build cache
docker-compose build --parallel

# Build without cache
docker-compose build --no-cache

# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker-compose build
```

### Runtime Optimization

```yaml
# In docker-compose.yml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
```

## Security Best Practices

### Container Security

1. **Non-root User**: Containers run as non-root user
2. **Minimal Base Image**: Alpine Linux for smaller attack surface
3. **Health Checks**: Regular health monitoring
4. **Resource Limits**: CPU and memory constraints

### Network Security

```yaml
# Custom network configuration
networks:
  app-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### Secrets Management

```bash
# Use Docker secrets (Swarm mode)
echo "your_secret" | docker secret create db_password -

# Reference in compose file
secrets:
  - db_password
```

## SSL/TLS Configuration

### Nginx SSL Setup

Create `docker/nginx/nginx.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://web:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Let's Encrypt with Certbot

```bash
# Generate SSL certificates
docker run --rm -v "$PWD/docker/nginx/ssl:/etc/letsencrypt" \
  certbot/certbot certonly --standalone \
  -d yourdomain.com --email your@email.com --agree-tos
```

## Backup and Recovery

### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker-compose exec -T postgres pg_dump -U postgres zoolyum > "$BACKUP_DIR/db_$DATE.sql"

# Backup uploaded files (if using local storage)
docker cp $(docker-compose ps -q web):/app/public/uploads "$BACKUP_DIR/uploads_$DATE"

# Compress backups
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/db_$DATE.sql" "$BACKUP_DIR/uploads_$DATE"

# Clean up
rm "$BACKUP_DIR/db_$DATE.sql"
rm -rf "$BACKUP_DIR/uploads_$DATE"

echo "Backup completed: backup_$DATE.tar.gz"
```

### Recovery Process

```bash
# Stop services
docker-compose down

# Restore database
docker-compose up -d postgres
docker-compose exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS zoolyum;"
docker-compose exec -T postgres psql -U postgres -c "CREATE DATABASE zoolyum;"
docker-compose exec -T postgres psql -U postgres zoolyum < backup.sql

# Start all services
docker-compose up -d
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   
   # Change ports in docker-compose.yml
   ports:
     - "3001:3000"
   ```

2. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   
   # Fix Docker socket permissions
   sudo usermod -aG docker $USER
   ```

3. **Memory Issues**
   ```bash
   # Increase Docker memory limit
   # Docker Desktop: Settings > Resources > Memory
   
   # Check container memory usage
   docker stats --no-stream
   ```

4. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Test database connection
   docker-compose exec web npx prisma db pull
   ```

### Debug Commands

```bash
# Enter container shell
docker-compose exec web sh

# Check environment variables
docker-compose exec web env

# Check network connectivity
docker-compose exec web ping postgres

# View container processes
docker-compose exec web ps aux

# Check disk usage
docker-compose exec web df -h
```

### Performance Issues

```bash
# Analyze container performance
docker stats --no-stream

# Check application logs
docker-compose logs web | grep -i error

# Profile application
docker-compose exec web npm run analyze

# Check database performance
docker-compose exec postgres psql -U postgres -c "SELECT * FROM pg_stat_activity;"
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/docker.yml
name: Docker Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t zoolyum-web .
        
      - name: Run tests
        run: |
          docker-compose -f docker-compose.test.yml up --abort-on-container-exit
          
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

### Docker Registry

```bash
# Tag and push to registry
docker tag zoolyum-web:latest registry.example.com/zoolyum-web:latest
docker push registry.example.com/zoolyum-web:latest

# Pull and deploy
docker pull registry.example.com/zoolyum-web:latest
docker-compose up -d
```

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations applied
- [ ] Health checks enabled
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Resource limits set
- [ ] Security hardening applied
- [ ] Load balancing configured (if needed)
- [ ] CDN configured (if needed)

## Support and Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)

---

*For additional deployment options, refer to the main [Platform Deployment Guide](./PLATFORM_DEPLOYMENT_GUIDE.md)*