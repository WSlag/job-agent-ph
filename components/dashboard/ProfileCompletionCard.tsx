'use client';

import Link from 'next/link';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { JobHunter } from '@/types';
import { calculateProfileCompletion } from '@/lib/dashboard-helpers';

export default function ProfileCompletionCard() {
  const { userProfile } = useAuth();
  const jobHunterProfile = userProfile as JobHunter;
  const completion = calculateProfileCompletion(jobHunterProfile);

  const checklistItems = [
    {
      label: 'Full name',
      completed: !!(jobHunterProfile?.firstName && jobHunterProfile?.lastName),
    },
    {
      label: 'Location',
      completed: !!jobHunterProfile?.location,
    },
    {
      label: 'Phone number',
      completed: !!jobHunterProfile?.phone,
    },
    {
      label: 'Skills',
      completed: !!(jobHunterProfile?.skills && jobHunterProfile.skills.length > 0),
    },
    {
      label: 'Experience level',
      completed: jobHunterProfile?.experience !== undefined && jobHunterProfile?.experience !== null,
    },
    {
      label: 'Resume',
      completed: !!jobHunterProfile?.resumeUrl,
    },
    {
      label: 'Profile picture',
      completed: !!jobHunterProfile?.profileImageUrl,
    },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;

  if (completion >= 100) {
    return (
      <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl border border-success-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-success-900 mb-1">
              Profile Complete!
            </h3>
            <p className="text-sm text-success-700 mb-3">
              Your profile is fully optimized for better job matches.
            </p>
            <Link
              href="/profile"
              className="text-sm text-success-700 hover:text-success-800 font-medium flex items-center gap-2"
            >
              View Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
        <div className="text-sm font-semibold text-primary-600">
          {completion}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {completedCount} of {totalCount} items completed
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-2 mb-4">
        {checklistItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.completed ? (
              <CheckCircle className="w-4 h-4 text-success-600 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            <span
              className={`text-sm ${
                item.completed ? 'text-gray-900 line-through' : 'text-gray-600'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/profile"
        className="block w-full text-center py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
      >
        Complete Profile
      </Link>

      <p className="text-xs text-gray-500 text-center mt-3">
        A complete profile increases your visibility to employers
      </p>
    </div>
  );
}
