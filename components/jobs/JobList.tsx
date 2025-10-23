'use client';

import { useState, useEffect } from 'react';
import JobCard from './JobCard';
import { Job } from '@/types';
import { Loader2 } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function JobList({ jobs, loading = false, onLoadMore, hasMore = false }: JobListProps) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load saved jobs from localStorage
    const saved = localStorage.getItem('savedJobs');
    if (saved) {
      setSavedJobs(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleSave = (jobId: string) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(Array.from(newSavedJobs)));
  };

  const handleMessage = (jobId: string) => {
    // Navigate to message page or open message modal
    window.location.href = `/messages?jobId=${jobId}`;
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
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
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onSave={handleSave}
            onMessage={handleMessage}
            isSaved={savedJobs.has(job.id)}
          />
        ))}
      </div>

      {/* Load More Button - Mobile optimized */}
      {hasMore && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base min-h-[48px] shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Loading...</span>
              </>
            ) : (
              'Load More Jobs'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
