'use client';

import { AlertTriangle, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface JobLimitBannerProps {
  currentCount: number;
  limit: number;
  plan: 'free' | 'premium' | 'none';
}

export default function JobLimitBanner({ currentCount, limit, plan }: JobLimitBannerProps) {
  // Don't show banner for premium users with active subscription
  if (plan === 'premium') {
    return null;
  }

  // Show warning when limit is reached
  if (currentCount >= limit) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">Job Posting Limit Reached</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                You've used all <strong>{limit} free job posts</strong>. Upgrade to Premium for
                unlimited job postings at ₱5,000/month.
              </p>
            </div>
            <div className="mt-4">
              <Link
                href="/agency/subscription"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <CreditCard className="w-4 h-4" />
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show warning when approaching limit (1 post remaining)
  if (currentCount === limit - 1) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">Last Free Job Post</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                You have <strong>1 free job post remaining</strong>. After this, you'll need to
                upgrade to Premium to continue posting jobs.
              </p>
            </div>
            <div className="mt-3">
              <Link
                href="/agency/subscription"
                className="text-sm text-yellow-800 hover:text-yellow-900 font-medium underline"
              >
                Learn about Premium benefits →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show info banner for new users
  if (currentCount === 0) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CreditCard className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">Free Tier: 2 Job Posts</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                You can post <strong>2 free jobs</strong> to get started. Upgrade to Premium
                anytime for unlimited job postings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
