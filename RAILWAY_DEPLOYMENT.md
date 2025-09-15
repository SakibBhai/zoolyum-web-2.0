# Railway Deployment Guide

This guide provides step-by-step instructions for deploying the Zoolyum Web 2.0 application on Railway.

## Prerequisites

- Railway account
- GitHub repository
- Node.js 18.x or higher
- All required environment variables

## Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Connect Repository**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Automatic Configuration**
   - Railway will detect Next.js automatically
   - Build and start commands are configured via `railway.json`

3. **Deploy**
   - Railway will automatically build and deploy
   - Monitor progress in the deployment logs

### Option 2: Railway CLI Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to existing project (optional)
railway link [project-id]

# Deploy
railway up
```

### Option 3: One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

## Environment Variables Setup

### Via Railway Dashboard

1. Go to your project → Variables tab
2. Add the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
DIRECT_URL=postgresql://username:password@host:port/database?sslmode=require

# Stack Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_publishable_key
STACK_SECRET_SERVER_KEY=your_secret_server_key

# Next.js Configuration
NEXTAUTH_URL=${{RAILWAY_STATIC_URL}}
NEXTAUTH_SECRET=your_nextauth_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=${{RAILWAY_STATIC_URL}}

# Railway Configuration
PORT=${{PORT}}
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Optional: Cloudflare R2 Storage
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_ENDPOINT=your_r2_endpoint
CLOUDFLARE_R2_PUBLIC_URL=your_public_url
```

### Via Railway CLI

```bash
# Set environment variables
railway variables set DATABASE_URL="your_database_url"
railway variables set DIRECT_URL="your_direct_url"
railway variables set NEXT_PUBLIC_STACK_PROJECT_ID="your_project_id"
railway variables set NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_key"
railway variables set STACK_SECRET_SERVER_KEY="your_secret"
railway variables set NEXTAUTH_SECRET="your_secret"

# Use Railway's dynamic URL
railway variables set NEXTAUTH_URL='${{RAILWAY_STATIC_URL}}'
railway variables set NEXT_PUBLIC_APP_URL='${{RAILWAY_STATIC_URL}}'
```

## Database Setup with Railway

### Option 1: Railway PostgreSQL (Recommended)

```bash
# Add PostgreSQL service
railway add postgresql

# Get connection details
railway variables

# The DATABASE_URL will be automatically set
```

### Option 2: External Database (Neon)

