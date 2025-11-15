'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { useOptionalAuth } from '@/contexts/AuthContext';

/**
 * Hook to get unread notification counts by type
 */
export function useNotificationCounts() {
  const { user } = useOptionalAuth();
  const [counts, setCounts] = useState({
    total: 0,
    jobs: 0,
    messages: 0,
    applications: 0,
    system: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCounts({
        total: 0,
        jobs: 0,
        messages: 0,
        applications: 0,
        system: 0,
      });
      setLoading(false);
      return;
    }

    const db = getDbInstance();
    const notificationsRef = collection(db, 'notifications');

    // Query for unread notifications
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const typeCounts = {
        total: 0,
        jobs: 0,
        messages: 0,
        applications: 0,
        system: 0,
      };

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        typeCounts.total++;

        switch (data.type) {
          case 'job_match':
            typeCounts.jobs++;
            break;
          case 'message':
            typeCounts.messages++;
            break;
          case 'application_update':
          case 'interview':
            typeCounts.applications++;
            break;
          case 'system':
          case 'document':
          default:
            typeCounts.system++;
            break;
        }
      });

      setCounts(typeCounts);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notification counts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { counts, loading };
}

/**
 * Hook specifically for unread job notifications
 */
export function useUnreadJobNotifications() {
  const { user } = useOptionalAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const db = getDbInstance();
    const notificationsRef = collection(db, 'notifications');

    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      where('type', '==', 'job_match'),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching job notification count:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { unreadCount, loading };
}

/**
 * Hook specifically for unread application notifications
 */
export function useUnreadApplicationNotifications() {
  const { user } = useOptionalAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const db = getDbInstance();
    const notificationsRef = collection(db, 'notifications');

    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.type === 'application_update' || data.type === 'interview') {
          count++;
        }
      });
      setUnreadCount(count);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching application notification count:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { unreadCount, loading };
}

/**
 * Hook for getting all notification-related counts
 * Combines notification counts with message counts from conversations
 */
export function useAllNotificationCounts() {
  const { counts: notificationCounts, loading: notifLoading } = useNotificationCounts();
  const { user, userType } = useOptionalAuth();
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !userType) {
      setMessageCount(0);
      setLoading(false);
      return;
    }

    // Query conversations for unread messages
    const db = getDbInstance();
    const conversationsRef = collection(db, 'conversations');
    const conversationsQuery = userType === 'agency'
      ? query(conversationsRef, where('agencyId', '==', user.uid))
      : query(conversationsRef, where('jobHunterId', '==', user.uid));

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      let totalUnread = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const userUnreadKey = `unreadCount_${user.uid}`;
        const userUnreadCount = data[userUnreadKey] || 0;
        totalUnread += userUnreadCount;
      });

      setMessageCount(totalUnread);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching unread messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userType]);

  return {
    counts: {
      ...notificationCounts,
      // Override messages with actual conversation unread count
      messages: messageCount,
      // Total includes both notification count and message count
      total: notificationCounts.total - notificationCounts.messages + messageCount,
    },
    loading: loading || notifLoading,
  };
}