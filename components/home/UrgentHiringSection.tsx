'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';
import { Job } from '@/types';
import { Badge } from '@/components/ui';

interface UrgentHiringSectionProps {
  jobs: Job[];
  userSkills?: string[];
  loading?: boolean;
}

/**
 * UrgentHiringSection Component
 *
 * Displays urgent hiring jobs with match percentages (authenticated users only)
 * Horizontal scrollable cards for quick browsing
 */
export default function UrgentHiringSection({
  jobs,
  userSkills = [],
  loading = false,
}: UrgentHiringSectionProps) {
  const calculateMatch = (job: Job): number => {
    if (userSkills.length === 0) return 0;

    // Simple matching algorithm based on skills
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

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-6 h-6 text-error-500" />
          <h2 className="text-xl font-bold text-gray-900">Urgent Hiring</h2>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 h-48 bg-gray-200 rounded-xl animate-pulse"
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
          <Flame className="w-6 h-6 text-error-500" />
          <h2 className="text-xl font-bold text-gray-900">Urgent Hiring</h2>
          <Badge variant="danger" size="sm">
            {jobs.length}
          </Badge>
        </div>
        <Link
          href="/jobs?filter=urgent"
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

          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-72"
            >
              <Link href={`/jobs/${job.id}`}>
                <div className="bg-white border-2 border-error-200 rounded-xl p-4 hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden">
                  {/* Urgent indicator */}
                  <div className="absolute top-0 right-0 bg-error-500 text-white px-3 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1">
                    <Flame size={12} />
                    URGENT
                  </div>

                  {/* Match percentage (if authenticated) */}
                  {userSkills.length > 0 && matchPercentage > 0 && (
                    <div className="absolute top-0 left-0 bg-success-500 text-white px-3 py-1 rounded-br-xl text-xs font-bold">
                      {matchPercentage}% Match
                    </div>
                  )}

                  {/* Job image placeholder */}
                  <div className="h-24 bg-gradient-to-br from-error-50 to-error-100 rounded-lg mb-3 flex items-center justify-center mt-6">
                    {job.imageUrl ? (
                      <img
                        src={job.imageUrl}
                        alt={job.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Briefcase className="w-12 h-12 text-error-300" />
                    )}
                  </div>

                  {/* Job details */}
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm">
                    {job.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 font-medium">
                    {job.companyName}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <MapPin className="w-3.5 h-3.5 text-error-600 flex-shrink-0" />
                      <span className="truncate">{job.location}, {job.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <DollarSign className="w-3.5 h-3.5 text-success-600 flex-shrink-0" />
                      <span className="font-semibold text-success-700 truncate">
                        {formatSalary(job)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Posted {getTimeAgo(job.postedAt)}</span>
                    </div>
                  </div>

                  {/* Apply button */}
                  <button className="w-full bg-error-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-error-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
