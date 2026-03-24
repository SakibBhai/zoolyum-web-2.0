/**
 * NextAuth Configuration
 *
 * Authentication configuration using NextAuth.js v5 (beta)
 */

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

/**
 * Admin credentials for development
 * In production, use a database to store admin users
 */
const ADMIN_CREDENTIALS = {
  email: "admin@zoolyum.com",
  password: "admin123", // Change this in production!
}

/**
 * Admin email whitelist
 */
const ADMIN_EMAILS = [
  "admin@zoolyum.com",
  "sakib@zoolyum.com",
  // Add more admin emails here
]

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  console.error('❌ NEXTAUTH_SECRET is not set. Authentication will fail.')
  console.error('   Generate one with: openssl rand -base64 32')
  console.error('   Add it to Vercel: Settings → Environment Variables → NEXTAUTH_SECRET')
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
  console.error('❌ NEXTAUTH_URL is not set in production.')
  console.error('   Add it to Vercel: Settings → Environment Variables → NEXTAUTH_URL')
  console.error('   Value should be: https://your-domain.vercel.app')
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Credentials provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        console.log('[NextAuth] Authorize attempt:', { email: credentials?.email })

        // Development mode: Allow any credentials
        const isDevelopment = process.env.NODE_ENV === "development"

        if (isDevelopment) {
          // In development, accept any email/password
          const user = {
            id: "dev-user",
            email: (credentials?.email as string) || "admin@zoolyum.com",
            name: "Development Admin"
          }
          console.log('[NextAuth] Development mode: Returning user', user)
          return user
        }

        // Production: Validate credentials
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (
          email === ADMIN_CREDENTIALS.email &&
          password === ADMIN_CREDENTIALS.password
        ) {
          const user = {
            id: "admin-user",
            email: ADMIN_CREDENTIALS.email,
            name: "Admin User"
          }
          console.log('[NextAuth] Credentials valid: Returning user', user)
          return user
        }

        // Check if email is in admin whitelist (for OAuth)
        if (email && ADMIN_EMAILS.includes(email)) {
          const user = {
            id: `admin-${email}`,
            email: email,
            name: email.split("@")[0]
          }
          console.log('[NextAuth] Email whitelisted: Returning user', user)
          return user
        }

        console.log('[NextAuth] Authorization failed: Invalid credentials')
        return null
      }
    }),

    // Google OAuth (optional - configure in .env)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          })
        ]
      : []),

    // GitHub OAuth (optional - configure in .env)
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          })
        ]
      : [])
  ],

  callbacks: {
    /**
     * JWT callback - called when token is created/updated
     */
    async jwt({ token, user, account }) {
      console.log('[NextAuth] JWT callback:', { hasUser: !!user, hasToken: !!token })

      // Add user info to token
      if (user) {
        token.id = user.id
        token.email = user.email
        console.log('[NextAuth] Added user to token:', { id: token.id, email: token.email })
      }

      // Check if user is admin
      if (token.email) {
        token.isAdmin = ADMIN_EMAILS.includes(token.email as string)
        console.log('[NextAuth] Admin check:', { email: token.email, isAdmin: token.isAdmin })
      }

      return token
    },

    /**
     * Session callback - called when session is checked
     */
    async session({ session, token }) {
      console.log('[NextAuth] Session callback:', { hasSession: !!session, hasToken: !!token })

      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.isAdmin = token.isAdmin as boolean
        console.log('[NextAuth] Session data:', {
          id: session.user.id,
          email: session.user.email,
          isAdmin: session.user.isAdmin
        })
      }
      return session
    },

    /**
     * Sign-in callback - validate admin access
     */
    async signIn({ user, account }) {
      console.log('[NextAuth] Sign-in callback:', { email: user?.email })

      // In development, allow any user
      if (process.env.NODE_ENV === "development") {
        console.log('[NextAuth] Development mode: Allowing sign in')
        return true
      }

      // In production, check if email is in admin whitelist
      if (user.email) {
        const isAdmin = ADMIN_EMAILS.includes(user.email)
        console.log('[NextAuth] Production admin check:', { email: user.email, isAdmin })
        return isAdmin
      }

      console.log('[NextAuth] Sign-in denied: No email')
      return false
    }
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  // Configure cookies for production
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },

  // Enable debug mode temporarily for troubleshooting
  debug: true
})

/**
 * Helper function to get current session
 */
export async function getSession() {
  return await auth()
}

/**
 * Helper function to get current user
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

/**
 * Helper function to check if user is admin
 */
export async function isAdmin() {
  const session = await getSession()

  // Development bypass
  if (process.env.NODE_ENV === "development") {
    return true
  }

  // Check if session exists and user is admin
  if (!session?.user) {
    return false
  }

  return session.user.isAdmin === true
}

/**
 * Require admin authentication
 * Throws error if not authenticated as admin
 */
export async function requireAdmin() {
  const adminCheck = await isAdmin()

  if (!adminCheck) {
    throw new Error("Unauthorized: Admin access required")
  }
}
