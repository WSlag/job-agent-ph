'use client';

import { ActivityItem } from '@/types/dashboard';
import Link from 'next/link';
import {
  Briefcase,
  MessageCircle,
  Bookmark,
  User,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
}

export default function RecentActivity({ activities, loading }: RecentActivityProps) {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'application':
        return <Briefcase className="w-5 h-5 text-primary-600" />;
      case 'status_change':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-info-600" />;
      case 'saved_job':
        return <Bookmark className="w-5 h-5 text-warning-600" />;
      case 'profile_update':
        return <User className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'application':
        return 'bg-primary-50';
      case 'status_change':
        return 'bg-success-50';
      case 'message':
        return 'bg-info-50';
      case 'saved_job':
        return 'bg-warning-50';
      case 'profile_update':
        return 'bg-gray-50';
      default:
        return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2">No recent activity</p>
          <p className="text-sm text-gray-500">
            Start applying to jobs to see your activity here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <span className="text-sm text-gray-500">Last 30 days</span>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="group">
            {activity.link ? (
              <Link
                href={activity.link}
                className="flex gap-4 items-start hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100" />
              </Link>
            ) : (
              <div className="flex gap-4 items-start">
                <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {activities.length >= 10 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            href="/profile/applications"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
          >
            View All Activity
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
