# Netlify Deployment Guide

This guide provides step-by-step instructions for deploying the Zoolyum Web 2.0 application on Netlify.

## Prerequisites

- Netlify account
- GitHub/GitLab repository
- Node.js 18.x or higher
- All required environment variables

## Quick Deploy

### Option 1: Git-based Deployment (Recommended)

1. **Connect Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, Bitbucket)
   - Select the repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site

### Option 2: Netlify CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

## Environment Variables Setup

### Via Netlify Dashboard

1. Go to Site Settings → Environment Variables
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
NEXTAUTH_URL=https://your-netlify-domain.netlify.app
NEXTAUTH_SECRET=your_nextauth_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-netlify-domain.netlify.app

# Optional: Cloudflare R2 Storage
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_ENDPOINT=your_r2_endpoint
CLOUDFLARE_R2_PUBLIC_URL=your_public_url

# Build Configuration
NODE_VERSION=18
NPM_VERSION=9
NEXT_TELEMETRY_DISABLED=1
```

### Via Netlify CLI

```bash
# Set environment variables
netlify env:set DATABASE_URL "your_database_url"
netlify env:set DIRECT_URL "your_direct_url"
netlify env:set NEXT_PUBLIC_STACK_PROJECT_ID "your_project_id"
netlify env:set NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY "your_key"
netlify env:set STACK_SECRET_SERVER_KEY "your_secret"
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"
netlify env:set NEXTAUTH_SECRET "your_secret"
```

## Configuration Files

### netlify.toml (Already configured)

The `netlify.toml` file in the project root contains:
- Build settings
- Redirect rules for Next.js routing
- Security headers
- Caching policies

### Key Configuration Features

1. **Next.js API Routes**: Automatically handled as Netlify Functions
2. **Dynamic Routing**: Proper redirects for SPA behavior
3. **Security Headers**: OWASP-compliant security headers
4. **Caching**: Optimized caching for static assets
5. **CORS**: Configured for API endpoints

## Custom Domain Setup

### Add Custom Domain

1. **Via Dashboard**
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **DNS Configuration**
   ```
   # For apex domain (example.com)
   A record: 75.2.60.5
   
   # For subdomain (www.example.com)
   CNAME record: your-site.netlify.app
   ```

3. **SSL Certificate**
   - Netlify automatically provisions SSL certificates
   - Force HTTPS in Site Settings → HTTPS

## Build Optimization

### Build Performance

```toml
# In netlify.toml
[build]
  command = "npm run build"
  publish = ".next"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
  NEXT_TELEMETRY_DISABLED = "1"
  # Enable build cache
  NETLIFY_NEXT_PLUGIN_SKIP_CACHE = "false"
```

### Build Plugins

Add to `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"

[[plugins]]
  package = "netlify-plugin-cache"
  [plugins.inputs]
    paths = ["node_modules", ".next/cache"]
```

## Monitoring and Analytics

### Netlify Analytics

1. Enable in Site Settings → Analytics
2. View traffic, performance, and error metrics
3. Set up alerts for downtime

### Error Tracking

```bash
# Install Sentry (optional)
npm install @sentry/nextjs

# Configure in next.config.mjs
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // Your Next.js config
}, {
  // Sentry config
});
```

## Deployment Workflow

### Automatic Deployments

1. **Production Branch**: Deploys from `main` branch
2. **Preview Deployments**: Automatic for pull requests
3. **Branch Deployments**: Configure specific branches

### Manual Deployments

```bash
# Build locally
npm run build

# Deploy to production
netlify deploy --prod --dir=.next

# Deploy preview
netlify deploy --dir=.next
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs in Netlify dashboard
   # Common fixes:
   - Verify Node.js version
   - Check environment variables
   - Review dependency versions
   ```

2. **Function Timeouts**
   ```toml
   # Increase timeout in netlify.toml
   [functions]
     timeout = 30
   ```

3. **Routing Issues**
   ```toml
   # Ensure proper redirects in netlify.toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

4. **Environment Variable Issues**
   ```bash
   # Check variables in build logs
   netlify env:list
   
   # Test locally with Netlify CLI
   netlify dev
   ```

### Debug Commands

```bash
# Check site status
netlify status

# View build logs
netlify logs

# Test functions locally
netlify dev

# Open site in browser
netlify open
```

## Performance Optimization

### Edge Functions

```javascript
// netlify/edge-functions/auth.js
export default async (request, context) => {
  // Custom authentication logic
  return context.next();
};

export const config = {
  path: "/admin/*"
};
```

### Image Optimization

```javascript
// Use Netlify Image CDN
const optimizedImageUrl = `/.netlify/images?url=${imageUrl}&w=800&h=600&fit=cover`;
```

### Caching Strategy

```toml
# Static assets - 1 year
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# API responses - no cache
[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "no-cache, no-store, must-revalidate"
```

## Security Best Practices

### Environment Variables
- Never commit secrets to repository
- Use Netlify's encrypted environment variables
- Rotate keys regularly

### Security Headers
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

### Access Control
```toml
# Protect admin routes
[[redirects]]
  from = "/admin/*"
  to = "/admin/login"
  status = 302
  conditions = {Role = ["!admin"]}
```

## Backup and Recovery

### Site Backup
```bash
# Download site files
netlify sites:list
netlify api getSite --site-id=YOUR_SITE_ID
```

### Database Backup
```bash
# Backup Neon database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

## Cost Optimization

### Free Tier Limits
- 100GB bandwidth/month
- 300 build minutes/month
- 125,000 function invocations/month

### Optimization Tips
1. Enable build caching
2. Optimize images
3. Use CDN for static assets
4. Implement proper caching headers
5. Monitor function usage

## Support Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/)
- [Netlify Community](https://community.netlify.com/)
- [Status Page](https://www.netlifystatus.com/)

## Checklist

- [ ] Repository connected to Netlify
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate enabled
- [ ] Security headers configured
- [ ] Performance monitoring enabled
- [ ] Backup strategy implemented

---

*For additional support, refer to the main [Platform Deployment Guide](./PLATFORM_DEPLOYMENT_GUIDE.md)*