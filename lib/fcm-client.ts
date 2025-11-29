import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { getDbInstance } from './firebase';

let messaging: Messaging | null = null;

/**
 * Initialize FCM and get messaging instance
 */
export function initializeFCM(): Messaging | null {
  if (typeof window === 'undefined') return null;

  try {
    if (!messaging) {
      messaging = getMessaging();
    }
    return messaging;
  } catch (error) {
    console.error('Error initializing FCM:', error);
    return null;
  }
}

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    const messaging = initializeFCM();
    if (!messaging) return null;

    // Get FCM token
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('VAPID key not configured');
      return null;
    }

    const token = await getToken(messaging, { vapidKey });

    console.log('FCM token obtained');
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Save FCM token to user's Firestore document
 */
export async function saveFCMToken(userId: string, token: string): Promise<void> {
  try {
    const db = getDbInstance();
    const prefsRef = doc(db, 'notificationPreferences', userId);

    await setDoc(
      prefsRef,
      {
        fcmToken: token,
        fcmTokenUpdatedAt: new Date(),
      },
      { merge: true }
    );

    console.log('FCM token saved to Firestore');
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
}

/**
 * Setup FCM foreground message listener
 */
export function setupFCMListener(onMessageReceived: (payload: any) => void): void {
  const messaging = initializeFCM();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log('FCM message received:', payload);
    onMessageReceived(payload);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted' && payload.notification) {
      new Notification(payload.notification.title || 'New Notification', {
        body: payload.notification.body,
        icon: '/icon-192x192.png',
        badge: '/icon-144x144.png',
        data: payload.data,
      });
    }
  });
}
