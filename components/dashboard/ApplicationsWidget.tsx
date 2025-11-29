'use client';

import { RecentApplication } from '@/types/dashboard';
import Link from 'next/link';
import { Briefcase, ArrowRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Badge from '@/components/ui/Badge';

interface ApplicationsWidgetProps {
  applications: RecentApplication[];
  loading?: boolean;
}

export default function ApplicationsWidget({ applications, loading }: ApplicationsWidgetProps) {
  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status.toLowerCase()) {
      case 'offered':
        return 'success';
      case 'interview':
        return 'info';
      case 'reviewing':
        return 'warning';
      case 'rejected':
      case 'withdrawn':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2 text-sm">No applications yet</p>
          <p className="text-xs text-gray-500 mb-4">Start browsing jobs!</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
        <Link
          href="/profile/applications"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {applications.map((app) => (
          <Link
            key={app.id}
            href={`/profile/applications`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                  {app.jobTitle}
                </h4>
                <p className="text-sm text-gray-600 truncate">{app.companyName}</p>
              </div>
              <Badge variant={getStatusVariant(app.status)} size="sm">
                {app.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              Applied {formatDistanceToNow(app.appliedAt, { addSuffix: true })}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/profile/applications"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
        >
          View All Applications
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
