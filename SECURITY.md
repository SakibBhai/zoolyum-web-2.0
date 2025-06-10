# Security Setup Guide

## Environment Variables

### Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="your-neon-database-url-here"
```

### Generating NEXTAUTH_SECRET

For production, generate a secure secret:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Deployment Security

### Vercel Deployment

1. **Environment Variables**: Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `DATABASE_URL`

2. **Database URL**: Never commit database credentials to version control
   - Use Vercel's environment variables
   - For production, use a different database than development

### Security Headers

The middleware automatically adds these security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection

For admin routes, additional headers are added:
- `Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate`
- `Pragma: no-cache`
- `Expires: 0`

## Authentication Security

### Password Requirements

The system enforces strong password requirements:
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

### Rate Limiting

Signup attempts are rate-limited:
- Maximum 5 attempts per IP address
- 15-minute window
- Automatic reset after window expires

### Session Security

- Sessions are managed by NextAuth.js
- JWT tokens include user role for authorization
- Admin routes are protected by middleware
- Automatic redirect for unauthorized access

## Best Practices

### Development

1. **Never commit sensitive data**:
   - Use `.env.local` for secrets
   - Keep `.env` for non-sensitive defaults
   - Ensure `.gitignore` includes `.env*`

2. **Database Security**:
   - Use connection pooling
   - Enable SSL mode for database connections
   - Regularly rotate database credentials

3. **Code Security**:
   - Validate all user inputs
   - Use parameterized queries (Prisma handles this)
   - Hash passwords with bcrypt (cost factor 12)

### Production

1. **Environment Variables**:
   - Use strong, unique secrets
   - Set `NEXTAUTH_URL` to your production domain
   - Use production database with restricted access

2. **Monitoring**:
   - Monitor failed login attempts
   - Set up alerts for suspicious activity
   - Regularly review access logs

3. **Updates**:
   - Keep dependencies updated
   - Monitor security advisories
   - Regularly audit user permissions

## Admin User Management

### First Admin Setup

1. The first user to sign up becomes an admin automatically
2. Subsequent users require admin approval or invitation
3. Only existing admins can create new admin users

### Role Management

- `USER`: Standard user role
- `ADMIN`: Administrative privileges
- Role-based access control enforced at middleware level

## Troubleshooting

### Common Issues

1. **Authentication not working**:
   - Check `NEXTAUTH_SECRET` is set
   - Verify `NEXTAUTH_URL` matches your domain
   - Ensure database connection is working

2. **Admin access denied**:
   - Verify user has `ADMIN` role in database
   - Check middleware configuration
   - Clear browser cookies and try again

3. **Database connection issues**:
   - Verify `DATABASE_URL` is correct
   - Check network connectivity
   - Ensure SSL mode is properly configured

## Security Checklist

- [ ] `.env.local` created with all required variables
- [ ] Strong `NEXTAUTH_SECRET` generated
- [ ] Database credentials removed from version control
- [ ] Vercel environment variables configured
- [ ] First admin user created
- [ ] Security headers verified in browser dev tools
- [ ] Rate limiting tested
- [ ] Password requirements enforced
- [ ] Admin routes properly protected