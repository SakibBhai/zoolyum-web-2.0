import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

// Extend the built-in session types
declare module "next-auth" {
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
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          throw new Error("Please enter both email and password");
        }

        try {
          // Database-based admin authentication
          const adminUser = await prisma.adminUser.findUnique({
            where: { email: credentials.email },
          });

          if (!adminUser) {
            console.error(`Admin user not found: ${credentials.email}`);
            throw new Error("Invalid email or password");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            adminUser.password
          );

          if (!isValidPassword) {
            console.error(`Invalid password for: ${credentials.email}`);
            throw new Error("Invalid email or password");
          }

          console.log(`Admin authenticated successfully: ${credentials.email}`);
          return {
            id: adminUser.id,
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        } finally {
          await prisma.$disconnect();
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
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
};

// Auth verification function for API routes
export async function verifyAuth(request: NextRequest) {
  const { getServerSession } = await import("next-auth/next");

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    return { success: true, user: session.user };
  } catch (error) {
    return { success: false, error: "Authentication failed" };
  }
}
