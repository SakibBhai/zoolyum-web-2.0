# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a Neon PostgreSQL database at [neon.tech](https://neon.tech)
3. **Domain** (Optional): Configure custom domain in Vercel dashboard

## Environment Variables Setup

### Required Variables

In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

```bash
# Authentication (Required)
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.vercel.app

# Stack Auth (Required for Admin Authentication)
NEXT_PUBLIC_STACK_PROJECT_ID=your-stack-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-stack-publishable-key
STACK_SECRET_SERVER_KEY=your-stack-secret-key

# Database (Required)
DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require

# Public Configuration (Required)
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# Email Service (Optional)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
HR_EMAIL=hr@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# File Storage (Optional)
R2_ENDPOINT=your-r2-endpoint
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-public-url.com
```

### Environment Variable Scopes

- **Production**: Set for production deployments
- **Preview**: Set for preview deployments (optional)
- **Development**: Set for local development (optional)

## Deployment Steps

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository**:
   - Push your code to GitHub
   - Import project in Vercel dashboard
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Framework Preset: **Next.js**
   - Build Command: `prisma generate && pnpm run build`
   - Install Command: `pnpm install`
   - Output Directory: `.next` (auto-detected)

3. **Set Environment Variables**:
   - Add all required variables from the list above
   - Ensure `NEXTAUTH_URL` matches your Vercel domain

4. **Deploy**:
   - Click "Deploy" - Vercel will automatically build and deploy
   - Subsequent pushes to main branch will auto-deploy

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts to configure project
```

## Database Setup

### Neon PostgreSQL

1. **Create Database**:
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Configure Connection**:
   - Add `?sslmode=require` to your DATABASE_URL
   - Example: `postgresql://user:pass@host:5432/db?sslmode=require`

3. **Run Migrations**:
   ```bash
   # Local development
   npx prisma db push
   
   # Or generate and apply migrations
   npx prisma migrate deploy
   ```

## Post-Deployment Setup

### 1. Create First Admin User

- Visit your deployed site
- Sign up with your admin email
- First user automatically becomes admin

### 2. Configure Domain (Optional)

- Go to Vercel project settings
- Add custom domain
- Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL`

### 3. Test Functionality

- [ ] Authentication works
- [ ] Admin panel accessible
- [ ] Database operations work
- [ ] Contact forms send emails (if configured)
- [ ] File uploads work (if configured)

## Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check build logs in Vercel dashboard
   # Common fixes:
   - Ensure all environment variables are set
   - Check TypeScript/ESLint errors
   - Verify Prisma schema is valid
   ```

2. **Database Connection Issues**:
   ```bash
   # Verify DATABASE_URL format
   # Ensure SSL mode is enabled
   # Check Neon database is active
   ```

3. **Authentication Problems**:
   ```bash
   # Verify NEXTAUTH_SECRET is set
   # Check NEXTAUTH_URL matches deployment URL
   # Clear browser cookies and try again
   ```

4. **Stack Auth Console Errors**:
   ```bash
   # Error: "Welcome to Stack Auth! It seems that you haven't provided a project ID"
   # Solution:
   # 1. Go to https://app.stack-auth.com/
   # 2. Create a project or select existing one
   # 3. Copy STACK_PROJECT_ID, STACK_PUBLISHABLE_CLIENT_KEY, STACK_SECRET_SERVER_KEY
   # 4. Add these to Vercel Environment Variables
   # 5. Redeploy the application
   ```

5. **Environment Variable Issues**:
   ```bash
   # Check variable names are exact
   # Ensure no trailing spaces
   # Redeploy after adding variables
   ```

### Performance Optimization

1. **Enable Analytics**:
   - Add `@vercel/analytics` (already included)
   - Monitor Core Web Vitals

2. **Caching Strategy**:
   - Static pages cached automatically
   - API routes use appropriate cache headers
   - Database queries optimized with Prisma

3. **Image Optimization**:
   - Next.js Image component used throughout
   - WebP/AVIF formats enabled
   - Remote patterns configured

## Security Checklist

- [ ] Strong `NEXTAUTH_SECRET` generated
- [ ] Database credentials secured
- [ ] Environment variables not in code
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Security headers configured
- [ ] Admin routes protected
- [ ] Rate limiting enabled

## Monitoring

### Vercel Dashboard

- **Functions**: Monitor API route performance
- **Analytics**: Track page views and performance
- **Logs**: Debug runtime issues

### Database Monitoring

- **Neon Console**: Monitor database performance
- **Connection Pooling**: Enabled by default
- **Query Performance**: Use Prisma insights

## Maintenance

### Regular Tasks

1. **Update Dependencies**:
   ```bash
   pnpm update
   ```

2. **Database Maintenance**:
   ```bash
   # Run migrations
   npx prisma migrate deploy
   
   # Reset database (development only)
   npx prisma migrate reset
   ```

3. **Security Updates**:
   - Monitor dependency vulnerabilities
   - Update Next.js and other frameworks
   - Rotate secrets periodically

### Backup Strategy

- **Database**: Neon provides automatic backups
- **Code**: Version controlled in Git
- **Environment Variables**: Document in secure location

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)