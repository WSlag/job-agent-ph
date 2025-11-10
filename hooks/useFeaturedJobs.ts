import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Job } from '@/types';

interface UseFeaturedJobsReturn {
  featuredJobs: Job[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch and subscribe to featured jobs in real-time
 * @returns Featured jobs array, loading state, error, and refetch function
 */
export function useFeaturedJobs(): UseFeaturedJobsReturn {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Create query for featured jobs
      const db = getDbInstance();
      const jobsRef = collection(db, COLLECTIONS.JOBS);
      const q = query(
        jobsRef,
        where('isFeatured', '==', true),
        where('isActive', '==', true),
        orderBy('featuredPriority', 'asc'),
        limit(5)
      );

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const jobs: Job[] = [];

          querySnapshot.forEach((doc) => {
            jobs.push({
              id: doc.id,
              ...doc.data(),
            } as Job);
          });

          setFeaturedJobs(jobs);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching featured jobs:', error);
          setError('Failed to load featured jobs');
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up featured jobs listener:', error);
      setError('Failed to initialize featured jobs');
      setLoading(false);
    }
  }, [refetchTrigger]);

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return {
    featuredJobs,
    loading,
    error,
    refetch,
  };
}
