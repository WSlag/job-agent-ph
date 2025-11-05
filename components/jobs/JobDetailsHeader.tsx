'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Bookmark,
  Share2,
  MessageCircle,
  Briefcase,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Job } from '@/types';
import { Badge } from '@/components/ui';

interface JobDetailsHeaderProps {
  job: Job;
  matchPercentage?: number;
  isSaved: boolean;
  isAuthenticated: boolean;
  onSave: () => void;
  onApply: () => void;
  onMessage: () => void;
  onShare: () => void;
}

/**
 * JobDetailsHeader Component
 *
 * Part 1 of Job Details: Header + Overview
 * Sticky header with actions, job info cards, requirements
 */
export default function JobDetailsHeader({
  job,
  matchPercentage,
  isSaved,
  isAuthenticated,
  onSave,
  onApply,
  onMessage,
  onShare,
}: JobDetailsHeaderProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatSalary = () => {
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
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const requirements = [
    'Valid passport',
    '2+ years experience',
    'English proficiency',
    'Medical certificate',
    'No criminal record',
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-primary-50 to-purple-50 overflow-hidden">
        {job.imageUrl ? (
          <img
            src={job.imageUrl}
            alt={job.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase className="w-24 h-24 text-primary-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Match percentage badge (authenticated only) */}
        {isAuthenticated && matchPercentage && matchPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-success-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            {matchPercentage}% Match
          </div>
        )}

        {/* Posted date */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Clock size={16} />
          Posted {getTimeAgo(job.postedAt)}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className={`p-2.5 rounded-lg transition-all ${
                isSaved
                  ? 'bg-primary-600 text-white'
                  : 'border-2 border-gray-300 text-gray-600 hover:border-primary-600 hover:text-primary-600'
              }`}
              title={isSaved ? 'Saved' : 'Save job'}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={onShare}
              className="p-2.5 border-2 border-gray-300 text-gray-600 hover:border-primary-600 hover:text-primary-600 rounded-lg transition-all"
              title="Share job"
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onMessage}
              className="hidden md:flex items-center gap-2 border-2 border-primary-600 text-primary-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-50 transition-all"
            >
              <MessageCircle size={18} />
              Message Agency
            </button>
            <button
              onClick={onApply}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-2.5 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-md"
            >
              Quick Apply
            </button>
          </div>
        </div>
      </div>

      {/* Job Title & Company */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {job.title}
            </h1>
            <p className="text-xl text-gray-700 font-medium mb-4">
              {job.companyName}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="primary" size="md">
                {job.jobType}
              </Badge>
              <Badge variant="info" size="md">
                {job.locationType}
              </Badge>
              {job.isFeatured && (
                <Badge variant="gold" size="md">
                  ⭐ Featured
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Key Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <InfoCard
            icon={<MapPin className="w-5 h-5" />}
            label="Location"
            value={`${job.location}, ${job.country}`}
            variant="primary"
          />
          <InfoCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Salary"
            value={formatSalary()}
            variant="success"
          />
          <InfoCard
            icon={<Calendar className="w-5 h-5" />}
            label="Contract"
            value={job.contractDuration || '2 years'}
            variant="info"
          />
          <InfoCard
            icon={<Users className="w-5 h-5" />}
            label="Vacancies"
            value={job.vacancies?.toString() || '5'}
            variant="warning"
          />
        </div>

        {/* Description */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Job Description
          </h2>
          <div
            className={`text-gray-700 leading-relaxed ${
              !showFullDescription ? 'line-clamp-6' : ''
            }`}
          >
            {job.description}
          </div>
          {job.description && job.description.length > 300 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-primary-600 hover:text-primary-700 font-semibold mt-3"
            >
              {showFullDescription ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Requirements Checklist */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Requirements
          </h2>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-600 rounded"
                />
                <span className="text-gray-700">{req}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for info cards
function InfoCard({
  icon,
  label,
  value,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant: 'primary' | 'success' | 'info' | 'warning';
}) {
  const variantColors = {
    primary: 'text-primary-600 bg-primary-50 border-primary-200',
    success: 'text-success-600 bg-success-50 border-success-200',
    info: 'text-info-600 bg-info-50 border-info-200',
    warning: 'text-warning-600 bg-warning-50 border-warning-200',
  };

  return (
    <div
      className={`border-2 rounded-xl p-4 ${variantColors[variant]}`}
    >
      <div className="flex items-center gap-2 mb-2 opacity-80">
        {icon}
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <p className="font-bold text-lg">{value}</p>
    </div>
  );
}
