# Stack Auth Setup Quick Guide

Step-by-step guide to configure Stack Auth for the Zoolyum Web admin portal.

---

## Prerequisites

- Stack Auth account (sign up at [stack-auth.com](https://stack-auth.com))
- Access to domain/DNS settings (for production)
- Vercel account (for production deployment)

---

## Step 1: Create Stack Auth Project

1. Go to [stack-auth.com](https://stack-auth.com) and sign in
2. Click **"New Project"**
3. Enter project details:
   - **Project Name**: `Zoolyum Web Admin`
   - **Description**: `Admin portal for Zoolyum Web application`
   - **Environment**: `Production`
4. Click **"Create Project"**

---

## Step 2: Configure Authentication Methods

In your Stack Auth dashboard:

1. Navigate to **Authentication** → **Methods**
2. Enable desired auth methods (recommended):
   - ✅ **Email/Password** - Basic authentication
   - ✅ **Magic Link** - Passwordless email authentication
   - ✅ **Google OAuth** - Social login
   - ✅ **GitHub OAuth** - Developer-friendly login

3. For each method, follow the setup wizard:
   - Enter callback URLs (see Step 3)
   - Configure OAuth apps (for Google/GitHub)
   - Customize branding (optional)

---

## Step 3: Configure URLs

### Allowed Callback URLs

Add these URLs in **Settings** → **Allowed Callback URLs**:

```
http://localhost:3000/handler/callback
https://zoolyum-web-2-0.vercel.app/handler/callback
```

### Allowed Logout URLs

Add these URLs in **Settings** → **Allowed Logout URLs**:

```
http://localhost:3000/
https://zoolyum-web-2-0.vercel.app/
```

### Allowed Origins

Add these URLs in **Settings** → **Allowed Origins**:

```
http://localhost:3000
https://zoolyum-web-2-0.vercel.app
```

### Handler URL

Add this in **Settings** → **Handler URL**:

```
Development: http://localhost:3000/handler
Production: https://zoolyum-web-2-0.vercel.app/handler
```

---

## Step 4: Get API Keys

Navigate to **Settings** → **API Keys** and copy:

1. **Project ID**
   ```
   Found at: Settings → General → Project ID
   Format: project_xxxxxxxxxxxxx
   ```

2. **Publishable Client Key**
   ```
   Found at: Settings → API Keys → Publishable Client Key
   Format: pk_xxxxxxxxxxxxx
   Starts with: pk_
   ```

3. **Secret Server Key**
   ```
   Found at: Settings → API Keys → Secret Server Key
   Format: sk_xxxxxxxxxxxxx
   Starts with: sk_
   ```

---

## Step 5: Configure Environment Variables

### Local Development (`.env.local`)

```env
# Stack Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=project_xxxxxxxxxxxxx
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pk_xxxxxxxxxxxxx
STACK_SECRET_SERVER_KEY=sk_xxxxxxxxxxxxx

# Stack Auth Handler URL
NEXT_PUBLIC_STACK_URL=http://localhost:3000/handler
```

### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `NEXT_PUBLIC_STACK_PROJECT_ID`
   - **Value**: Your project ID
   - **Environment**: Production, Preview, Development

4. Repeat for all three variables
5. **Important**: Redeploy your application after adding variables

---

## Step 6: Configure OAuth Providers (Optional)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new OAuth 2.0 client ID
3. Add authorized redirect URI:
   ```
   https://api.stack-auth.com/api/v1/projects/YOUR_PROJECT_ID/connect/google/callback
   ```
4. Copy Client ID and Client Secret to Stack Auth

### GitHub OAuth

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Register a new OAuth application
3. Set Authorization callback URL:
   ```
   https://api.stack-auth.com/api/v1/projects/YOUR_PROJECT_ID/connect/github/callback
   ```
4. Copy Client ID and Client Secret to Stack Auth

---

## Step 7: Test Authentication

### Test in Development

```bash
# Start dev server
npm run dev

# Visit admin portal
open http://localhost:3000/admin

# Should redirect to login page
# Click "Sign In" button
# Complete auth flow
# Should redirect back to /admin/dashboard
```

### Test in Production

```bash
# Deploy to Vercel
vercel --prod

# Visit production admin portal
open https://zoolyum-web-2-0.vercel.app/admin

# Should redirect to Stack Auth login
# Complete authentication
# Should redirect to dashboard
```

---

## Step 8: Add Admin Users

### Option 1: Email Whitelist (Recommended for Simple Setup)

Edit [`lib/admin-utils.ts`](../lib/admin-utils.ts):

```typescript
const ADMIN_EMAILS: string[] = [
  'admin@zoolyum.com',
  'your-email@example.com',  // Add your email
  // Add more admin emails here
]
```

### Option 2: Database Admin Users (Advanced)

Use the `admin_users` table:

```sql
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES (
  'your-email@example.com',
  'Your Name',
  'admin',
  true
);
```

---

## Step 9: Customize Login Page (Optional)

Edit [`app/admin/login/page.tsx`](../app/admin/login/page.tsx) to customize:
- Branding/logo
- Colors (currently uses `#FF5001` accent)
- Messaging
- Security notices

---

## Step 10: Enable Production Features

Once Stack Auth is working in development:

1. **Enable 2FA** (Two-Factor Authentication):
   - Go to Stack Auth dashboard
   - Navigate to Authentication → 2FA
   - Enable for admin accounts

2. **Set Session Timeout**:
   - Go to Settings → Session
   - Set timeout duration (recommended: 7 days)

3. **Enable Audit Logging**:
   - Go to Settings → Logs
   - Enable login/logout tracking

4. **Configure Email Templates** (for magic links):
   - Go to Settings → Emails
   - Customize email templates
   - Add your branding

---

## Troubleshooting

### Issue: "Redirect loop"

**Cause**: Callback URLs not configured correctly

**Fix**:
1. Check Stack Auth allowed callback URLs
2. Ensure exact match (no trailing slashes)
3. Check NEXT_PUBLIC_STACK_URL in environment

### Issue: "Environment variable not found"

**Cause**: Missing or misspelled environment variable

**Fix**:
1. Check `.env.local` file exists
2. Verify all 3 variables are set
3. Restart dev server after changes
4. Check Vercel environment variables for production

### Issue: "CORS errors"

**Cause**: Origins not configured in Stack Auth

**Fix**:
1. Add your domain to Stack Auth allowed origins
2. Include both http://localhost:3000 and production URL
3. Wait 1-2 minutes for changes to propagate

### Issue: "Admin check fails"

**Cause**: Email not in admin whitelist

**Fix**:
1. Check browser console for user email
2. Add email to ADMIN_EMAILS in `lib/admin-utils.ts`
3. Alternatively, implement database admin check

---

## Best Practices

### Security

- ✅ Use environment variables for all keys
- ✅ Never commit `.env.local` to git
- ✅ Rotate secret keys periodically
- ✅ Enable 2FA for admin accounts
- ✅ Use HTTPS in production (enforced by Vercel)

### User Management

- ✅ Keep admin email list updated
- ✅ Remove access for former employees
- ✅ Use email whitelist for small teams
- ✅ Use database for larger organizations

### Monitoring

- ✅ Check Stack Auth dashboard regularly
- ✅ Review login logs for suspicious activity
- ✅ Set up alerts for failed login attempts
- ✅ Monitor admin user count

---

## Next Steps

After completing Stack Auth setup:

1. ✅ Read [Authentication Guide](./AUTHENTICATION.md) for detailed info
2. ✅ Review [middleware.ts](../middleware.ts) for route protection
3. ✅ Test all admin routes for proper authentication
4. ✅ Set up admin user management process
5. ✅ Configure production environment variables in Vercel

---

## Support

For Stack Auth-specific issues:
- Stack Auth Docs: [docs.stack-auth.com](https://docs.stack-auth.com)
- Stack Auth Discord: [discord.gg/stack-auth](https://discord.gg/stack-auth)

For Zoolyum Web issues:
- GitHub: [github.com/SakibBhai/zoolyum-web-2.0](https://github.com/SakibBhai/zoolyum-web-2.0)
- Email: tech@zoolyum.com

---

**Last Updated:** March 24, 2026