1. Create database on [Neon](https://neon.tech)
2. Set `DATABASE_URL` and `DIRECT_URL` variables
3. Run migrations:

```bash
# Connect to Railway environment
railway shell

# Run Prisma migrations
npx prisma migrate deploy
npx prisma generate
```

## Configuration Files

### railway.json (Already configured)

The `railway.json` file contains:
- Build configuration with Nixpacks
- Deployment settings
- Health check configuration
- Environment-specific variables
- Service definitions

### Key Features

1. **Nixpacks Builder**: Automatic detection and optimization
2. **Health Checks**: Monitors application health
3. **Auto-restart**: Configurable restart policies
4. **Multi-environment**: Production and staging configurations
5. **Regional Deployment**: Optimized for performance

## Custom Domain Setup

### Add Custom Domain

1. **Via Dashboard**
   - Go to project → Settings → Domains
   - Click "Custom Domain"
   - Enter your domain name
   - Configure DNS records

2. **DNS Configuration**
   ```
   # CNAME record
   www.yourdomain.com → your-app.up.railway.app
   
   # A record (for apex domain)
   yourdomain.com → Railway's IP (provided in dashboard)
   ```

3. **SSL Certificate**
   - Railway automatically provisions SSL certificates
   - HTTPS is enforced by default

## Build Optimization

### Nixpacks Configuration

Create `nixpacks.toml` for advanced configuration:

```toml
[phases.setup]
nixPkgs = ['nodejs-18_x', 'npm-9_x']

[phases.install]
cmds = ['npm ci --only=production']

[phases.build]
cmds = [
  'npx prisma generate',
  'npm run build'
]

[start]
cmd = 'npm start'

[variables]
NODE_ENV = 'production'
PORT = '3000'
```

### Build Performance

```json
// In railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build",
    "watchPatterns": [
      "**/*.ts",
      "**/*.tsx",
      "package.json"
    ]
  }
}
```

## Monitoring and Logging

### Application Logs

```bash
# View logs via CLI
railway logs

# Follow logs in real-time
railway logs --follow

# Filter logs by service
railway logs --service web
```

### Metrics Dashboard

1. **CPU Usage**: Monitor application performance
2. **Memory Usage**: Track memory consumption
3. **Network**: Monitor incoming/outgoing traffic
4. **Response Times**: Track API performance

### Health Checks

```javascript
// pages/api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
}
```

## Deployment Workflow

### Automatic Deployments

1. **Git Integration**: Deploys on push to main branch
2. **PR Previews**: Automatic preview deployments
3. **Rollback**: Easy rollback to previous deployments

### Manual Deployments

```bash
# Deploy current directory
railway up

# Deploy specific service
railway up --service web

# Deploy with environment
railway up --environment production
```

### Deployment Strategies

```bash
# Blue-green deployment
railway deploy --strategy blue-green

# Rolling deployment
railway deploy --strategy rolling

# Canary deployment
railway deploy --strategy canary --percentage 10
```

## Scaling and Performance

### Horizontal Scaling

```json
// In railway.json
{
  "services": [
    {
      "name": "web",
      "replicas": {
        "min": 1,
        "max": 10
      },
      "autoscaling": {
        "enabled": true,
        "targetCPU": 70,
        "targetMemory": 80
      }
    }
  ]
}
```

### Resource Limits

```json
{
  "services": [
    {
      "name": "web",
      "resources": {
        "cpu": "1000m",
        "memory": "1Gi"
      }
    }
  ]
}
```

### Performance Optimization

1. **Enable Caching**
   ```javascript
   // next.config.mjs
   export default {
     experimental: {
       isrMemoryCacheSize: 0, // Disable ISR cache in production
     },
   };
   ```

2. **Database Connection Pooling**
   ```javascript
   // lib/prisma.ts
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
   });
   ```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   railway logs --deployment [deployment-id]
   
   # Common fixes:
   - Verify Node.js version in railway.json
   - Check environment variables
   - Review dependency versions
   ```

2. **Memory Issues**
   ```bash
   # Increase memory limit
   railway variables set NODE_OPTIONS="--max-old-space-size=4096"
   ```

3. **Database Connection Issues**
   ```bash
   # Test database connection
   railway shell
   npx prisma db pull
   ```

4. **Port Configuration**
   ```javascript
   // Make sure to use Railway's PORT variable
   const port = process.env.PORT || 3000;
   ```

### Debug Commands

```bash
# Check service status
railway status

# View environment variables
railway variables

# Connect to service shell
railway shell

# View deployment history
railway deployments

# Rollback to previous deployment
railway rollback [deployment-id]
```

## Security Best Practices

### Environment Variables
- Use Railway's encrypted variables
- Never commit secrets to repository
- Use Railway's variable references: `${{VARIABLE_NAME}}`

### Network Security
```json
// In railway.json
{
  "networking": {
    "allowedIPs": ["0.0.0.0/0"],
    "internalNetworking": true
  }
}
```

### Service Communication
```bash
# Use internal URLs for service-to-service communication
INTERNAL_API_URL=${{railway.web.url}}
```

## Cost Optimization

### Resource Management

1. **Right-size Resources**
   - Monitor CPU and memory usage
   - Adjust resource limits accordingly
   - Use autoscaling for variable workloads

2. **Sleep Mode**
   ```json
   {
     "services": [
       {
         "name": "web",
         "sleepMode": {
           "enabled": true,
           "idleTimeout": "30m"
         }
       }
     ]
   }
   ```

3. **Usage Monitoring**
   - Track monthly usage in dashboard
   - Set up billing alerts
   - Optimize database queries

## Backup and Recovery

### Database Backup

```bash
# Backup Railway PostgreSQL
railway connect postgres
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Application Backup

```bash
# Download deployment artifacts
railway deployments download [deployment-id]

# Export environment variables
railway variables --json > variables.json
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/railway.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install Railway CLI
        run: npm install -g @railway/cli
        
      - name: Deploy to Railway
        run: railway up --detach
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Deployment Hooks

```bash
# Pre-deployment hook
railway run --command "npm run test"

# Post-deployment hook
railway run --command "npm run seed"
```

## Support Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)
- [Railway Blog](https://blog.railway.app/)

## Checklist

- [ ] Repository connected to Railway
- [ ] Environment variables configured
- [ ] Database service added (if using Railway PostgreSQL)
- [ ] Custom domain configured (if applicable)
- [ ] Health checks enabled
- [ ] Monitoring and alerts set up
- [ ] Backup strategy implemented
- [ ] Resource limits configured
- [ ] Security settings reviewed

---

*For additional support, refer to the main [Platform Deployment Guide](./PLATFORM_DEPLOYMENT_GUIDE.md)*