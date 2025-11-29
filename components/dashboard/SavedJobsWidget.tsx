'use client';

import { SavedJobPreview } from '@/types/dashboard';
import Link from 'next/link';
import { Bookmark, ArrowRight, MapPin, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';

interface SavedJobsWidgetProps {
  savedJobs: SavedJobPreview[];
  loading?: boolean;
}

export default function SavedJobsWidget({ savedJobs, loading }: SavedJobsWidgetProps) {
  const formatSalary = (salaryRange?: { min: number; max: number; currency: string }) => {
    if (!salaryRange) return null;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salaryRange.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return `${formatter.format(salaryRange.min)} - ${formatter.format(salaryRange.max)}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Jobs</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!savedJobs || savedJobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Jobs</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2 text-sm">No saved jobs yet</p>
          <p className="text-xs text-gray-500 mb-4">
            Save jobs you're interested in to view them here
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Saved Jobs</h3>
        <Link
          href="/saved-jobs"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {savedJobs.map((job) => (
          <div
            key={job.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Link href={`/jobs/${job.jobId}`} className="block group">
              <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate mb-1">
                {job.title}
              </h4>
              <p className="text-sm text-gray-600 truncate mb-2">{job.companyName}</p>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>

                {job.salaryRange && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <DollarSign className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{formatSalary(job.salaryRange)}</span>
                  </div>
                )}
              </div>
            </Link>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <Link href={`/jobs/${job.jobId}`}>
                <Button variant="primary" size="sm" fullWidth>
                  View Job
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/saved-jobs"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
        >
          View All Saved Jobs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
