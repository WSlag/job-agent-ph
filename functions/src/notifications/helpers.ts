import * as admin from 'firebase-admin';
import { NotificationData } from '../types/notification';

/**
 * Creates a notification in Firestore
 */
export async function createNotification(data: NotificationData): Promise<void> {
  try {
    const db = admin.firestore();
    const notificationRef = db.collection('notifications').doc();

    await notificationRef.set({
      ...data,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Notification created for user ${data.userId}: ${data.title}`);
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Gets user data from Firestore
 */
export async function getUserData(userId: string): Promise<any> {
  try {
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      console.warn(`User ${userId} not found`);
      return null;
    }

    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

/**
 * Gets agency data from Firestore
 */
export async function getAgencyData(agencyId: string): Promise<any> {
  try {
    const db = admin.firestore();
    const agencyDoc = await db.collection('agencies').doc(agencyId).get();

    if (!agencyDoc.exists) {
      console.warn(`Agency ${agencyId} not found`);
      return null;
    }

    return { id: agencyDoc.id, ...agencyDoc.data() };
  } catch (error) {
    console.error('Error getting agency data:', error);
    throw error;
  }
}

/**
 * Gets job data from Firestore
 */
export async function getJobData(jobId: string): Promise<any> {
  try {
    const db = admin.firestore();
    const jobDoc = await db.collection('jobs').doc(jobId).get();

    if (!jobDoc.exists) {
      console.warn(`Job ${jobId} not found`);
      return null;
    }

    return { id: jobDoc.id, ...jobDoc.data() };
  } catch (error) {
    console.error('Error getting job data:', error);
    throw error;
  }
}

/**
 * Gets all admin user IDs
 */
export async function getAdminUserIds(): Promise<string[]> {
  try {
    const db = admin.firestore();
    const adminSnapshot = await db.collection('users')
      .where('role', '==', 'admin')
      .get();

    return adminSnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error getting admin users:', error);
    throw error;
  }
}

/**
 * Checks if user has email notifications enabled
 */
export async function hasEmailNotificationsEnabled(userId: string): Promise<boolean> {
  try {
    const db = admin.firestore();
    const prefsDoc = await db.collection('notificationPreferences').doc(userId).get();

    if (!prefsDoc.exists) {
      // Default to true if no preferences set
      return true;
    }

    const prefs = prefsDoc.data();
    return prefs?.emailNotifications !== false;
  } catch (error) {
    console.error('Error checking email preferences:', error);
    // Default to true on error
    return true;
  }
}
