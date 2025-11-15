'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import JobCard from './JobCard';
import { Job } from '@/types';
import { JobListSkeleton } from '@/components/skeletons/JobCardSkeleton';
import { staggerContainer, listItemAnimation } from '@/lib/animations';

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function JobList({ jobs, loading = false, onLoadMore, hasMore = false }: JobListProps) {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  // OPTIMIZATION: Load saved jobs only once on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
  }, []);

  // OPTIMIZATION: Memoize event handlers to prevent unnecessary re-renders
  const handleSave = useCallback((jobId: string) => {
    setSavedJobs(prev => {
      const newSavedJobs = new Set(prev);
      if (newSavedJobs.has(jobId)) {
        newSavedJobs.delete(jobId);
      } else {
        newSavedJobs.add(jobId);
      }
      localStorage.setItem('savedJobs', JSON.stringify(Array.from(newSavedJobs)));
      return newSavedJobs;
    });
  }, []);

  const handleMessage = useCallback((jobId: string) => {
    router.push(`/messages?jobId=${jobId}`);
  }, [router]);

  if (loading && jobs.length === 0) {
    return <JobListSkeleton count={6} />;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No jobs found</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div>
      {/* 2-column grid on mobile, 2-column on tablet, 3-column on desktop */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
      >
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            variants={listItemAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.05 }}
          >
            <JobCard
              job={job}
              onSave={handleSave}
              onMessage={handleMessage}
              isSaved={savedJobs.has(job.id)}
              priority={index < 6}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button - Mobile optimized */}
      {hasMore && (
        <div className="flex justify-center mt-6 sm:mt-8">
          {loading ? (
            <JobListSkeleton count={3} />
          ) : (
            <motion.button
              onClick={onLoadMore}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base min-h-[48px] shadow-md hover:shadow-lg"
            >
              Load More Jobs
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
