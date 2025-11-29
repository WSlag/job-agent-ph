import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnreadMessages } from './useUnreadMessages';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { JobHunter } from '@/types';
import {
  DashboardStats,
  ActivityItem,
  RecentApplication,
  SavedJobPreview,
} from '@/types/dashboard';
import {
  calculateProfileCompletion,
  getRecentActivity,
  getRecentApplications,
  getRecentSavedJobs,
  subscribeToApplications,
  subscribeToSavedJobs,
} from '@/lib/dashboard-helpers';

export function useDashboardData() {
  const { user, userProfile, sessionReady } = useAuth();
  const { unreadCount: unreadMessages } = useUnreadMessages();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [recentSavedJobs, setRecentSavedJobs] = useState<SavedJobPreview[]>([]);
  const [conversationCount, setConversationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid || !sessionReady) {
      setLoading(false);
      return;
    }

    let unsubscribeApplications: (() => void) | undefined;
    let unsubscribeSavedJobs: (() => void) | undefined;
    let unsubscribeConversations: (() => void) | undefined;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('[useDashboardData] Starting to load dashboard data');
        console.log('[useDashboardData] userProfile:', userProfile);
        console.log('[useDashboardData] unreadMessages:', unreadMessages);

        // Wait for token to fully propagate to Firestore before querying
        console.log('[useDashboardData] Waiting 3 seconds for token propagation...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Initialize stats with profile completion
        const profileCompletion = calculateProfileCompletion(userProfile as JobHunter);
        console.log('[useDashboardData] Profile completion:', profileCompletion);

        // Initialize stats object FIRST before setting up subscriptions
        const initialStats = {
          applications: {
            total: 0,
            pending: 0,
            reviewing: 0,
            interview: 0,
            offered: 0,
            rejected: 0,
            withdrawn: 0,
          },
          messages: {
            total: 0,
            unread: unreadMessages,
            conversations: 0,
          },
          savedJobs: {
            total: 0,
          },
          profileCompletion,
        };

        console.log('[useDashboardData] Setting initial stats:', initialStats);
        setStats(initialStats);

        // Set up real-time listener for applications
        unsubscribeApplications = subscribeToApplications(user.uid, (applicationStats) => {
          console.log('[useDashboardData] Applications subscription callback:', applicationStats);
          setStats((prevStats) => {
            console.log('[useDashboardData] prevStats before update:', prevStats);
            const newStats = {
              ...prevStats!,
              applications: applicationStats,
            };
            console.log('[useDashboardData] newStats after applications update:', newStats);
            return newStats;
          });
        });

        // Set up real-time listener for saved jobs
        unsubscribeSavedJobs = subscribeToSavedJobs(user.uid, (count) => {
          console.log('[useDashboardData] Saved jobs subscription callback:', count);
          setStats((prevStats) => {
            console.log('[useDashboardData] prevStats before saved jobs update:', prevStats);
            const newStats = {
              ...prevStats!,
              savedJobs: { total: count },
            };
            console.log('[useDashboardData] newStats after saved jobs update:', newStats);
            return newStats;
          });
        });

        // Set up real-time listener for conversation count
        const db = getDbInstance();
        const conversationsRef = collection(db, 'conversations');
        const conversationsQuery = query(conversationsRef, where('jobHunterId', '==', user.uid));

        unsubscribeConversations = onSnapshot(conversationsQuery, (snapshot) => {
          setConversationCount(snapshot.size);
        });

        // Fetch other data in parallel
        const [activity, applications, savedJobs] = await Promise.all([
          getRecentActivity(user.uid),
          getRecentApplications(user.uid),
          getRecentSavedJobs(user.uid),
        ]);

        setRecentActivity(activity);
        setRecentApplications(applications);
        setRecentSavedJobs(savedJobs);

        console.log('[useDashboardData] Dashboard data loaded successfully');
        console.log('[useDashboardData] Recent activity count:', activity.length);
        console.log('[useDashboardData] Recent applications count:', applications.length);
        console.log('[useDashboardData] Recent saved jobs count:', savedJobs.length);
      } catch (err) {
        console.error('[useDashboardData] Error loading dashboard data:', err);
        setError(err as Error);
      } finally {
        console.log('[useDashboardData] Setting loading to false');
        setLoading(false);
      }
    };

    loadDashboardData();

    // Cleanup subscriptions
    return () => {
      if (unsubscribeApplications) unsubscribeApplications();
      if (unsubscribeSavedJobs) unsubscribeSavedJobs();
      if (unsubscribeConversations) unsubscribeConversations();
    };
  }, [user?.uid, userProfile, sessionReady]);

  // Update message stats when they change
  useEffect(() => {
    if (stats) {
      setStats((prevStats) => ({
        ...prevStats!,
        messages: {
          total: conversationCount,
          unread: unreadMessages,
          conversations: conversationCount,
        },
      }));
    }
  }, [unreadMessages, conversationCount]);

  // Update profile completion when profile changes
  useEffect(() => {
    if (userProfile) {
      setStats((prevStats) => {
        if (!prevStats) return prevStats;
        const profileCompletion = calculateProfileCompletion(userProfile as JobHunter);
        return {
          ...prevStats,
          profileCompletion,
        };
      });
    }
  }, [userProfile]);

  return {
    stats,
    recentActivity,
    recentApplications,
    recentSavedJobs,
    loading,
    error,
  };
}
