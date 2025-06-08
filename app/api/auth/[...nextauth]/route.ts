import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Use the centralized auth options from lib/auth.ts
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };