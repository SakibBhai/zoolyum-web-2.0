/**
 * Admin Utilities
 *
 * Helper functions for admin user management and authentication.
 */

import { getCurrentUser } from './stack-auth'

/**
 * Admin email whitelist
 *
 * Add email addresses that should have admin access.
 * This is the simplest way to control admin access.
 */
const ADMIN_EMAILS: string[] = [
  'admin@zoolyum.com',
  'sakib@zoolyum.com',
  // Add more admin emails here as needed
]

/**
 * Check if current user is an admin
 *
 * This function checks:
 * 1. Development mode (always returns true)
 * 2. Production mode (validates against admin email whitelist)
 *
 * @returns Promise<boolean> - True if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  // Development bypass
  if (process.env.NODE_ENV === 'development') {
    console.log('Admin check: Development mode - granting access')
    return true
  }

  try {
    const user = await getCurrentUser()

    if (!user) {
      console.log('Admin check: No user found')
      return false
    }

    // Get user email (Stack Auth uses different properties)
    const userEmail = user.primaryEmail ||
                      (user as any).email ||
                      user.account?.primaryEmail

    if (!userEmail) {
      console.log('Admin check: User has no email')
      return false
    }

    // Check if email is in admin whitelist
    const isAdminUser = ADMIN_EMAILS.includes(userEmail.toLowerCase())

    if (isAdminUser) {
      console.log(`Admin check: ${userEmail} is admin`)
    } else {
      console.log(`Admin check: ${userEmail} is not admin`)
    }

    return isAdminUser
  } catch (error) {
    console.error('Admin check error:', error)
    return false
  }
}

/**
 * Require admin access
 *
 * Use this function in API routes to require admin access.
 * Throws an error if user is not admin.
 *
 * @throws Error if user is not admin
 * @returns Promise<void>
 */
export async function requireAdmin(): Promise<void> {
  const adminCheck = await isAdmin()

  if (!adminCheck) {
    throw new Error('Unauthorized: Admin access required')
  }
}

/**
 * Get admin user info
 *
 * Returns the current admin user's information.
 *
 * @returns Promise<User | null> - User object or null if not admin
 */
export async function getAdminUser(): Promise<any> {
  const adminCheck = await isAdmin()

  if (!adminCheck) {
    return null
  }

  return getCurrentUser()
}

/**
 * Add admin email to whitelist
 *
 * Helper function to programmatically add admin emails.
 * In production, you should manage this through a database.
 *
 * @param email - Email address to add as admin
 * @returns boolean - True if email was added
 */
export function addAdminEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim()

  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    console.log(`Email ${normalizedEmail} is already an admin`)
    return false
  }

  ADMIN_EMAILS.push(normalizedEmail)
  console.log(`Added ${normalizedEmail} to admin whitelist`)
  return true
}

/**
 * Remove admin email from whitelist
 *
 * Helper function to programmatically remove admin emails.
 *
 * @param email - Email address to remove from admin
 * @returns boolean - True if email was removed
 */
export function removeAdminEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim()
  const index = ADMIN_EMAILS.indexOf(normalizedEmail)

  if (index === -1) {
    console.log(`Email ${normalizedEmail} is not an admin`)
    return false
  }

  ADMIN_EMAILS.splice(index, 1)
  console.log(`Removed ${normalizedEmail} from admin whitelist`)
  return true
}

/**
 * Get all admin emails
 *
 * Returns the current admin email whitelist.
 * Note: In production, this should come from a database.
 *
 * @returns string[] - Array of admin emails
 */
export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS]
}

/**
 * Verify admin access for API routes
 *
 * Use this in API route handlers to verify admin access
 * and return appropriate error responses.
 *
 * @returns Response object if unauthorized, null if authorized
 */
export async function verifyAdminAccess(): Promise<Response | null> {
  try {
    await requireAdmin()
    return null // Authorized, no error response
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized',
        message: 'Admin access required'
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

/**
 * Database-based admin check (Advanced)
 *
 * This is an alternative to email whitelist that uses the database.
 * Uncomment and use this if you want to manage admins through the database.
 *
 * Prerequisites:
 * - admin_users table must exist in database
 * - User emails must be added to admin_users table
 */
/*
export async function isAdminDatabase(): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  try {
    const user = await getCurrentUser()
    if (!user) return false

    const userEmail = user.primaryEmail || (user as any).email
    if (!userEmail) return false

    // Import Prisma client
    const { prisma } = await import('./prisma')

    // Check if user exists in admin_users table
    const adminUser = await prisma.admin_users.findUnique({
      where: { email: userEmail.toLowerCase() }
    })

    return !!adminUser
  } catch (error) {
    console.error('Database admin check error:', error)
    return false
  }
}
*/

/**
 * Role-based admin check (Advanced)
 *
 * This is an alternative that uses Stack Auth user roles.
 * Uncomment and use this if you want to use Stack Auth roles.
 *
 * Prerequisites:
 * - Roles must be configured in Stack Auth dashboard
 * - Users must be assigned appropriate roles
 */
/*
export async function hasRole(roleName: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  try {
    const user = await getCurrentUser()
    if (!user) return false

    // Stack Auth stores roles in user object
    const roles = (user as any).roles || []
    return roles.includes(roleName)
  } catch (error) {
    console.error('Role check error:', error)
    return false
  }
}

export async function isAdminRole(): Promise<boolean> {
  return hasRole('admin')
}
*/
