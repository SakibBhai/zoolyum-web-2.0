# Authentication Guide - Zoolyum Web Admin Portal

Complete guide for setting up and managing authentication for the Zoolyum Web admin portal.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup Stack Auth](#setup-stack-auth)
- [Environment Configuration](#environment-configuration)
- [Development vs Production](#development-vs-production)
- [Admin User Management](#admin-user-management)
- [Protected Routes](#protected-routes)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Zoolyum Web admin portal uses **Stack Auth** for authentication with a dual-mode system:

- **Development Mode**: Authentication bypass for local development
- **Production Mode**: Full Stack Auth authentication with cookie-based sessions

### Key Features

- 🔐 Secure authentication via Stack Auth
- 🍪 Cookie-based session management
- 🚀 Development bypass for easy local testing
- 🛡️ Protected admin routes
- 🔄 Automatic redirect to login for unauthenticated users

---

## Architecture

### Authentication Flow

```
┌─────────────────┐
│  Admin Access   │
│  /admin/*       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Middleware    │
│  middleware.ts  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────────┐
│  Development?   │──Yes──→  Bypass Auth     │
└────────┬────────┘       │  (Mock User)     │
         │No              └──────────────────┘
         ▼
┌─────────────────┐
│  Stack Auth     │
│  Get User       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────────┐
│  Authenticated? │──No───→  Redirect to     │
└────────┬────────┘       │  /admin/login    │
         │Yes              └──────────────────┘
         ▼
┌─────────────────┐
│  Grant Access   │
└─────────────────┘
```

### Files Involved

| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection & authentication check |
| `lib/stack-auth.ts` | Stack Auth utilities |
| `lib/stack-server.ts` | Stack Server App initialization |
| `app/admin/login/page.tsx` | Login page |
| `components/conditional-stack-provider.tsx` | Conditional Stack Auth provider |
| `hooks/use-conditional-user.tsx` | Conditional user hook |

---

## Setup Stack Auth

### Step 1: Create Stack Auth Account

1. Visit [stack-auth.com](https://stack-auth.com)
2. Sign up for a new account
3. Create a new project named "Zoolyum Web Admin"

### Step 2: Configure Project Settings

1. Go to your project dashboard
2. Navigate to **Settings** → **General**
3. Set the following:

#### Allowed Callback URLs

```
http://localhost:3000/admin/login
http://localhost:3000/handler/callback
https://zoolyum-web-2-0.vercel.app/admin/login
https://zoolyum-web-2-0.vercel.app/handler/callback
```

#### Allowed Logout URLs

```
http://localhost:3000/
https://zoolyum-web-2-0.vercel.app/
```

#### Allowed Origins

```
http://localhost:3000
https://zoolyum-web-2-0.vercel.app
```

### Step 3: Get API Keys

Navigate to **Settings** → **API Keys** and copy:

1. **Project ID** → `NEXT_PUBLIC_STACK_PROJECT_ID`
2. **Publishable Client Key** → `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
3. **Secret Server Key** → `STACK_SECRET_SERVER_KEY`

---

## Environment Configuration

### Required Environment Variables

Add these to your `.env.local` file:

```env
# Stack Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key-here
STACK_SECRET_SERVER_KEY=your-secret-key-here

# Stack Auth Handler URL (optional, defaults to /handler)
NEXT_PUBLIC_STACK_URL=http://localhost:3000/handler
```

### Production Environment (Vercel)

Add these in your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the same variables as above
3. Set the environment to **Production**

---

## Development vs Production

### Development Mode

**Authentication**: Bypassed automatically

**Detection**:
- `NODE_ENV === 'development'`
- `localhost` hostname
- `127.0.0.1` hostname
- Local IP addresses (`192.168.*`)
- Ports: `3000`, `3001`, `3002`

**Mock User**:
```typescript
{
  id: 'dev-user',
  email: 'admin@zoolyum.com',
  displayName: 'Development Admin'
}
```

**Benefits**:
- No need to configure Stack Auth locally
- Faster development workflow
- Easy testing of admin features

### Production Mode

**Authentication**: Full Stack Auth required

**Behavior**:
- All `/admin/*` routes are protected
- Unauthenticated users redirected to `/admin/login`
- Cookie-based session management
- Secure user validation

**Requirements**:
- All Stack Auth environment variables must be set
- Valid Stack Auth project configuration
- Callback URLs properly configured

---

## Admin User Management

### Current Implementation

Currently, **any authenticated user** is considered an admin:

```typescript
// lib/stack-auth.ts
export async function isAdmin() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) return true;

  const stackServerApp = await getStackServerApp();
  const user = await stackServerApp.getUser();
  return !!user; // Any authenticated user is admin
}
```

### Enhanced Admin Verification (Recommended)

To implement proper admin role checking:

#### Option 1: Email Whitelist

```typescript
// lib/stack-auth.ts
const ADMIN_EMAILS = [
  'admin@zoolyum.com',
  'sakib@zoolyum.com',
  // Add other admin emails
];

export async function isAdmin() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) return true;

  const stackServerApp = await getStackServerApp();
  const user = await stackServerApp.getUser();

  if (!user) return false;

  // Check if user email is in admin whitelist
  const userEmail = user.primaryEmail || user.email;
  return ADMIN_EMAILS.includes(userEmail);
}
```

#### Option 2: Database Admin Users

```typescript
// lib/stack-auth.ts
import { prisma } from './prisma';

export async function isAdmin() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) return true;

  const stackServerApp = await getStackServerApp();
  const user = await stackServerApp.getUser();

  if (!user) return false;

  // Check if user exists in admin_users table
  const adminUser = await prisma.admin_users.findUnique({
    where: { email: user.primaryEmail || user.email }
  });

  return !!adminUser;
}
```

#### Option 3: Custom User Roles

```typescript
// lib/stack-auth.ts
export async function getUserRole() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) return 'admin';

  const stackServerApp = await getStackServerApp();
  const user = await stackServerApp.getUser();

  if (!user) return null;

  // Get user roles from Stack Auth or database
  const roles = user.roles || [];
  return roles.includes('admin') ? 'admin' : 'user';
}

export async function isAdmin() {
  const role = await getUserRole();
  return role === 'admin';
}
```

---

## Protected Routes

### Middleware Protection

All `/admin/*` routes are automatically protected by middleware:

```typescript
// middleware.ts
if (request.nextUrl.pathname.startsWith('/admin')) {
  // Login page is public
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check authentication
  const user = await stackServerApp.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}
```

### Server-Side Protection

For API routes, use the helper functions:

```typescript
// app/api/admin/route.ts
import { getCurrentUser, isAdmin } from '@/lib/stack-auth';

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const adminCheck = await isAdmin();
  if (!adminCheck) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Proceed with admin logic
  return Response.json({ data: 'Admin data' });
}
```

### Client-Side Protection

Use the conditional user hook:

```typescript
// components/AdminOnly.tsx
'use client';

import { useConditionalUser } from '@/hooks/use-conditional-user';

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const user = useConditionalUser();

  if (!user) {
    return <div>Please log in to access this section</div>;
  }

  return <>{children}</>;
}
```

---

## Troubleshooting

### Issue: "Environment variable not found"

**Error**: `Stack Auth environment variables are not configured`

**Solution**:
1. Check that all three required variables are set in `.env.local`
2. Restart the development server
3. Verify variable names match exactly (case-sensitive)

### Issue: "Redirect loop on /admin/login"

**Cause**: Stack Auth callback URLs not properly configured

**Solution**:
1. Go to Stack Auth dashboard
2. Add your local/production URLs to allowed callbacks
3. Ensure URLs match exactly (including trailing slashes)

### Issue: "Authentication works in dev but not production"

**Cause**: Environment variables not set in production

**Solution**:
1. Check Vercel environment variables
2. Ensure all three Stack Auth variables are set for Production
3. Redeploy after adding variables

### Issue: "CORS errors during authentication"

**Cause**: Stack Auth origins not properly configured

**Solution**:
1. Add your domain to Stack Auth allowed origins
2. Include both `http://localhost:3000` and production URL
3. Ensure no trailing slashes in origin URLs

### Issue: "Admin check always returns false"

**Cause**: User object structure mismatch

**Solution**:
1. Log the user object to inspect its structure:
```typescript
const user = await stackServerApp.getUser();
console.log('User object:', JSON.stringify(user, null, 2));
```
2. Update admin check logic to match actual user object structure
3. Check both `user.primaryEmail` and `user.email` fields

---

## Testing Authentication

### Test Development Mode

```bash
# Start dev server
npm run dev

# Visit admin route (should work without login)
http://localhost:3000/admin
```

### Test Production Mode Locally

```bash
# Build production version
npm run build

# Start production server
NODE_ENV=production npm start

# Visit admin route (should redirect to login)
http://localhost:3000/admin
```

### Test Authentication Flow

1. Visit `/admin` while logged out
2. Should redirect to `/admin/login`
3. Click "Sign In" button
4. Complete Stack Auth flow
5. Should redirect back to `/admin`
6. Access granted to all admin routes

---

## Security Best Practices

### 1. Environment Variables

- ✅ Never commit `.env.local` files
- ✅ Use `.env.example` as template only
- ✅ Rotate secret keys periodically
- ✅ Use different keys for development and production

### 2. Admin Access

- ✅ Implement email whitelist or database admin check
- ✅ Log all admin actions for audit trail
- ✅ Use 2FA for admin accounts (via Stack Auth)
- ✅ Regularly review admin user list

### 3. Session Management

- ✅ Use secure, HTTP-only cookies
- ✅ Set appropriate session expiration
- ✅ Implement proper logout functionality
- ✅ Clear sensitive data on logout

### 4. API Protection

- ✅ Always verify authentication on server-side
- ✅ Don't rely solely on client-side checks
- ✅ Use proper HTTP status codes (401, 403)
- ✅ Implement rate limiting for admin APIs

---

## Support

For authentication issues:
- Stack Auth Docs: [docs.stack-auth.com](https://docs.stack-auth.com)
- GitHub Issues: [zoolyum-web-2.0](https://github.com/SakibBhai/zoolyum-web-2.0)
- Email: tech@zoolyum.com

---

**Last Updated:** March 24, 2026
