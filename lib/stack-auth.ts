import { NextRequest } from "next/server";
import { getStackServerApp } from "./stack-server";

/**
 * Verify if the user is authenticated using Stack Auth
 * @param request - The Next.js request object
 * @returns Promise<{ isAuthenticated: boolean; user?: any }>
 */
export async function verifyStackAuth(request?: NextRequest) {
  // Development bypass
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.log('Development mode: Bypassing Stack Auth verification');
    return {
      isAuthenticated: true,
      user: {
        id: 'dev-user',
        email: 'admin@zoolyum.com',
        displayName: 'Development Admin'
      }
    };
  }
  
  try {
    const stackServerApp = await getStackServerApp();
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
  // Development bypass
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return {
      id: 'dev-user',
      email: 'admin@zoolyum.com',
      displayName: 'Development Admin'
    };
  }
  
  try {
    const stackServerApp = await getStackServerApp();
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
  // Development bypass
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return true; // Always admin in development
  }
  
  try {
    const stackServerApp = await getStackServerApp();
    const user = await stackServerApp.getUser();
    return !!user; // For now, any authenticated user is admin
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}