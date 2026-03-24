# Admin Authentication Setup Checklist

Quick checklist to set up authentication for the Zoolyum Web admin portal.

---

## 🚀 Quick Start (5 minutes)

### ✅ Step 1: Development Setup

- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:3000/admin`
- [ ] **Result**: Should access admin dashboard immediately (no auth required)

### ✅ Step 2: Test Admin Routes

- [ ] Visit `/admin/dashboard`
- [ ] Visit `/admin/blog-posts`
- [ ] Visit `/admin/campaigns`
- [ ] Visit `/admin/settings`
- [ ] **Result**: All routes should work without login

---

## 🔒 Production Setup (30 minutes)

### ✅ Step 3: Create Stack Auth Account

- [ ] Go to [stack-auth.com](https://stack-auth.com)
- [ ] Sign up for account
- [ ] Click "New Project"
- [ ] Name: "Zoolyum Web Admin"
- [ ] Click "Create Project"

### ✅ Step 4: Configure URLs in Stack Auth

- [ ] Go to Settings → Allowed Callback URLs
- [ ] Add: `http://localhost:3000/handler/callback`
- [ ] Add: `https://your-domain.vercel.app/handler/callback`
- [ ] Go to Allowed Logout URLs
- [ ] Add: `http://localhost:3000/`
- [ ] Add: `https://your-domain.vercel.app/`
- [ ] Go to Allowed Origins
- [ ] Add: `http://localhost:3000`
- [ ] Add: `https://your-domain.vercel.app`

### ✅ Step 5: Get API Keys

- [ ] Go to Settings → API Keys
- [ ] Copy Project ID → `NEXT_PUBLIC_STACK_PROJECT_ID`
- [ ] Copy Publishable Client Key → `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
- [ ] Copy Secret Server Key → `STACK_SECRET_SERVER_KEY`

### ✅ Step 6: Configure Local Environment

Create `.env.local`:

```env
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-publishable-key
STACK_SECRET_SERVER_KEY=your-secret-key
```

- [ ] Add Project ID
- [ ] Add Publishable Client Key
- [ ] Add Secret Server Key
- [ ] Save `.env.local`
- [ ] Restart dev server

### ✅ Step 7: Add Admin Emails

Edit `lib/admin-utils.ts`:

```typescript
const ADMIN_EMAILS: string[] = [
  'admin@zoolyum.com',
  'your-email@example.com',  // Add yours here
]
```

- [ ] Open `lib/admin-utils.ts`
- [ ] Add your email to `ADMIN_EMAILS` array
- [ ] Save file

### ✅ Step 8: Test Stack Auth Locally

- [ ] Run `npm run dev`
- [ ] Visit `http://localhost:3000/admin`
- [ ] Should see login page with "Production Environment" badge
- [ ] Click "Sign In with Stack Auth"
- [ ] Complete authentication
- [ ] Should redirect to `/admin/dashboard`
- [ ] **Result**: Authenticated and access granted

### ✅ Step 9: Configure Vercel Environment

- [ ] Go to Vercel project dashboard
- [ ] Go to Settings → Environment Variables
- [ ] Add `NEXT_PUBLIC_STACK_PROJECT_ID` (Production, Preview, Development)
- [ ] Add `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY` (Production, Preview, Development)
- [ ] Add `STACK_SECRET_SERVER_KEY` (Production only)
- [ ] Save all variables
- [ ] Redeploy application

### ✅ Step 10: Deploy to Production

- [ ] Push code to GitHub
- [ ] Wait for Vercel deployment
- [ ] Visit `https://your-domain.vercel.app/admin`
- [ ] Should redirect to Stack Auth login
- [ ] Complete authentication
- [ ] Should access admin dashboard
- [ ] **Result**: Production authentication working!

---

## 🎯 Optional Enhancements

### 📱 OAuth Providers

- [ ] Configure Google OAuth (optional)
- [ ] Configure GitHub OAuth (optional)
- [ ] Test OAuth login flow

### 🔐 Advanced Security

- [ ] Enable 2FA in Stack Auth
- [ ] Set session timeout
- [ ] Enable audit logging
- [ ] Configure email templates

### 👥 User Management

- [ ] Add more admin emails
- [ ] Implement database admin check
- [ ] Create role-based access
- [ ] Build admin user management UI

---

## 🧪 Testing Checklist

### Development Mode

