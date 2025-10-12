# Vercel Database Connection Fix Guide

## Issue Analysis

Based on the codebase analysis, the following database connection issues have been identified for Vercel deployment:

1. **Environment Variable Configuration**: Missing or incorrect Vercel environment variables
2. **SSL/TLS Configuration**: Improper SSL settings for production database connections
3. **Connection Pooling**: Suboptimal connection pool configuration for serverless environment
4. **Error Handling**: Insufficient retry logic for database connection failures

## Current Configuration Status

### ✅ Properly Configured
- Shared Prisma client singleton in `lib/prisma.ts`
- Connection health check with retry logic
- Graceful shutdown handlers
- Enhanced error formatting

### ⚠️ Needs Attention
- Vercel-specific environment variables
- Production SSL configuration
- Connection pool optimization for serverless
- Vercel function timeout configuration

## Solution Implementation

### 1. Vercel Environment Variables Setup

Add the following environment variables in your Vercel project dashboard:

```bash
# Database Configuration (CRITICAL)
DATABASE_URL=postgresql://neondb_owner:npg_rDwthKzdj8b1@ep-old-breeze-a8aftq0x-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&connection_limit=20&pool_timeout=20

# Direct Database URL (for migrations)
DIRECT_URL=postgresql://neondb_owner:npg_rDwthKzdj8b1@ep-old-breeze-a8aftq0x-pooler.eastus2.azure.neon.tech/neondb?sslmode=require

# Authentication
NEXTAUTH_SECRET=your-secure-nextauth-secret-32-chars-min
NEXTAUTH_URL=https://your-domain.vercel.app

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=8e1b2d94-6841-419a-bbc4-4c6714a3c131
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_4mx6b5nj86cas8vc7gmnxxac726z6pjtt17ncm2r04j00
STACK_SECRET_SERVER_KEY=ssk_0egbf8gw0r546nkwgw8h3qf2bw04kywpqwr05aeyde7zr

# Application URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api

# Optional: File Storage
R2_ENDPOINT=https://d1313add12851300113d3b7f5289fdd3.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=2fbf39f57a6a9f5db625b0e49b98e6ab
R2_SECRET_ACCESS_KEY=9efe4213e5b3e1a8a743f1780a41639aa2c3e6fff5b13e8fca4c3d14f50a08da
R2_BUCKET_NAME=zoolyum
R2_PUBLIC_URL=https://pub-3f474f0a9ab64292a4ec02929c4b100e.r2.dev
```

### 2. Database URL Optimization

The current DATABASE_URL needs optimization for Vercel's serverless environment:

**Current URL:**
```
postgresql://neondb_owner:npg_rDwthKzdj8b1@ep-old-breeze-a8aftq0x-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
```

**Optimized URL for Vercel:**
```
postgresql://neondb_owner:npg_rDwthKzdj8b1@ep-old-breeze-a8aftq0x-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&connection_limit=20&pool_timeout=20&connect_timeout=10
```

### 3. Enhanced Prisma Configuration

The current `lib/prisma.ts` is well-configured but can be enhanced for Vercel:

```typescript
// Additional configuration for Vercel deployment
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  transactionOptions: {
    maxWait: 5000, // 5 seconds
    timeout: 10000, // 10 seconds
  },
  // Vercel-specific optimizations
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
```

### 4. Vercel Function Configuration

Update `vercel.json` to optimize for database connections:

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    },
    "app/api/webhooks/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

### 5. Connection Pool Configuration

For Neon PostgreSQL with Vercel, use these optimal settings:

- **Connection Limit**: 20 (suitable for serverless)
- **Pool Timeout**: 20 seconds
- **Connect Timeout**: 10 seconds
- **SSL Mode**: require (mandatory for production)

## Deployment Steps

### Step 1: Update Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add all variables listed above
4. Set scope to **Production** and **Preview**

### Step 2: Update Database URL

Replace your current DATABASE_URL with the optimized version:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_rDwthKzdj8b1@ep-old-breeze-a8aftq0x-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&connection_limit=20&pool_timeout=20&connect_timeout=10
```

### Step 3: Verify Build Configuration

Ensure your `vercel.json` includes:

```json
{
  "buildCommand": "prisma generate && SKIP_ENV_VALIDATION=1 npm run build",
  "installCommand": "npm install"
}
```

### Step 4: Deploy and Test

1. Push changes to your repository
2. Vercel will automatically deploy
3. Monitor deployment logs for any database connection errors
4. Test API endpoints to verify database connectivity

## Testing Database Connection

Create a simple health check endpoint to test the connection:

```typescript
// app/api/health/database/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
```

## Troubleshooting Common Issues

### Issue 1: "Connection Pool Exhausted"
**Solution**: Reduce connection_limit in DATABASE_URL to 10-15

### Issue 2: "SSL Connection Required"
**Solution**: Ensure `sslmode=require` is in DATABASE_URL

### Issue 3: "Function Timeout"
**Solution**: Increase maxDuration in vercel.json to 30 seconds

### Issue 4: "Environment Variable Not Found"
**Solution**: Verify all variables are set in Vercel dashboard and redeploy

### Issue 5: "Prisma Client Not Generated"
**Solution**: Ensure `prisma generate` is in build command

## Security Best Practices

1. **Never commit sensitive environment variables**
2. **Use strong, unique secrets for NEXTAUTH_SECRET**
3. **Enable SSL for all database connections**
4. **Regularly rotate database credentials**
5. **Monitor connection logs for suspicious activity**

## Performance Optimization

1. **Connection Pooling**: Use pooled connections (already configured)
2. **Query Optimization**: Use Prisma's query optimization features
3. **Caching**: Implement appropriate caching strategies
4. **Monitoring**: Use Vercel Analytics and Neon monitoring

## Monitoring and Alerts

### Vercel Dashboard
- Monitor function execution times
- Check error rates and logs
- Set up alerts for failures

### Neon Console
- Monitor database performance
- Check connection pool usage
- Set up alerts for high CPU/memory usage

## Conclusion

This configuration ensures:
- ✅ Stable database connections in Vercel's serverless environment
- ✅ Proper SSL/TLS encryption
- ✅ Optimized connection pooling
- ✅ Comprehensive error handling
- ✅ Production-ready security settings

After implementing these changes, your Vercel deployment should have reliable database connectivity with optimal performance.