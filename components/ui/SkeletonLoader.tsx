'use client';

import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * SkeletonLoader Component
 *
 * Animated loading placeholder for content
 * Used to improve perceived performance
 */
export function SkeletonLoader({
  variant = 'rectangular',
  width,
  height,
  className = '',
}: SkeletonLoaderProps) {
  const baseClasses = 'animate-pulse bg-gray-200';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

/**
 * JobCardSkeleton - Loading state for job cards
 */
export function JobCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Image skeleton */}
      <SkeletonLoader variant="rectangular" height={192} />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex gap-2">
          <SkeletonLoader variant="rounded" width={80} height={24} />
          <SkeletonLoader variant="rounded" width={100} height={24} />
        </div>

        {/* Title */}
        <SkeletonLoader variant="text" width="90%" height={24} />
        <SkeletonLoader variant="text" width="70%" height={20} />

        {/* Info */}
        <div className="space-y-2">
          <SkeletonLoader variant="text" width="85%" />
          <SkeletonLoader variant="text" width="60%" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <SkeletonLoader variant="rounded" className="flex-1" height={44} />
          <SkeletonLoader variant="rounded" width={80} height={44} />
        </div>
      </div>
    </div>
  );
}

/**
 * ApplicationCardSkeleton - Loading state for application cards
 */
export function ApplicationCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <SkeletonLoader variant="text" width={200} height={28} />
            <SkeletonLoader variant="rounded" width={80} height={24} />
          </div>
          <SkeletonLoader variant="text" width={150} height={20} />
          <div className="flex gap-4">
            <SkeletonLoader variant="text" width={120} />
            <SkeletonLoader variant="text" width={100} />
            <SkeletonLoader variant="text" width={140} />
          </div>
        </div>
        <div className="flex gap-2">
          <SkeletonLoader variant="rounded" width={100} height={40} />
          <SkeletonLoader variant="rounded" width={120} height={40} />
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="bg-gray-50 rounded-lg p-4 mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <SkeletonLoader variant="circular" width={32} height={32} />
            <div className="flex-1 space-y-2">
              <SkeletonLoader variant="text" width="40%" />
              <SkeletonLoader variant="text" width="60%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * ProfileSkeleton - Loading state for profile sections
 */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonLoader variant="circular" width={96} height={96} />
        <div className="flex-1 space-y-3">
          <SkeletonLoader variant="text" width={200} height={32} />
          <SkeletonLoader variant="text" width={150} height={20} />
          <div className="flex gap-2">
            <SkeletonLoader variant="rounded" width={80} height={28} />
            <SkeletonLoader variant="rounded" width={100} height={28} />
          </div>
        </div>
      </div>

      {/* Sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <SkeletonLoader variant="text" width={180} height={24} />
          <SkeletonLoader variant="text" width="100%" />
          <SkeletonLoader variant="text" width="90%" />
          <SkeletonLoader variant="text" width="95%" />
        </div>
      ))}
    </div>
  );
}

/**
 * MessageSkeleton - Loading state for messages
 */
export function MessageSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl"
        >
          <SkeletonLoader variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <SkeletonLoader variant="text" width={120} height={20} />
              <SkeletonLoader variant="text" width={60} height={16} />
            </div>
            <SkeletonLoader variant="text" width="100%" />
            <SkeletonLoader variant="text" width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * StatCardSkeleton - Loading state for statistics
 */
export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
      <SkeletonLoader variant="circular" width={48} height={48} />
      <SkeletonLoader variant="text" width={80} height={32} />
      <SkeletonLoader variant="text" width={120} height={16} />
    </div>
  );
}

/**
 * TimelineSkeleton - Loading state for timeline
 */
export function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <SkeletonLoader variant="circular" width={40} height={40} />
            {i < 4 && (
              <div className="w-0.5 h-16 bg-gray-200 my-2" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" width="40%" height={20} />
            <SkeletonLoader variant="text" width="60%" />
            <SkeletonLoader variant="text" width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
