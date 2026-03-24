# NextAuth Setup Complete

Your admin authentication is now using **NextAuth.js** instead of Stack Auth.

---

## ✅ What's Been Set Up

### 1. NextAuth Configuration
- **File**: [`lib/next-auth.ts`](lib/next-auth.ts)
- Email/password authentication
- Google OAuth (optional)
- GitHub OAuth (optional)
- Admin email whitelist
- Development bypass

### 2. API Route
- **File**: [`app/api/auth/[...nextauth]/route.ts`](app/api/auth/[...nextauth]/route.ts)
- Handles all authentication endpoints

### 3. Updated Files
- **Middleware**: Now uses NextAuth for authentication
- **Login Page**: Beautiful login form with email/password
- **Admin Layout**: Uses NextAuth session hooks
- **Providers**: Wraps app with SessionProvider

---

## 🚀 How It Works

### Development Mode (Current)
```bash
Visit: http://localhost:3000/admin
→ Auto-redirects to dashboard (bypass)
```

### Production Mode
```bash
Visit: http://localhost:3000/admin
→ Redirects to /admin/login
→ Enter email & password
→ Authenticated → Dashboard
```

---

## 🔑 Default Credentials (For Testing)

In production, the default credentials are:
- **Email**: `admin@zoolyum.com`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change these in `lib/next-auth.ts` before going live!

---

## ⚙️ Configuration

### Update Admin Emails

Edit [`lib/next-auth.ts`](lib/next-auth.ts):

```typescript
const ADMIN_EMAILS = [
  "admin@zoolyum.com",
  "your-email@example.com",  // Add yours here
]
```

### Change Default Password

Edit [`lib/next-auth.ts`](lib/next-auth.ts):

```typescript
const ADMIN_CREDENTIALS = {
  email: "admin@zoolyum.com",
  password: "your-secure-password",  // Change this!
}
```

### Set NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

Then add to `.env.local`:

```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

---

## 🔌 Optional: OAuth Providers

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### GitHub OAuth

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Add to `.env.local`:

```env
NEXT_PUBLIC_GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

---

## 🧪 Testing

### Test in Development

1. Visit `http://localhost:3000/admin`
2. Should auto-redirect to dashboard (dev bypass)

### Test Production Mode Locally

1. Set environment variable:
   ```bash
   NODE_ENV=production npm run build
   NODE_ENV=production npm start
   ```

2. Visit `http://localhost:3000/admin`
3. Should show login page
4. Enter credentials:
   - Email: `admin@zoolyum.com`
   - Password: `admin123`
5. Should redirect to dashboard

---

## 📊 NextAuth Endpoints

NextAuth automatically creates these endpoints:

- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get current session
- `/api/auth/providers` - Available providers
- `/api/auth/callback` - OAuth callbacks

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change default password in `lib/next-auth.ts`
- [ ] Generate and set `NEXTAUTH_SECRET`
- [ ] Add your email to `ADMIN_EMAILS`
- [ ] Remove any test emails from whitelist
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Test authentication flow
- [ ] Set up OAuth providers (optional)

---

## 📚 NextAuth vs Stack Auth

| Feature | NextAuth | Stack Auth |
|---------|----------|------------|
| Setup | ✅ Simple | ⚠️ Complex |
| Providers | ✅ Multiple | ✅ Multiple |
| Self-hosted | ✅ Yes | ❌ No |
| Customizable | ✅ High | ⚠️ Medium |
| Documentation | ✅ Excellent | ✅ Good |
| Free | ✅ Yes | ✅ Yes |

---

## 🆘 Troubleshooting

### Issue: "Session not found"

**Fix**: Make sure `NEXTAUTH_SECRET` is set in `.env.local`

### Issue: "Cannot read property of undefined"

**Fix**: Restart the dev server after installing NextAuth

### Issue: Login page not showing

**Fix**:
1. Check you're not in development mode
2. Set `NODE_ENV=production`
3. Rebuild and restart

### Issue: "Invalid email or password"

**Fix**: Check credentials in `lib/next-auth.ts` match what you're entering

---

## 📖 Resources

- [NextAuth Docs](https://next-auth.js.org)
- [NextAuth GitHub](https://github.com/nextauthjs/next-auth)
- [Credentials Provider](https://next-auth.js.org/providers/credentials)
- [OAuth Guide](https://next-auth.js.org/providers/oauth)

---

**Server Status**: ✅ Running on http://localhost:3000
**Authentication**: NextAuth.js v5 (beta)
**Ready to Use**: Yes!

---

**Last Updated**: March 24, 2026
