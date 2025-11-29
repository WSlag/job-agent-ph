'use client';

import Link from 'next/link';
import { Search, Briefcase, MessageCircle, User, AlertCircle } from 'lucide-react';
import { DashboardStats } from '@/types/dashboard';

interface QuickActionsProps {
  stats: DashboardStats | null;
}

export default function QuickActions({ stats }: QuickActionsProps) {
  const profileCompletion = stats?.profileCompletion || 0;
  const hasApplications = stats?.applications.total || 0;
  const hasOffers = stats?.applications.offered || 0;
  const unreadMessages = stats?.messages.unread || 0;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Conditional: Profile incomplete */}
        {profileCompletion < 50 && (
          <Link
            href="/profile"
            className="flex items-center gap-3 p-4 bg-warning-50 border-2 border-warning-200 rounded-xl hover:border-warning-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-warning-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-warning-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-warning-900">Complete Profile</p>
              <p className="text-sm text-warning-700">Boost your visibility</p>
            </div>
          </Link>
        )}

        {/* Conditional: Job offers */}
        {hasOffers > 0 && (
          <Link
            href="/profile/applications?status=offered"
            className="flex items-center gap-3 p-4 bg-success-50 border-2 border-success-200 rounded-xl hover:border-success-300 hover:shadow-md transition-all"
          >
            <div className="p-2 bg-success-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-success-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-success-900">View Offers</p>
              <p className="text-sm text-success-700">{hasOffers} job offer{hasOffers > 1 ? 's' : ''}</p>
            </div>
          </Link>
        )}

        {/* Browse Jobs (Primary) */}
        <Link
          href="/jobs"
          className="flex items-center gap-3 p-4 bg-primary-50 border-2 border-primary-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-primary-100 rounded-lg">
            <Search className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-primary-900">Browse Jobs</p>
            <p className="text-sm text-primary-700">
              {hasApplications === 0 ? 'Find your first job' : 'Discover opportunities'}
            </p>
          </div>
        </Link>

        {/* View Applications */}
        <Link
          href="/profile/applications"
          className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-gray-100 rounded-lg">
            <Briefcase className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">My Applications</p>
            <p className="text-sm text-gray-600">Track your progress</p>
          </div>
        </Link>

        {/* Messages */}
        <Link
          href="/messages"
          className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all relative"
        >
          <div className="p-2 bg-gray-100 rounded-lg">
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Messages</p>
            <p className="text-sm text-gray-600">
              {unreadMessages > 0 ? `${unreadMessages} unread` : 'No new messages'}
            </p>
          </div>
          {unreadMessages > 0 && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </div>
          )}
        </Link>

        {/* Update Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-gray-100 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Update Profile</p>
            <p className="text-sm text-gray-600">{profileCompletion}% complete</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
