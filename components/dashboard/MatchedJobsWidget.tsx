'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, MapPin, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { calculateJobMatch } from '@/lib/placeholder-data';
import { Job, JobHunter } from '@/types';
import JobMatchBadge from '@/components/jobs/JobMatchBadge';
import Button from '@/components/ui/Button';

interface MatchedJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

interface MatchedJobsWidgetProps {
  loading?: boolean;
}

export default function MatchedJobsWidget({ loading: initialLoading }: MatchedJobsWidgetProps) {
  const { userProfile } = useAuth();
  const jobHunterProfile = userProfile as JobHunter;
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobHunterProfile) {
      setLoading(false);
      return;
    }

    const fetchMatchedJobs = async () => {
      try {
        const db = getDbInstance();
        const jobsRef = collection(db, 'jobs');

        // Fetch active jobs
        const q = query(
          jobsRef,
          where('status', '==', 'active'),
          orderBy('createdAt', 'desc'),
          limit(20) // Fetch more to find best matches
        );

        const snapshot = await getDocs(q);
        const jobsWithMatches: MatchedJob[] = [];

        snapshot.docs.forEach((doc) => {
          const jobData = doc.data() as Job;
          const match = calculateJobMatch(jobHunterProfile, jobData);

          if (match && match.percentage >= 70) { // Only show jobs with 70%+ match
            jobsWithMatches.push({
              id: doc.id,
              title: jobData.title,
              companyName: jobData.companyName,
              location: jobData.location,
              matchPercentage: match.percentage,
              matchingSkills: match.matchingSkills,
              missingSkills: match.missingSkills,
              salaryRange: jobData.salaryMin && jobData.salaryMax ? {
                min: jobData.salaryMin,
                max: jobData.salaryMax,
                currency: jobData.currency || 'USD',
              } : undefined,
            });
          }
        });

        // Sort by match percentage (highest first) and take top 4
        jobsWithMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);
        setMatchedJobs(jobsWithMatches.slice(0, 4));
      } catch (error) {
        console.error('Error fetching matched jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedJobs();
  }, [jobHunterProfile]);

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

  if (loading || initialLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Matched Jobs for You</h3>
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

  // Check if user has skills for matching
  const userHasSkills = jobHunterProfile?.skills && jobHunterProfile.skills.length > 0;

  if (!userHasSkills) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Matched Jobs for You</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-gray-600 mb-2 text-sm">Complete your profile to see matched jobs!</p>
          <p className="text-xs text-gray-500 mb-4">
            Add your skills to get AI-powered job recommendations
          </p>
          <Link href="/profile">
            <Button variant="primary" size="sm">
              Complete Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (matchedJobs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Matched Jobs for You</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-gray-600 mb-2 text-sm">No matching jobs at the moment</p>
          <p className="text-xs text-gray-500 mb-4">
            Check back later for new opportunities
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse All Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Matched Jobs for You</h3>
        </div>
        <Link
          href="/jobs"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {matchedJobs.map((job) => (
          <div
            key={job.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
          >
            <Link href={`/jobs/${job.id}`} className="block group">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {job.title}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">{job.companyName}</p>
                </div>
                <JobMatchBadge
                  match={{
                    percentage: job.matchPercentage,
                    matchingSkills: job.matchingSkills,
                    missingSkills: job.missingSkills,
                  }}
                />
              </div>

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

            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
              <Link href={`/jobs/${job.id}`} className="flex-1">
                <Button variant="primary" size="sm" fullWidth>
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/jobs"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
        >
          View All Jobs
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
