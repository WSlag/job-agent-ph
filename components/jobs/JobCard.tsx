'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  Bookmark,
  Users,
  Edit,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Job } from '@/types';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getJobApplicationCount } from '@/lib/application-helpers';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

interface JobCardProps {
  job: Job;
  onSave?: (jobId: string) => void;
  onMessage?: (jobId: string) => void;
  isSaved?: boolean;
}

export default function JobCard({ job, onSave, onMessage, isSaved = false }: JobCardProps) {
  const { userType, user } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [imageError, setImageError] = useState(false);
  const [applicantCount, setApplicantCount] = useState<number | null>(null);

  // OPTIMIZATION: Memoize the loadApplicantCount function
  const loadApplicantCount = useCallback(async () => {
    try {
      const count = await getJobApplicationCount(job.id);
      setApplicantCount(count);
    } catch (error) {
      console.error('Error loading applicant count:', error);
    }
  }, [job.id]);

  useEffect(() => {
    // Only load applicant count for agencies viewing their own jobs
    if (userType === 'agency' && user && job.agencyId === user.uid) {
      loadApplicantCount();
    }
  }, [userType, user, job.agencyId, loadApplicantCount]);

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) {
      onSave(job.id);
    }
  };

  // OPTIMIZATION: Memoize time calculation
  const timeAgo = useMemo(() => {
    const now = new Date();
    const diffMs = now.getTime() - job.postedAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return `${Math.floor(diffDays / 7)}w`;
  }, [job.postedAt]);

  // OPTIMIZATION: Memoize salary formatting
  const salary = useMemo(() => {
    if (!job.salaryMin && !job.salaryMax) return null;

    // Helper to format number to K format (e.g., 5000 -> 5K)
    const toKFormat = (num: number) => {
      if (num >= 1000) {
        const k = num / 1000;
        return k % 1 === 0 ? `${k}K` : `${k.toFixed(1)}K`;
      }
      return num.toString();
    };

    if (job.salaryMin && job.salaryMax) {
      return `${job.currency}${toKFormat(job.salaryMin)} - ${toKFormat(job.salaryMax)}`;
    }

    if (job.salaryMin) {
      return `${job.currency}${toKFormat(job.salaryMin)}+`;
    }

    return `${job.currency}${toKFormat(job.salaryMax!)}`;
  }, [job.salaryMin, job.salaryMax, job.currency]);

  // Get tagline or fallback to brief description preview
  const getTaglineOrPreview = () => {
    // Use tagline if available
    if (job.tagline && job.tagline.trim()) {
      return job.tagline.trim();
    }

    // Fallback: get first sentence from description
    if (!job.description) return '';

    const firstSentence = job.description.split(/[.!?]/)[0].trim();

    // If first sentence is too long, cut at 60 chars
    if (firstSentence.length > 60) {
      return job.description.substring(0, 60).trim() + '...';
    }

    return firstSentence.length > 0 ? firstSentence + '.' : '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      data-tour="job-card"
      className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
        job.isFeatured
          ? 'border-2 border-yellow-400 ring-2 ring-yellow-100'
          : 'border border-gray-100'
      }`}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
        {job.imageUrl && !imageError ? (
          <Image
            src={job.imageUrl}
            alt={`${job.companyName} - ${job.title}`}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
            <Briefcase size={48} className="text-white opacity-60" />
          </div>
        )}

        {/* Featured Badge - Top Left */}
        {job.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1">
              <Star size={10} className="fill-current sm:w-3 sm:h-3" />
              FEATURED
            </span>
          </div>
        )}

        {/* Posted Time Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/95 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-gray-700 shadow-sm flex items-center gap-1">
            <Clock size={12} className="hidden sm:inline" />
            {timeAgo} ago
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 md:p-5">
        {/* Job Type & Category Tags */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-2 sm:mb-3">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-normal">
            {job.locationType === 'remote' ? 'Remote' : job.locationType === 'on-site' ? 'On-site' : 'Hybrid'}
          </span>
          {job.jobType && (
            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-normal">
              {job.jobType.replace('-', ' ')}
            </span>
          )}
          {job.category && (
            <span className="hidden md:inline-flex bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-normal">
              {job.category}
            </span>
          )}
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {job.title}
          </h3>
        </Link>

        {/* Salary - Prominent Display */}
        {salary && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-base md:text-lg font-bold text-blue-600">{salary}</span>
          </div>
        )}

        {/* Company Name */}
        <div className="flex items-center gap-1.5 mb-2">
          <Building2 size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
          <span className="text-sm font-normal text-gray-600 truncate">{job.companyName}</span>
        </div>

        {/* Job Tagline / Short Description */}
        {getTaglineOrPreview() && (
          <p className="hidden md:block text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {getTaglineOrPreview()}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-600 mb-2">
          <MapPin size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
          <span className="text-sm font-normal truncate">{job.location}, {job.country}</span>
        </div>

        {/* Applicant Count */}
        {userType === 'agency' && user && job.agencyId === user.uid ? (
          <div className="flex items-center gap-1.5 text-gray-600 mb-4">
            <Users size={14} className="flex-shrink-0 sm:w-4 sm:h-4" />
            <span className="text-sm font-normal">{applicantCount !== null ? applicantCount : 0} applicants</span>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 sm:pt-3 border-t border-gray-100">
          {userType === 'agency' && user && job.agencyId === user.uid ? (
            // Agency view
            <>
              <Link
                href={`/jobs/${job.id}/applicants`}
                className="flex-1 bg-blue-600 text-white px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center text-xs sm:text-sm flex items-center justify-center gap-1"
              >
                <Users size={13} className="sm:w-[14px] sm:h-[14px]" />
                Applicants
              </Link>
              <Link
                href={`/jobs/edit/${job.id}`}
                className="px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-xs sm:text-sm flex items-center justify-center gap-1"
              >
                <Edit size={13} className="sm:w-[14px] sm:h-[14px]" />
                Edit
              </Link>
            </>
          ) : (
            // Job hunter view
            <>
              <Link
                href={`/jobs/${job.id}`}
                className="flex-1 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center text-xs sm:text-sm flex items-center justify-center gap-1"
              >
                <span>View</span>
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </Link>
              <button
                onClick={handleSave}
                data-tour="save-button"
                className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-semibold border-2 transition-colors text-xs sm:text-sm ${
                  saved
                    ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {saved ? 'Saved' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
