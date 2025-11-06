'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import {
  Bookmark,
  X,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Building2,
} from 'lucide-react';
import { Job } from '@/types';
import { Badge } from '@/components/ui';

interface SwipeableJobCardProps {
  job: Job;
  onSave: (jobId: string) => void;
  onDismiss: (jobId: string) => void;
  isSaved: boolean;
  matchPercentage?: number;
}

/**
 * SwipeableJobCard Component
 *
 * Interactive job card with swipe gestures
 * - Swipe right: Save job
 * - Swipe left: Not interested
 * Shows action indicators during swipe
 */
export default function SwipeableJobCard({
  job,
  onSave,
  onDismiss,
  isSaved,
  matchPercentage,
}: SwipeableJobCardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  // Action indicators
  const saveOpacity = useTransform(x, [0, 150], [0, 1]);
  const dismissOpacity = useTransform(x, [-150, 0], [1, 0]);

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable';

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
    if (job.salaryMin) return `${job.currency}${toKFormat(job.salaryMin)}+`;
    return `${job.currency}${toKFormat(job.salaryMax!)}`;
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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiped right - Save
        setExitDirection('right');
        onSave(job.id);
      } else {
        // Swiped left - Dismiss
        setExitDirection('left');
        onDismiss(job.id);
      }
    }
  };

  const cardVariants = {
    initial: { scale: 1, x: 0 },
    exit: {
      x: exitDirection === 'right' ? 500 : exitDirection === 'left' ? -500 : 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      variants={cardVariants}
      animate={exitDirection ? 'exit' : 'initial'}
      className="relative"
    >
      {/* Save Indicator (Right) */}
      <motion.div
        style={{ opacity: saveOpacity }}
        className="absolute inset-0 bg-success-100 border-4 border-success-500 rounded-xl flex items-center justify-center pointer-events-none z-10"
      >
        <div className="bg-success-500 text-white p-6 rounded-full">
          <Bookmark size={48} fill="currentColor" />
        </div>
      </motion.div>

      {/* Dismiss Indicator (Left) */}
      <motion.div
        style={{ opacity: dismissOpacity }}
        className="absolute inset-0 bg-error-100 border-4 border-error-500 rounded-xl flex items-center justify-center pointer-events-none z-10"
      >
        <div className="bg-error-500 text-white p-6 rounded-full">
          <X size={48} strokeWidth={3} />
        </div>
      </motion.div>

      {/* Job Card */}
      <Link href={`/jobs/${job.id}`}>
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
          {/* Job Image */}
          <div className="relative h-48 bg-gradient-to-br from-primary-50 to-purple-50 overflow-hidden">
            {job.imageUrl ? (
              <img
                src={job.imageUrl}
                alt={job.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Briefcase className="w-20 h-20 text-primary-300" />
              </div>
            )}

            {/* Match percentage */}
            {matchPercentage && matchPercentage > 0 && (
              <div className="absolute top-3 left-3 bg-success-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                {matchPercentage}% Match
              </div>
            )}

            {/* Posted time */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
              <Clock size={14} />
              {getTimeAgo(job.postedAt)}
            </div>

            {/* Saved indicator */}
            {isSaved && (
              <div className="absolute bottom-3 right-3 bg-primary-600 text-white p-2 rounded-full shadow-lg">
                <Bookmark size={18} fill="currentColor" />
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="p-5">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="primary" size="sm">
                {job.jobType}
              </Badge>
              <Badge variant="default" size="sm">
                {job.locationType}
              </Badge>
              {job.isFeatured && (
                <Badge variant="gold" size="sm">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {job.title}
            </h3>

            {/* Salary - Prominent Display */}
            <div className="mb-2">
              <span className="text-base md:text-lg font-bold text-blue-600">
                {formatSalary()}
              </span>
            </div>

            {/* Company */}
            <div className="flex items-center gap-2 mb-3">
              <Building2 size={14} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm font-normal text-gray-600 truncate">
                {job.companyName}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="text-sm font-normal truncate">
                {job.location}, {job.country}
              </span>
            </div>

            {/* Swipe hint */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-600">
                ← Swipe left to dismiss | Swipe right to save →
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
