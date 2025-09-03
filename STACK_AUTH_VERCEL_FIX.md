# Fix Stack Auth Console Error on Vercel

## Problem
After deploying to Vercel, you see this console error:
```
Uncaught Error: Welcome to Stack Auth! It seems that you haven't provided a project ID.
```

## Root Cause
The Stack Auth environment variables are not configured in your Vercel deployment, causing the authentication system to fail in production.

## Solution Steps

### Step 1: Set Up Stack Auth Project

1. **Visit Stack Auth Dashboard**:
   - Go to [https://app.stack-auth.com/](https://app.stack-auth.com/)
   - Sign up or log in to your account

2. **Create or Select Project**:
   - Click "Create New Project" or select existing project
   - Choose a project name (e.g., "Zoolyum Web")
   - Select your preferred configuration

3. **Get API Keys**:
   - Navigate to your project settings
   - Copy the following values:
     - `Project ID`
     - `Publishable Client Key`
     - `Secret Server Key`

### Step 2: Configure Vercel Environment Variables

1. **Access Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Navigate to your project
   - Click on "Settings" tab

2. **Add Environment Variables**:
   - Go to "Environment Variables" section
   - Add these three variables:

   ```bash
   STACK_PROJECT_ID=your-actual-project-id
   STACK_PUBLISHABLE_CLIENT_KEY=your-actual-publishable-key
   STACK_SECRET_SERVER_KEY=your-actual-secret-key
   ```

3. **Set Variable Scopes**:
   - Select "Production" for all three variables
   - Optionally select "Preview" if you want them in preview deployments

### Step 3: Redeploy Application

1. **Trigger Redeploy**:
   - Go to "Deployments" tab in Vercel
   - Click "Redeploy" on your latest deployment
   - Or push a new commit to trigger automatic deployment

2. **Verify Deployment**:
   - Wait for deployment to complete
   - Check deployment logs for any errors

### Step 4: Test the Fix

1. **Clear Browser Cache**:
   - Hard refresh your deployed site (Ctrl+Shift+R)
   - Or open in incognito/private mode

2. **Check Console**:
   - Open browser developer tools
   - Look for the Stack Auth error - it should be gone
   - Admin authentication should now work properly

## Verification Checklist

- [ ] Stack Auth project created at app.stack-auth.com
- [ ] All three environment variables added to Vercel
- [ ] Variables set for "Production" scope
- [ ] Application redeployed successfully
- [ ] Console error no longer appears
- [ ] Admin login functionality works

## Additional Notes

### Development vs Production
- **Development**: The app uses mock authentication when Stack Auth variables are missing
- **Production**: Stack Auth variables are required, or the app will throw errors

### Security Best Practices
- Never commit Stack Auth keys to your repository
- Use different Stack Auth projects for development and production
- Regularly rotate your secret keys

### Common Mistakes
- **Wrong variable names**: Ensure exact spelling (case-sensitive)
- **Trailing spaces**: Remove any extra spaces in variable values
- **Wrong scope**: Make sure variables are set for "Production"
- **Not redeploying**: Environment variable changes require a redeploy

## Troubleshooting

If the error persists after following these steps:

1. **Check Vercel Logs**:
   - Go to "Functions" tab in Vercel dashboard
   - Look for any Stack Auth related errors

2. **Verify Variable Values**:
   - Double-check that all three variables are set correctly
   - Ensure no typos in variable names or values

3. **Test Locally**:
   - Add the same variables to your local `.env` file
   - Test that authentication works locally

4. **Contact Support**:
   - Stack Auth: [Stack Auth Documentation](https://docs.stack-auth.com/)
   - Vercel: [Vercel Support](https://vercel.com/support)

## Related Files
- `stack.tsx` - Stack Auth configuration
- `STACK_AUTH_SETUP.md` - Detailed Stack Auth setup guide
- `VERCEL_DEPLOYMENT.md` - Complete Vercel deployment guide