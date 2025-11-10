import { UserType, Admin } from '@/types'
import { doc, getDoc } from 'firebase/firestore'
import { getDbInstance } from './firebase'
import { COLLECTIONS } from './collections'

/**
 * Check if a user is an admin
 * @param userType The user's type
 * @returns boolean indicating if user is admin
 */
export function isAdmin(userType: UserType | null): boolean {
  return userType === 'admin'
}

/**
 * Require admin access - throws error if not admin
 * @param userType The user's type
 * @throws Error if user is not admin
 */
export function requireAdmin(userType: UserType | null): void {
  if (!isAdmin(userType)) {
    throw new Error('Access denied. Admin privileges required.')
  }
}

/**
 * Get admin profile by ID
 * @param adminId The admin's user ID
 * @returns Promise with admin profile or null
 */
export async function getAdminProfile(adminId: string): Promise<Admin | null> {
  try {
    const db = getDbInstance();
    const adminDoc = await getDoc(doc(db, COLLECTIONS.ADMINS, adminId))

    if (!adminDoc.exists()) {
      return null
    }

    return { id: adminDoc.id, ...adminDoc.data() } as Admin
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return null
  }
}

/**
 * Check if user has super admin privileges
 * @param admin The admin profile
 * @returns boolean indicating if user is super admin
 */
export function isSuperAdmin(admin: Admin | null): boolean {
  return admin?.role === 'super_admin'
}

/**
 * Validate admin secret key
 * @param secretKey The secret key to validate
 * @returns boolean indicating if key is valid
 */
export function validateAdminSecretKey(secretKey: string): boolean {
  const validKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY

  if (!validKey) {
    console.error('Admin secret key not configured in environment variables')
    return false
  }

  return secretKey === validKey
}
