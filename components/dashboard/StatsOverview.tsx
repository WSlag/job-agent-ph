'use client';

import { DashboardStats } from '@/types/dashboard';
import { StatCard, StatCardGrid, StatCardSkeleton } from '@/components/ui';
import { Briefcase, MessageCircle, Bookmark, User } from 'lucide-react';

interface StatsOverviewProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export default function StatsOverview({ stats, loading }: StatsOverviewProps) {
  console.log('[StatsOverview] Rendering with:', { stats, loading });

  if (loading || !stats) {
    console.log('[StatsOverview] Showing skeleton loaders because:', { loading, hasStats: !!stats });
    return (
      <StatCardGrid cols={4} gap="md" className="mb-8">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </StatCardGrid>
    );
  }

  console.log('[StatsOverview] Rendering actual stats cards');

  const { applications, messages, savedJobs, profileCompletion } = stats;

  // Determine profile variant based on completion
  const profileVariant = profileCompletion >= 80 ? 'success' : 'warning';

  return (
    <StatCardGrid cols={4} gap="md" className="mb-8">
      {/* Applications Card */}
      <StatCard
        icon={<Briefcase />}
        value={applications.total}
        label="Applications Submitted"
        variant="primary"
        action={{
          label: 'View All',
          href: '/profile/applications',
        }}
      />

      {/* Messages Card */}
      <StatCard
        icon={<MessageCircle />}
        value={messages.unread}
        label="Unread Messages"
        variant="info"
        action={{
          label: 'View Messages',
          href: '/messages',
        }}
      />

      {/* Saved Jobs Card */}
      <StatCard
        icon={<Bookmark />}
        value={savedJobs.total}
        label="Saved Jobs"
        variant="warning"
        action={{
          label: 'View Saved',
          href: '/saved-jobs',
        }}
      />

      {/* Profile Strength Card */}
      <StatCard
        icon={<User />}
        value={`${profileCompletion}%`}
        label="Profile Strength"
        variant={profileVariant}
        action={{
          label: 'Update Profile',
          href: '/profile',
        }}
      />
    </StatCardGrid>
  );
}
