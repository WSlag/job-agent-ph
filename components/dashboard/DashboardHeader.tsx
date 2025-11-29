'use client';

import { useAuth } from '@/contexts/AuthContext';
import { JobHunter } from '@/types';
import Image from 'next/image';

export default function DashboardHeader() {
  const { userProfile } = useAuth();
  const jobHunterProfile = userProfile as JobHunter;

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = jobHunterProfile?.firstName || 'Job Hunter';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4">
        {/* User Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-100 flex-shrink-0">
          {jobHunterProfile?.profileImageUrl ? (
            <Image
              src={jobHunterProfile.profileImageUrl}
              alt={`${firstName}'s profile`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-600 font-semibold text-2xl">
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Greeting */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {getGreeting()}, {firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back to your job search dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
