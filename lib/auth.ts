import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error('Missing credentials');
          throw new Error('Please enter both email and password');
        }

        try {
          // Simple hardcoded admin authentication (replace with your preferred auth method)
          const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
          const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

          if (credentials.email !== adminEmail || credentials.password !== adminPassword) {
            console.error(`Invalid credentials for: ${credentials.email}`);
            throw new Error('Invalid email or password');
          }

          console.log(`Admin authenticated successfully: ${credentials.email}`);
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin',
            role: 'ADMIN',
          }
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null;
        session.user.email = token.email as string | null;
        session.user.role = token.role as string | null;
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token
    },
  },
}