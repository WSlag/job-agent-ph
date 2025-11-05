'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  ThumbsUp,
  User,
  MapPin,
  CheckCircle2,
  Filter,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Job } from '@/types';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  jobTitle: string;
  location: string;
  rating: number;
  date: string;
  reviewText: string;
  deploymentDate?: string;
  isVerified: boolean;
  helpfulCount: number;
  isHelpful?: boolean;
}

interface JobDetailsReviewsProps {
  reviews: Review[];
  averageRating: number;
  ratingBreakdown: { stars: number; count: number; percentage: number }[];
  similarJobs: Job[];
  onWriteReview: () => void;
  onLoadMoreReviews: () => void;
  onMarkHelpful: (reviewId: string) => void;
}

/**
 * JobDetailsReviews Component
 *
 * Part 3 of Job Details: Reviews + Similar Jobs
 * Star rating breakdown, review filters, similar jobs carousel
 */
export default function JobDetailsReviews({
  reviews,
  averageRating,
  ratingBreakdown,
  similarJobs,
  onWriteReview,
  onLoadMoreReviews,
  onMarkHelpful,
}: JobDetailsReviewsProps) {
  const [reviewFilter, setReviewFilter] = useState<'helpful' | 'recent'>('helpful');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const formatSalary = (job: Job) => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable';
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    return `Up to ${job.currency} ${job.salaryMax?.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Reviews Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Star className="w-7 h-7 text-gold-500" fill="#FCD116" />
          Reviews & Ratings
        </h2>

        {/* Rating Summary */}
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          {/* Overall Rating */}
          <div className="md:col-span-2 text-center md:text-left">
            <div className="inline-block bg-primary-50 rounded-2xl p-6">
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={
                      i < Math.floor(averageRating)
                        ? 'text-gold-500'
                        : 'text-gray-300'
                    }
                    fill={i < Math.floor(averageRating) ? '#FCD116' : 'none'}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {reviews.length} reviews
              </p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="md:col-span-3 space-y-2">
            {ratingBreakdown.map((breakdown) => (
              <div key={breakdown.stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-12">
                  {breakdown.stars} ★
                </span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 transition-all duration-500"
                    style={{ width: `${breakdown.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {breakdown.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter & Write Review */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value as 'helpful' | 'recent')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="helpful">Most Helpful</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
          <button
            onClick={onWriteReview}
            className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Write Your Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onMarkHelpful={() => onMarkHelpful(review.id)}
              formatDate={formatDate}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-6">
          <button
            onClick={onLoadMoreReviews}
            className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      </div>

      {/* Similar Jobs Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-primary-600" />
            Similar Jobs
          </h2>
          <Link
            href="/jobs?filter=similar"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
          >
            View All
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Similar Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {similarJobs.slice(0, 3).map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-primary-300 transition-all"
              >
                {/* Job image */}
                <div className="h-32 bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg mb-3 overflow-hidden">
                  {job.imageUrl ? (
                    <img
                      src={job.imageUrl}
                      alt={job.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase className="w-12 h-12 text-primary-300" />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{job.companyName}</p>

                <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <MapPin size={14} className="text-primary-600" />
                  <span className="truncate">
                    {job.location}, {job.country}
                  </span>
                </div>

                <p className="text-sm font-semibold text-success-700">
                  {formatSalary(job)}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Review Card Component
function ReviewCard({
  review,
  onMarkHelpful,
  formatDate,
}: {
  review: Review;
  onMarkHelpful: () => void;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-4 mb-4">
        {/* User Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-primary-600" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900">{review.userName}</h4>
            {review.isVerified && (
              <CheckCircle2 size={16} className="text-success-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {review.jobTitle} • {review.location}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < review.rating ? 'text-gold-500' : 'text-gray-300'
                  }
                  fill={i < review.rating ? '#FCD116' : 'none'}
                />
              ))}
            </div>
            <span>•</span>
            <span>{formatDate(review.date)}</span>
            {review.deploymentDate && (
              <>
                <span>•</span>
                <span>Deployed {review.deploymentDate}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 leading-relaxed mb-4">{review.reviewText}</p>

      {/* Helpful Button */}
      <button
        onClick={onMarkHelpful}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          review.isHelpful
            ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
            : 'border-2 border-gray-300 text-gray-600 hover:border-primary-300 hover:text-primary-600'
        }`}
      >
        <ThumbsUp size={16} fill={review.isHelpful ? 'currentColor' : 'none'} />
        <span>Helpful ({review.helpfulCount})</span>
      </button>
    </div>
  );
}
