import { getDbInstance } from './firebase';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { UserStatus, UserType } from '@/types';
import { COLLECTIONS } from './collections';

/**
 * Suspend a user account
 * @param userId - User ID to suspend
 * @param adminId - Admin ID performing the action
 * @param reason - Reason for suspension
 * @param expiryDate - Optional expiry date for temporary suspension
 */
export async function suspendUser(
  userId: string,
  adminId: string,
  reason: string,
  expiryDate?: Date
): Promise<void> {
  try {
    const db = getDbInstance();
    // Determine user type to get correct collection
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userType: UserType = userDoc.data().userType;
    let collectionName: string;

    switch (userType) {
      case 'jobhunter':
        collectionName = COLLECTIONS.JOB_HUNTERS;
        break;
      case 'agency':
        collectionName = COLLECTIONS.AGENCIES;
        break;
      case 'admin':
        collectionName = COLLECTIONS.ADMINS;
        break;
      default:
        throw new Error('Invalid user type');
    }

    const userRef = doc(db, collectionName, userId);

    await updateDoc(userRef, {
      status: 'suspended' as UserStatus,
      suspendedAt: Timestamp.now(),
      suspendedBy: adminId,
      suspensionReason: reason,
      suspensionExpiry: expiryDate ? Timestamp.fromDate(expiryDate) : null,
      updatedAt: Timestamp.now(),
    });

    // If agency, deactivate all their jobs
    if (userType === 'agency') {
      await deactivateAgencyJobs(userId);
    }
  } catch (error) {
    console.error('Error suspending user:', error);
    throw new Error('Failed to suspend user');
  }
}

/**
 * Unsuspend a user account
 * @param userId - User ID to unsuspend
 * @param adminId - Admin ID performing the action
 */
