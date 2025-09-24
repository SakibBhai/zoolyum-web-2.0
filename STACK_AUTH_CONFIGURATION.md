# Stack Auth Configuration Guide

## Overview

This project uses a dual authentication system:
- **Local Development**: Mock authentication for easy development
- **Production**: Stack Auth with real authentication

## Local Development Setup

The `.env.local` file contains development Stack Auth keys that enable local testing:

```env
NEXT_PUBLIC_STACK_PROJECT_ID="8e1b2d94-6841-419a-bbc4-4c6714a3c131"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="pck_wcndqtfmy26fb1gc96vmahzwbty3rktg1pdgyr71k9rzr"
STACK_SECRET_SERVER_KEY="ssk_b0qma9yga0sv861d36pphswj4mdcs5agm4yh8kqmy3g58"
```

## Production Deployment (Vercel)

### Step 1: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables with **Production** scope:

```env
NEXT_PUBLIC_STACK_PROJECT_ID=58b90d93-9071-4155-9262-5351fcbed848
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_gpwev442v0rmkyevxm17py8n3patf73w2nfvremf0r6hr
STACK_SECRET_SERVER_KEY=ssk_47x6c3w8cmrkvpx8e0adaf16fyhj2fc1edv5jrxvsstvg
```

### Step 2: Configure Stack Auth Dashboard

1. Log into your Stack Auth dashboard
2. Navigate to your production project: `58b90d93-9071-4155-9262-5351fcbed848`
3. Configure the following settings:

**Allowed Domains:**
- `https://www.zoolyum.com`
- `https://zoolyum.com`
- `https://zoolyum-web-2-0.vercel.app` (if using Vercel default domain)

**Redirect URLs:**
- `https://www.zoolyum.com/handler/sign-in`
- `https://www.zoolyum.com/handler/sign-out`
- `https://www.zoolyum.com/handler/sign-up`

### Step 3: Set Up Admin User

1. In Stack Auth dashboard, create an admin user account
2. Use the email you want for admin access
3. Verify the email address

### Step 4: Deploy and Test

1. Deploy your application to Vercel
2. Visit `https://www.zoolyum.com/admin`
3. You should be redirected to Stack Auth sign-in
4. Sign in with your admin credentials
5. You should be redirected back to the admin dashboard

## Authentication Flow

### Development Mode
- Uses mock authentication (`useConditionalUser` returns `DEV_USER`)
- No Stack Auth provider is loaded
- Admin access works immediately

### Production Mode
- Uses Stack Auth with real authentication
- `ConditionalStackProvider` loads Stack Auth components
- `useConditionalUser` integrates with Stack Auth's `useUser` hook
- Users must sign in through Stack Auth

## Troubleshooting

### Admin Access Issues

1. **Check Environment Variables**: Ensure all Stack Auth variables are set in Vercel
2. **Verify Domain Configuration**: Make sure your domain is allowed in Stack Auth dashboard
3. **Check Redirect URLs**: Ensure redirect URLs match your domain
4. **Admin User Setup**: Verify admin user exists and email is verified

### Development Issues

1. **Mock Auth Not Working**: Check that you're running on localhost with development environment
2. **Stack Auth Loading in Dev**: Verify `NODE_ENV=development` is set

## Environment Detection

The system detects environment based on:
- `NODE_ENV` environment variable
- Hostname detection (localhost, 127.0.0.1)
- Port detection (3000, 3001, 3002)

## Security Notes

- Production keys are never committed to version control
- Development keys are safe to commit as they're for local development only
- Stack Auth handles all authentication security in production
- Admin access is controlled through Stack Auth user management