# 🚀 Multi-Platform Deployment Guide

This guide covers deployment across multiple hosting platforms with comprehensive environment variable setup for seamless operation.

## 📋 Prerequisites

- Node.js 18+ installed locally
- Database (Neon PostgreSQL recommended)
- Stack Auth account and API keys
- Domain name (for production)

## 🔧 Environment Setup

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Required Environment Variables

Fill in the following variables in your `.env.local` file:

#### Database Configuration
```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host/database?sslmode=require"
```

#### Authentication
```env
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

#### Stack Auth
```env
NEXT_PUBLIC_STACK_PROJECT_ID="your-stack-project-id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-stack-publishable-client-key"
STACK_SECRET_SERVER_KEY="your-stack-secret-server-key"
```

## 🌐 Platform-Specific Deployments

### Vercel (Recommended)

#### Setup Steps:
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Environment Variables:
Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret
# NEXTAUTH_URL is auto-set by Vercel

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-client-key
STACK_SECRET_SERVER_KEY=your-server-key

# Optional: Additional services
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
RESEND_API_KEY=re_...
```

#### Vercel Configuration:
- `vercel.json` is pre-configured with:
  - Security headers
  - CORS settings
  - Function timeouts
  - Cron jobs
  - Environment variable mapping

### Netlify

#### Setup Steps:
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod`

#### Environment Variables:
Set these in Netlify Dashboard → Site Settings → Environment Variables:

```env
# Same variables as Vercel
# Plus Netlify-specific:
NETLIFY_SITE_URL=$DEPLOY_PRIME_URL
```

#### Netlify Configuration:
- `netlify.toml` includes:
  - Build settings
  - Headers and redirects
  - Plugin configuration
  - Edge functions setup

### Railway

#### Setup Steps:
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Deploy: `railway up`

#### Environment Variables:
Set these in Railway Dashboard → Project → Variables:

```env
# Same core variables
# Plus Railway-specific:
RAILWAY_STATIC_URL=${{RAILWAY_STATIC_URL}}
RAILWAY_PUBLIC_DOMAIN=${{RAILWAY_PUBLIC_DOMAIN}}
PORT=${{PORT}}
```

#### Railway Configuration:
- `railway.json` includes:
  - Build and deploy settings
  - Health checks
  - Service configuration
  - Plugin setup (PostgreSQL, Redis)

### Docker Deployment

#### Build and Run:
```bash
# Build image
docker build -t zoolyum-web .

# Run container
docker run -p 3000:3000 --env-file .env.local zoolyum-web
```

#### Docker Compose:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: zoolyum
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 🔒 Security Considerations

### Environment Variables Security:
- Never commit `.env.local` to version control
- Use different secrets for each environment
- Rotate secrets regularly
- Use platform-specific secret management

### Headers and CSP:
All platforms are configured with:
- Content Security Policy
- CORS headers
- Security headers (XSS, CSRF protection)
- HTTPS enforcement

## 🧪 Testing Deployment

### Local Testing:
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

### Production Testing:
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Health Checks:
All platforms include health check endpoints:
- `/api/health` - Basic health check
- `/api/status` - Detailed system status
- `/health` - Redirects to `/api/health`

## 📊 Monitoring and Analytics

### Built-in Monitoring:
- Error tracking with Sentry (optional)
- Analytics with Google Analytics 4 (optional)
- Performance monitoring with PostHog (optional)

### Platform-Specific Monitoring:
- **Vercel**: Built-in analytics and performance insights
- **Netlify**: Analytics and form handling
- **Railway**: Resource usage and logs
- **Docker**: Container health checks and logging

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended):
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
      - run: npm run test
      # Platform-specific deployment steps
```

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Errors**:
   - Verify `DATABASE_URL` format
   - Check network connectivity
   - Ensure SSL mode is correct

2. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all environment variables are set
   - Clear build cache: `rm -rf .next`

3. **Authentication Issues**:
   - Verify Stack Auth configuration
   - Check `NEXTAUTH_URL` matches deployment URL
   - Ensure secrets are properly set

4. **Performance Issues**:
   - Enable caching headers
   - Optimize images and assets
   - Use CDN for static files

### Platform-Specific Troubleshooting:

#### Vercel:
- Check function logs in dashboard
- Verify region settings
- Monitor function execution time

#### Netlify:
- Check build logs
- Verify plugin configuration
- Test edge functions locally

#### Railway:
- Monitor resource usage
- Check service health
- Verify plugin connections

#### Docker:
- Check container logs: `docker logs <container-id>`
- Verify port mapping
- Test health check endpoint

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Stack Auth Documentation](https://docs.stack-auth.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)

## 🆘 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review platform-specific logs
3. Verify environment variable configuration
4. Test locally with production build

---

**Note**: This guide covers the most common deployment scenarios. For specific use cases or custom requirements, refer to the platform-specific documentation linked above.