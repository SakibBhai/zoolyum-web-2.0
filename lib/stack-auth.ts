import { stackServerApp } from "../stack";
import { NextRequest } from "next/server";

/**
 * Verify if the user is authenticated using Stack Auth
 * @param request - The Next.js request object
 * @returns Promise<{ isAuthenticated: boolean; user?: any }>
 */
export async function verifyStackAuth(request?: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    return {
      isAuthenticated: !!user,
      user: user || null
    };
  } catch (error) {
    console.error('Stack Auth verification error:', error);
    return {
      isAuthenticated: false,
      user: null
    };
  }
}

/**
 * Get the current authenticated user
 * @returns Promise<User | null>
 */
export async function getCurrentUser() {
  try {
    const user = await stackServerApp.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user has admin privileges
 * For now, any authenticated user is considered admin
 * In a real app, you'd check user roles/permissions
 * @returns Promise<boolean>
 */
export async function isAdmin() {
  try {
    const user = await stackServerApp.getUser();
    return !!user; // For now, any authenticated user is admin
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}