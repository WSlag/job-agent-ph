'use client';

import { useState } from 'react';
import { Subscription } from '@/types';
import { CreditCard, Calendar, CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import PricingExplainerModal from '../pricing/PricingExplainerModal';

interface SubscriptionStatusCardProps {
  subscription: Subscription | null;
  loading?: boolean;
}

export default function SubscriptionStatusCard({
  subscription,
  loading = false,
}: SubscriptionStatusCardProps) {
  const [showPricingModal, setShowPricingModal] = useState(false);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  // Default to free tier if no subscription
  const plan = subscription?.plan || 'free';
  const status = subscription?.status || 'active';
  const lifetimeJobsPosted = subscription?.lifetimeJobsPosted || 0;
  const endDate = subscription?.endDate;

  // Determine status color and icon
  const getStatusDisplay = () => {
    if (plan === 'free') {
      return {
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        icon: <CheckCircle className="w-5 h-5 text-gray-600" />,
        label: 'Free Tier',
      };
    }

    if (status === 'active') {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        label: 'Premium Active',
      };
    }

    if (status === 'expired') {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: <XCircle className="w-5 h-5 text-red-600" />,
        label: 'Premium Expired',
      };
    }

    return {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      label: `Premium ${status}`,
    };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription Plan
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPricingModal(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Learn about pricing"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className={`px-3 py-1 rounded-full ${statusDisplay.bgColor} flex items-center gap-2`}>
              {statusDisplay.icon}
              <span className={`text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.label}
              </span>
            </div>
          </div>
        </div>

      {plan === 'free' ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Job Posts Used</p>
            <p className="text-2xl font-bold text-gray-900">
              {lifetimeJobsPosted} / 2 <span className="text-sm font-normal text-gray-500">lifetime</span>
            </p>
          </div>

          {lifetimeJobsPosted >= 2 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 font-medium mb-2">
                Free limit reached
              </p>
              <p className="text-sm text-yellow-700 mb-3">
                You've used all 2 free job posts. Upgrade to Premium for unlimited job postings!
              </p>
              <Link
                href="/agency/subscription"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Upgrade to Premium
              </Link>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                {2 - lifetimeJobsPosted} post{2 - lifetimeJobsPosted === 1 ? '' : 's'} remaining
              </p>
              <p className="text-sm text-blue-700 mb-3">
                Upgrade to Premium for unlimited job postings at ₱5,000/month
              </p>
              <Link
                href="/agency/subscription"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
              >
                View upgrade options →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Monthly Fee</p>
            <p className="text-2xl font-bold text-gray-900">
              ₱5,000 <span className="text-sm font-normal text-gray-500">/ month</span>
            </p>
          </div>

          {endDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {status === 'active' ? 'Renews on' : 'Expired on'}:{' '}
                <span className="font-medium text-gray-900">
                  {endDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-600 mb-1">Total Jobs Posted</p>
            <p className="text-xl font-semibold text-gray-900">{lifetimeJobsPosted}</p>
          </div>

          {status !== 'active' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800 font-medium mb-2">
                Subscription {status}
              </p>
              <p className="text-sm text-red-700 mb-3">
                Renew your subscription to continue posting unlimited jobs
              </p>
              <Link
                href="/agency/subscription"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Renew Subscription
              </Link>
            </div>
          )}

          <Link
            href="/agency/subscription"
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4"
          >
            Manage subscription →
          </Link>
        </div>
      )}
      </div>

      <PricingExplainerModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </>
  );
}
