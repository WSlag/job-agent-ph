'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, DollarSign, Bookmark, Briefcase } from 'lucide-react';
import { Job } from '@/types';
import { Badge } from '@/components/ui';

interface RecommendedJobsCarouselProps {
  jobs: Job[];
  userSkills?: string[];
  loading?: boolean;
  onSave?: (jobId: string) => void;
  savedJobs?: Set<string>;
}

/**
 * RecommendedJobsCarousel Component
 *
 * Displays AI-powered job recommendations with match percentages
 * Horizontal scrollable carousel for quick browsing
 * Only shown to authenticated users
 */
export default function RecommendedJobsCarousel({
  jobs,
  userSkills = [],
  loading = false,
  onSave,
  savedJobs = new Set(),
}: RecommendedJobsCarouselProps) {
  const calculateMatch = (job: Job): number => {
    if (userSkills.length === 0) return 0;

    // Convert requirements array to lowercase strings for comparison
    const jobRequirements = job.requirements?.map(req => req.toLowerCase()) || [];
    const matchCount = userSkills.filter(skill =>
      jobRequirements.some(req => req.includes(skill.toLowerCase()))
    ).length;

    const matchPercentage = Math.min((matchCount / Math.max(userSkills.length, 1)) * 100, 100);
    return Math.round(matchPercentage);
  };

  const formatSalary = (job: Job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable';
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    return `Up to ${job.currency} ${job.salaryMax?.toLocaleString()}`;
  };

  const handleSave = (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(jobId);
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 h-56 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
          <Badge variant="primary" size="sm">
            {jobs.length}
          </Badge>
        </div>
        <Link
          href="/jobs?filter=recommended"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Horizontal scrollable cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {jobs.map((job, index) => {
          const matchPercentage = calculateMatch(job);
          const isSaved = savedJobs.has(job.id);

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80"
            >
              <Link href={`/jobs/${job.id}`}>
                <div className="bg-white border-2 border-primary-200 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 relative">
                  {/* Match percentage badge */}
                  {matchPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-success-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                      {matchPercentage}% Match
                    </div>
                  )}

                  {/* Save button */}
                  <button
                    onClick={(e) => handleSave(e, job.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-lg z-10 ${
                      isSaved
                        ? 'bg-primary-600 text-white'
                        : 'bg-white/90 text-gray-600 hover:bg-white hover:text-primary-600'
                    }`}
                  >
                    <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>

                  {/* Job image */}
                  <div className="h-32 bg-gradient-to-br from-primary-50 to-purple-50 overflow-hidden">
                    {job.imageUrl ? (
                      <img
                        src={job.imageUrl}
                        alt={job.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="w-16 h-16 text-primary-300" />
                      </div>
                    )}
                  </div>

                  {/* Job details */}
                  <div className="p-4">
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="primary" size="sm">
                        {job.jobType}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {job.locationType}
                      </Badge>
                    </div>

                    {/* Title & Company */}
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      {job.companyName}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                      <span className="truncate">{job.location}, {job.country}</span>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                      <DollarSign className="w-4 h-4 text-success-600 flex-shrink-0" />
                      <span className="font-semibold text-success-700 truncate">
                        {formatSalary(job)}
                      </span>
                    </div>

                    {/* Apply button */}
                    <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2.5 rounded-lg text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
