'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ApplicationsWidget from '@/components/dashboard/ApplicationsWidget';
import MessagesWidget from '@/components/dashboard/MessagesWidget';
import SavedJobsWidget from '@/components/dashboard/SavedJobsWidget';
import MatchedJobsWidget from '@/components/dashboard/MatchedJobsWidget';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import ErrorState from '@/components/ui/ErrorState';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, userType, loading: authLoading } = useAuth();
  const {
    stats,
    recentActivity,
    recentApplications,
    recentSavedJobs,
    loading: dashboardLoading,
    error,
  } = useDashboardData();

  // Redirect if not a job hunter
  useEffect(() => {
    if (!authLoading && userType && userType !== 'jobhunter') {
      redirect(userType === 'agency' ? '/agency/dashboard' : '/admin/dashboard');
    }
  }, [userType, authLoading]);

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorState
          title="Unable to load dashboard"
          message="We encountered an error while loading your dashboard. Please try again."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const loading = authLoading || dashboardLoading;

  console.log('[DashboardPage] Rendering with:', {
    authLoading,
    dashboardLoading,
    loading,
    hasStats: !!stats,
    stats
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {/* Header */}
        <DashboardHeader />

        {/* Statistics Overview */}
        <StatsOverview stats={stats} loading={loading} />

        {/* Quick Actions */}
        <QuickActions stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column: Recent Activity (takes 2 columns on desktop) */}
          <div className="lg:col-span-2">
            <RecentActivity activities={recentActivity} loading={loading} />
          </div>

          {/* Right Column: Profile Completion */}
          <div>
            <ProfileCompletionCard />
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Applications Widget */}
          <ApplicationsWidget applications={recentApplications} loading={loading} />

          {/* Messages Widget */}
          <MessagesWidget loading={loading} />

          {/* Saved Jobs Widget */}
          <SavedJobsWidget savedJobs={recentSavedJobs} loading={loading} />
        </div>

        {/* Matched Jobs - Full Width */}
        <div className="mt-6">
          <MatchedJobsWidget loading={loading} />
        </div>
      </div>
    </div>
  );
}