export async function unsuspendUser(
  userId: string,
  adminId: string
): Promise<void> {
  try {
    const db = getDbInstance();
    // Determine user type to get correct collection
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userType: UserType = userDoc.data().userType;
    let collectionName: string;

    switch (userType) {
      case 'jobhunter':
        collectionName = COLLECTIONS.JOB_HUNTERS;
        break;
      case 'agency':
        collectionName = COLLECTIONS.AGENCIES;
        break;
      case 'admin':
        collectionName = COLLECTIONS.ADMINS;
        break;
      default:
        throw new Error('Invalid user type');
    }

    const userRef = doc(db, collectionName, userId);

    await updateDoc(userRef, {
      status: 'active' as UserStatus,
      suspendedAt: null,
      suspendedBy: null,
      suspensionReason: null,
      suspensionExpiry: null,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error unsuspending user:', error);
    throw new Error('Failed to unsuspend user');
  }
}

/**
 * Soft delete a user account (marks as deleted but keeps data)
 * @param userId - User ID to delete
 * @param adminId - Admin ID performing the action
 * @param reason - Reason for deletion
 */
export async function softDeleteUser(
  userId: string,
  adminId: string,
  reason: string
): Promise<void> {
  try {
    const db = getDbInstance();
    // Determine user type to get correct collection
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userType: UserType = userDoc.data().userType;
    let collectionName: string;

    switch (userType) {
      case 'jobhunter':
        collectionName = COLLECTIONS.JOB_HUNTERS;
        break;
      case 'agency':
        collectionName = COLLECTIONS.AGENCIES;
        break;
      case 'admin':
        collectionName = COLLECTIONS.ADMINS;
        break;
      default:
        throw new Error('Invalid user type');
    }

    const userRef = doc(db, collectionName, userId);

    await updateDoc(userRef, {
      status: 'deleted' as UserStatus,
      deletedAt: Timestamp.now(),
      deletedBy: adminId,
      suspensionReason: reason, // Reuse field for deletion reason
      updatedAt: Timestamp.now(),
    });

    // If agency, deactivate all their jobs
    if (userType === 'agency') {
      await deactivateAgencyJobs(userId);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

/**
 * Permanently delete a user account (hard delete - super admin only)
 * @param userId - User ID to delete permanently
 * @param adminId - Admin ID performing the action
 */
export async function permanentlyDeleteUser(
  userId: string,
  adminId: string
): Promise<void> {
  try {
    const db = getDbInstance();
    // Determine user type to get correct collection
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userType: UserType = userDoc.data().userType;
    let collectionName: string;

    switch (userType) {
      case 'jobhunter':
        collectionName = COLLECTIONS.JOB_HUNTERS;
        break;
      case 'agency':
        collectionName = COLLECTIONS.AGENCIES;
        break;
      case 'admin':
        collectionName = COLLECTIONS.ADMINS;
        break;
      default:
        throw new Error('Invalid user type');
    }

    // Delete from specific collection
    await deleteDoc(doc(db, collectionName, userId));

    // Delete from users collection
    await deleteDoc(doc(db, COLLECTIONS.USERS, userId));

    // If agency, delete all their jobs
    if (userType === 'agency') {
      await deleteAgencyJobs(userId);
    }
  } catch (error) {
    console.error('Error permanently deleting user:', error);
    throw new Error('Failed to permanently delete user');
  }
}

/**
 * Check if a user's suspension has expired and auto-unsuspend if needed
 * @param userId - User ID to check
 */
export async function checkSuspensionStatus(userId: string): Promise<boolean> {
  try {
    const db = getDbInstance();
    // Determine user type to get correct collection
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userId));
    if (!userDoc.exists()) {
      return false;
    }

    const userType: UserType = userDoc.data().userType;
    let collectionName: string;

    switch (userType) {
      case 'jobhunter':
        collectionName = COLLECTIONS.JOB_HUNTERS;
        break;
      case 'agency':
        collectionName = COLLECTIONS.AGENCIES;
        break;
      case 'admin':
        collectionName = COLLECTIONS.ADMINS;
        break;
      default:
        return false;
    }

    const userRef = doc(db, collectionName, userId);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      return false;
    }

    const data = userData.data();

    // If user is suspended and has an expiry date
    if (data.status === 'suspended' && data.suspensionExpiry) {
      const expiryDate = data.suspensionExpiry.toDate();
      const now = new Date();

      // If suspension has expired, auto-unsuspend
      if (now >= expiryDate) {
        await updateDoc(userRef, {
          status: 'active' as UserStatus,
          suspendedAt: null,
          suspendedBy: null,
          suspensionReason: null,
          suspensionExpiry: null,
          updatedAt: Timestamp.now(),
        });
        return true; // User is now active
      }
    }

    return data.status === 'active';
  } catch (error) {
    console.error('Error checking suspension status:', error);
    return false;
  }
}

/**
 * Get all suspended users
 */
export async function getSuspendedUsers(): Promise<any[]> {
  try {
    const db = getDbInstance();
    const suspendedUsers: any[] = [];

    // Query each user type collection
    const collections = [
      COLLECTIONS.JOB_HUNTERS,
      COLLECTIONS.AGENCIES,
      COLLECTIONS.ADMINS,
    ];

    for (const collectionName of collections) {
      const q = query(
        collection(db, collectionName),
        where('status', '==', 'suspended')
      );
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        suspendedUsers.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    }

    return suspendedUsers;
  } catch (error) {
    console.error('Error getting suspended users:', error);
    return [];
  }
}

/**
 * Helper function to deactivate all jobs for an agency
 */
async function deactivateAgencyJobs(agencyId: string): Promise<void> {
  try {
    const db = getDbInstance();
    const jobsQuery = query(
      collection(db, COLLECTIONS.JOBS),
      where('agencyId', '==', agencyId),
      where('isActive', '==', true)
    );

    const snapshot = await getDocs(jobsQuery);

    const updates = snapshot.docs.map((jobDoc) =>
      updateDoc(doc(db, COLLECTIONS.JOBS, jobDoc.id), {
        isActive: false,
        status: 'on-hold',
        onHoldReason: 'Agency account suspended',
        onHoldAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    );

    await Promise.all(updates);
  } catch (error) {
    console.error('Error deactivating agency jobs:', error);
  }
}

/**
 * Helper function to permanently delete all jobs for an agency
 */
async function deleteAgencyJobs(agencyId: string): Promise<void> {
  try {
    const db = getDbInstance();
    const jobsQuery = query(
      collection(db, COLLECTIONS.JOBS),
      where('agencyId', '==', agencyId)
    );

    const snapshot = await getDocs(jobsQuery);

    const deletions = snapshot.docs.map((jobDoc) =>
      deleteDoc(doc(db, COLLECTIONS.JOBS, jobDoc.id))
    );

    await Promise.all(deletions);
  } catch (error) {
    console.error('Error deleting agency jobs:', error);
  }
}
