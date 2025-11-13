'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { useOptionalAuth } from '@/contexts/AuthContext';

/**
 * Hook to get real-time count of unread notifications for the current user
 */
export function useUnreadNotifications() {
  const { user } = useOptionalAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Query for unread notifications
      const db = getDbInstance();
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', user.uid),
        where('read', '==', false)
      );

      // Listen for real-time updates
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setUnreadCount(snapshot.size);
          setLoading(false);
        },
        (error) => {
          console.error('Error listening to notifications:', error);
          setUnreadCount(0);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up notifications listener:', error);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [user]);

  return { unreadCount, loading };
}
