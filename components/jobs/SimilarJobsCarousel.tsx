'use client';

import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { getSimilarJobs } from '@/lib/job-helpers';
import JobCard from './JobCard';
import type { Job } from '@/types';

interface SimilarJobsCarouselProps {
  currentJobId: string;
  category?: string;
  country?: string;
}

export default function SimilarJobsCarousel({
  currentJobId,
  category,
  country,
}: SimilarJobsCarouselProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimilarJobs();
  }, [currentJobId, category, country]);

  const loadSimilarJobs = async () => {
    try {
      const similarJobs = await getSimilarJobs(currentJobId, category, country, 6);
      setJobs(similarJobs);
    } catch (error) {
      console.error('Error loading similar jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-2 sm:p-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Briefcase className="text-blue-600" size={24} />
          Similar Jobs
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="w-full h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-2 sm:p-4">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Briefcase className="text-blue-600" size={24} />
        Similar Jobs ({jobs.length})
      </h2>

      <div className={`grid gap-3 ${jobs.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {jobs.map((job) => (
          <div key={job.id} className="w-full">
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
}
