'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  MessageCircle,
  Heart,
  Share2,
  Users,
  Edit,
} from 'lucide-react';
import { Job } from '@/types';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    // Only load applicant count for agencies viewing their own jobs
    if (userType === 'agency' && user && job.agencyId === user.uid) {
      loadApplicantCount();
    }
  }, [userType, user, job.agencyId, job.id]);

  const loadApplicantCount = async () => {
    try {
      const count = await getJobApplicationCount(job.id);
      setApplicantCount(count);
    } catch (error) {
      console.error('Error loading applicant count:', error);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    if (onSave) {
      onSave(job.id);
    }
  };

  const handleMessage = () => {
    // Redirect to messages page with jobId parameter
    window.location.href = `/messages?jobId=${job.id}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `Check out this job: ${job.title} at ${job.companyName}`,
          url: window.location.origin + `/jobs/${job.id}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return null;

    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }

    if (job.salaryMin) {
      return `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    }

    return `${job.currency} ${job.salaryMax?.toLocaleString()}`;
  };

  const salary = formatSalary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
    >
      {/* Image Section - Taller on mobile for 2-column grid */}
      <div className="relative w-full h-40 sm:h-48 bg-gray-200 overflow-hidden">
        {job.imageUrl && !imageError ? (
          <Image
            src={job.imageUrl}
            alt={`${job.companyName} - ${job.title}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
            <Briefcase size={64} className="text-white opacity-60 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}

        {/* Job Type Badge */}
        <div className="absolute top-3 right-3 animate-slide-up">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-lg border border-blue-100">
            {job.jobType.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all duration-300 border border-gray-100"
          aria-label={saved ? 'Unsave job' : 'Save job'}
        >
          <motion.div
            animate={saved ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={20}
              className={`transition-all duration-300 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* Job Details Section - Compact for mobile 2-column */}
      <div className="p-3 sm:p-5">
        {/* Job Title - Smaller on mobile */}
        <Link href={`/jobs/${job.id}`}>
          <h3 className="text-sm sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-1 sm:mb-2 line-clamp-2 leading-tight">
            {job.title}
          </h3>
        </Link>

        {/* Company Name - Smaller on mobile */}
        <p className="text-xs sm:text-lg text-gray-600 sm:text-gray-700 font-medium mb-2 sm:mb-3 truncate">
          {job.companyName}
        </p>

        {/* Location - Compact on mobile */}
        <div className="flex items-start text-gray-600 mb-1.5 sm:mb-2">
          <MapPin size={14} className="mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" />
          <span className="text-xs sm:text-sm line-clamp-2">
            {job.location}, {job.country}
          </span>
        </div>

        {/* Salary - More prominent */}
        {salary && (
          <div className="flex items-center text-gray-600 mb-2 sm:mb-2">
            <DollarSign size={14} className="mr-1.5 sm:mr-2 flex-shrink-0 text-green-500" />
            <span className="text-xs sm:text-sm font-bold text-green-600 truncate">
              {salary}
            </span>
          </div>
        )}

        {/* Experience - Hidden on smallest mobile, show on sm+ */}
        <div className="hidden sm:flex items-center text-gray-600 mb-3">
          <Briefcase size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">
            {job.experienceRequired === 0
              ? 'No experience required'
              : `${job.experienceRequired}+ years experience`}
          </span>
        </div>

        {/* Skills Tags - Show only 2 on mobile, 4 on desktop */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {job.skills.slice(0, 2).map((skill, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {/* Show more skills on desktop */}
            {job.skills.slice(2, 4).map((skill, index) => (
              <span
                key={index + 2}
                className="hidden sm:inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                +{job.skills.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Posted Date - Smaller on mobile */}
        <div className="flex items-center text-gray-500 text-[10px] sm:text-xs mb-2 sm:mb-4">
          <Clock size={12} className="mr-1 sm:mr-1.5" />
          <span className="truncate">
            {formatDistanceToNow(job.postedAt?.toDate ? job.postedAt.toDate() : new Date(job.postedAt))} ago
          </span>
        </div>

        {/* Action Buttons - Mobile optimized with touch-friendly size */}
        <div className="flex gap-1.5 sm:gap-2">
          {userType === 'agency' && user && job.agencyId === user.uid ? (
            // Agency view of their own job
            <>
              <Link
                href={`/jobs/${job.id}/applicants`}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1 sm:gap-2 group/btn text-xs sm:text-sm min-h-[44px]"
              >
                <Users size={14} className="sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
                <span className="hidden xs:inline">{applicantCount !== null ? `${applicantCount}` : '0'}</span>
              </Link>
              <Link
                href={`/jobs/edit/${job.id}`}
                className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold min-h-[44px]"
                title="Edit Job"
              >
                <Edit size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Edit</span>
              </Link>
              <Link
                href={`/jobs/${job.id}`}
                className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm hover:shadow-md flex items-center justify-center text-xs sm:text-sm font-semibold min-h-[44px]"
                title="View Job"
              >
                View
              </Link>
            </>
          ) : (
            // Job hunter view - Single button on mobile for cleaner look
            <>
              <Link
                href={`/jobs/${job.id}`}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 group/btn text-xs sm:text-base min-h-[48px]"
              >
                <span>View Job</span>
              </Link>

              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm hover:shadow-md flex items-center justify-center group/share min-h-[48px] min-w-[48px]"
                aria-label="Share job"
              >
                <Share2 size={16} className="sm:w-[18px] sm:h-[18px] group-hover/share:scale-110 transition-transform" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