- [ ] Start dev server (`npm run dev`)
- [ ] Visit `/admin`
- [ ] Verify auto-access (no login)
- [ ] Check console logs for "Development mode"
- [ ] Test all admin routes

### Production Mode (Local)

- [ ] Set `NODE_ENV=production`
- [ ] Run `npm run build && npm start`
- [ ] Visit `/admin`
- [ ] Verify redirect to login
- [ ] Complete Stack Auth flow
- [ ] Verify access granted

### Production Mode (Vercel)

- [ ] Deploy to Vercel
- [ ] Visit production `/admin`
- [ ] Verify redirect to login
- [ ] Complete Stack Auth flow
- [ ] Verify access granted
- [ ] Test on mobile device
- [ ] Test in different browsers

### API Routes

- [ ] Test protected API endpoint without auth → Should get 401
- [ ] Test protected API endpoint with auth → Should get data
- [ ] Test admin API endpoint with non-admin email → Should get 403
- [ ] Test admin API endpoint with admin email → Should get data

---

## 🔍 Troubleshooting

### Issue: Development mode asks for login

**Checklist**:
- [ ] Verify hostname is `localhost` or `127.0.0.1`
- [ ] Check port is `3000`, `3001`, or `3002`
- [ ] Verify `NODE_ENV` is not set to `production`

### Issue: Production mode allows anyone

**Checklist**:
- [ ] Verify email is added to `ADMIN_EMAILS` in `lib/admin-utils.ts`
- [ ] Check email spelling (case-insensitive)
- [ ] Restart application after changes
- [ ] Check browser console for errors

### Issue: Stack Auth redirect loop

**Checklist**:
- [ ] Verify callback URLs in Stack Auth dashboard
- [ ] Check for trailing slashes in URLs
- [ ] Ensure `NEXT_PUBLIC_STACK_URL` is set correctly
- [ ] Wait 1-2 minutes for Stack Auth changes to propagate

### Issue: Environment variables not working

**Checklist**:
- [ ] Verify `.env.local` file exists
- [ ] Check variable names match exactly (case-sensitive)
- [ ] Restart dev server after adding variables
- [ ] Check Vercel environment variables for production
- [ ] Redeploy after adding production variables

### Issue: CORS errors

**Checklist**:
- [ ] Verify domain is added to Stack Auth allowed origins
- [ ] Check for typos in origin URLs
- [ ] Ensure no trailing slashes in origins
- [ ] Check CORS headers in middleware

---

## 📚 Documentation Checklist

- [ ] Read [AUTHENTICATION.md](./AUTHENTICATION.md) - Complete guide
- [ ] Read [STACK-AUTH-SETUP.md](./STACK-AUTH-SETUP.md) - Stack Auth setup
- [ ] Read [AUTHENTICATION-ARCHITECTURE.md](./AUTHENTICATION-ARCHITECTURE.md) - Visual diagrams
- [ ] Read [AUTHENTICATION-SUMMARY.md](./AUTHENTICATION-SUMMARY.md) - Setup summary
- [ ] Bookmark [Stack Auth Docs](https://docs.stack-auth.com)

---

## ✅ Final Verification

### Before Going Live

- [ ] All development tests pass
- [ ] Stack Auth account created
- [ ] Environment variables configured
- [ ] Admin emails added to whitelist
- [ ] Local Stack Auth test successful
- [ ] Vercel environment variables set
- [ ] Production deployment successful
- [ ] Production authentication tested
- [ ] Backup of environment variables created
- [ ] Team members trained on login process

### Post-Deployment

- [ ] Monitor authentication logs
- [ ] Check for any login failures
- [ ] Verify all admin routes work
- [ ] Test with different admin users
- [ ] Document any custom configurations
- [ ] Set up monitoring alerts (optional)

---

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting section](AUTHENTICATION.md#troubleshooting) in the main guide
2. Review [Stack Auth documentation](https://docs.stack-auth.com)
3. Check GitHub issues: [zoolyum-web-2.0](https://github.com/SakibBhai/zoolyum-web-2.0)
4. Email: tech@zoolyum.com

---

## 📝 Notes

- Development mode bypasses authentication completely
- Production mode requires Stack Auth setup
- Admin access is controlled via email whitelist in `lib/admin-utils.ts`
- All `/admin/*` routes are automatically protected
- API routes must call `verifyAdminAccess()` for protection

---

**Setup Completed**: [Date]

**Setup By**: [Your Name]

**Environment**: [Development/Production]

---

**Last Updated:** March 24, 2026
