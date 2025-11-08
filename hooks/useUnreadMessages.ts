'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export function useUnreadMessages() {
  const { user, userType } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !userType) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Query conversations based on user type
    const conversationsRef = collection(db, 'conversations');
    const conversationsQuery = userType === 'agency'
      ? query(conversationsRef, where('agencyId', '==', user.uid))
      : query(conversationsRef, where('jobHunterId', '==', user.uid));

    const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
      let totalUnread = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const lastMessage = data.lastMessage;

        // Count unread if:
        // 1. There is a last message
        // 2. The message is not from the current user
        // 3. The message is marked as unread
        if (lastMessage &&
            lastMessage.senderId !== user.uid &&
            lastMessage.read === false) {
          totalUnread++;
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
