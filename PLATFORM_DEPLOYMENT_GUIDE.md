# Platform-Agnostic Deployment Guide

This guide provides comprehensive instructions for deploying the Zoolyum Web 2.0 application across multiple platforms with proper environment configuration.

## Prerequisites

### Required Environment Variables

Before deploying to any platform, ensure you have the following environment variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# Stack Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID="your_stack_project_id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_publishable_key"
STACK_SECRET_SERVER_KEY="your_secret_server_key"

# Next.js Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your_nextauth_secret"

# Cloudflare R2 Storage (Optional)
CLOUDFLARE_R2_ACCESS_KEY_ID="your_access_key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your_secret_key"
CLOUDFLARE_R2_BUCKET_NAME="your_bucket_name"
CLOUDFLARE_R2_ENDPOINT="your_r2_endpoint"
CLOUDFLARE_R2_PUBLIC_URL="your_public_url"

# Application Configuration
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Build Requirements

- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- PostgreSQL database (Neon recommended)
- Stack Auth project setup

## Platform-Specific Deployment

### 1. Vercel (Recommended)

#### Quick Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Environment Variables Setup
```bash
# Add environment variables
vercel env add DATABASE_URL production
vercel env add DIRECT_URL production
vercel env add NEXT_PUBLIC_STACK_PROJECT_ID production
vercel env add NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY production
vercel env add STACK_SECRET_SERVER_KEY production
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
```

#### Vercel Configuration (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### 2. Netlify

#### Deploy via Git
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

#### Netlify Configuration (netlify.toml)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Railway

#### Deploy via CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Railway Configuration (railway.json)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 4. Docker Deployment

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - DIRECT_URL=${DIRECT_URL}
      - NEXT_PUBLIC_STACK_PROJECT_ID=${NEXT_PUBLIC_STACK_PROJECT_ID}
      - NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=${NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY}
      - STACK_SECRET_SERVER_KEY=${STACK_SECRET_SERVER_KEY}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=zoolyum
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Database Setup

### Neon (Recommended)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Set `DATABASE_URL` and `DIRECT_URL` environment variables

### Self-hosted PostgreSQL
```bash
# Create database
createdb zoolyum

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## Stack Auth Setup

1. Create account at [stack-auth.com](https://stack-auth.com)
2. Create new project
3. Configure OAuth providers (optional)
4. Copy API keys to environment variables
5. Set up admin user:

```bash
node scripts/seed-admin.js
```

## Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Stack Auth project created and configured
- [ ] Build process completes successfully
- [ ] Admin user seeded
- [ ] SSL certificate configured (for custom domains)
- [ ] DNS records updated (for custom domains)

## Post-deployment Verification

1. **Health Check**
   ```bash
   curl -I https://your-domain.com
   ```

2. **Database Connection**
   ```bash
   curl https://your-domain.com/api/health
   ```

3. **Authentication**
   - Visit `/admin/login`
   - Test login with seeded admin user
   - Verify admin dashboard access

4. **API Endpoints**
   ```bash
   curl https://your-domain.com/api/projects
   curl https://your-domain.com/api/services
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Database Connection Issues**
   - Verify connection string format
   - Check database server accessibility
   - Ensure SSL mode is configured correctly

3. **Authentication Problems**
   - Verify Stack Auth environment variables
   - Check Stack Auth project configuration
   - Ensure admin user is seeded

4. **Environment Variable Issues**
   - Use platform-specific CLI to verify variables
   - Check for typos in variable names
   - Ensure sensitive values are properly escaped

### Platform-Specific Troubleshooting

#### Vercel
- Check function timeout limits
- Verify edge runtime compatibility
- Review Vercel dashboard logs

#### Netlify
- Check build logs in Netlify dashboard
- Verify function deployment
- Review redirect rules

#### Railway
- Monitor resource usage
- Check deployment logs
- Verify port configuration

#### Docker
- Check container logs: `docker logs <container_id>`
- Verify port mapping
- Ensure environment variables are passed correctly

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive values to version control
   - Use platform-specific secret management
   - Rotate keys regularly

2. **Database Security**
   - Use SSL connections
   - Implement connection pooling
   - Regular backups

3. **Application Security**
   - Keep dependencies updated
   - Implement rate limiting
   - Use HTTPS only
   - Configure proper CORS policies

## Performance Optimization

1. **Caching**
   - Configure CDN (Vercel Edge, Cloudflare)
   - Implement Redis for session storage
   - Use Next.js ISR for static content

2. **Database**
   - Implement connection pooling
   - Optimize queries with indexes
   - Use read replicas for scaling

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor performance metrics
   - Configure alerts for downtime

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Verify environment configuration
4. Test locally with production environment variables

---

*Last updated: $(date)*