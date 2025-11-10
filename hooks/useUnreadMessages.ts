'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { useOptionalAuth } from '@/contexts/AuthContext';

export function useUnreadMessages() {
  const { user, userType } = useOptionalAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !userType) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Query conversations based on user type
    const db = getDbInstance();
    const conversationsRef = collection(db, 'conversations');
    const conversationsQuery = userType === 'agency'
      ? query(conversationsRef, where('agencyId', '==', user.uid))
      : query(conversationsRef, where('jobHunterId', '==', user.uid));

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      let totalUnread = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        // Use per-user unread count if available, fall back to legacy count
        const userUnreadKey = `unreadCount_${user.uid}`;
        const userUnreadCount = data[userUnreadKey];

        if (userUnreadCount !== undefined) {
          // New per-user count system
          totalUnread += userUnreadCount;
        } else {
          // Fallback to legacy system (count conversations with unread lastMessage)
          const lastMessage = data.lastMessage;
          if (lastMessage &&
              lastMessage.senderId !== user.uid &&
              lastMessage.read === false) {
            totalUnread++;
          }
        }
      });

      setUnreadCount(totalUnread);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching unread messages:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userType]);

  return { unreadCount, loading };
}
