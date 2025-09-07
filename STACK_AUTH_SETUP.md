# Stack Auth Setup Guide

This guide will help you set up Stack Auth for authentication in your Zoolyum application.

## 🚀 Quick Setup

### 1. Create a Stack Auth Account

1. Go to [https://app.stack-auth.com/](https://app.stack-auth.com/)
2. Sign up for a free account or log in if you already have one
3. Create a new project or select an existing one

### 2. Get Your API Keys

1. In your Stack Auth dashboard, go to your project settings
2. Navigate to the **API Keys** section
3. Copy the following values:
   - **Project ID** (from project settings)
   - **Publishable Client Key** (from API Keys)
   - **Secret Server Key** (from API Keys)

### 3. Configure Environment Variables

Update your `.env` file with the actual values:

```env
# Stack Auth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID="your-actual-project-id-here"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-actual-publishable-key-here"
STACK_SECRET_SERVER_KEY="your-actual-secret-key-here"
STACK_INTERFACE_TYPE="admin-interface"
```

### 4. Configure Your Stack Auth Project

In your Stack Auth dashboard:

1. **Set up your domain**:
   - Development: `http://localhost:3000`
   - Production: Your actual domain

2. **Configure redirect URLs**:
   - Sign-in redirect: `http://localhost:3000/admin/dashboard`
   - Sign-out redirect: `http://localhost:3000/admin/login`

3. **Enable email authentication** (recommended)

4. **Set up admin users**:
   - Add your email as an admin user
   - Configure user roles if needed

## 🔧 Development Mode

The application includes development mode bypasses:

- When running on `localhost:3000`, authentication is bypassed
- A mock admin user is created automatically
- You can access admin routes without Stack Auth setup

## 🚨 Production Requirements

For production deployment:

1. **All environment variables must be set** with real values
2. **Domain must be configured** in Stack Auth dashboard
3. **SSL/HTTPS is required** for production
4. **Admin users must be properly configured**

## 🛠️ Troubleshooting

### Error: "Missing Stack Auth environment variables"

- Check that all three environment variables are set in your `.env` file
- Ensure there are no extra spaces or quotes in the values
- Restart your development server after updating environment variables

### Error: "Invalid project ID"

- Verify the Project ID matches exactly from your Stack Auth dashboard
- Check for typos or extra characters

### Authentication not working

1. Check your Stack Auth dashboard for:
   - Correct domain configuration
   - Proper redirect URLs
   - Active project status

2. Verify environment variables are loaded:
   ```bash
   npm run dev
   # Check console for Stack Auth configuration messages
   ```

### Development mode issues

- Clear browser cookies and localStorage
- Restart the development server
- Check browser console for errors

## 📚 Additional Resources

- [Stack Auth Documentation](https://docs.stack-auth.com/)
- [Stack Auth React Guide](https://docs.stack-auth.com/getting-started/setup/react)
- [Stack Auth API Reference](https://docs.stack-auth.com/rest-api/overview)

## 🔐 Security Notes

- **Never commit your secret keys** to version control
- Use different projects for development and production
- Regularly rotate your API keys
- Enable two-factor authentication on your Stack Auth account

---

**Need help?** Check the [Stack Auth Discord](https://discord.gg/stack-auth) or create an issue in this repository.