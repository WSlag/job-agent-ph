'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import ActivityFilters from '@/components/admin/ActivityFilters';
import {
  getAllUserActivities,
  getPlatformActivityStats,
  formatActivityType,
  getActivityBadgeColor,
  UserActivityFilters,
  UserActivityStats,
} from '@/lib/activity-helpers';
import { canViewUserActivities } from '@/lib/permission-helpers';
import { UserActivity, UserActivityType, UserActivityCategory, Admin } from '@/types';
import { Activity, Download, Users, TrendingUp, Calendar } from 'lucide-react';
import { DocumentSnapshot } from 'firebase/firestore';

export default function UserActivitiesPage() {
  const { userProfile } = useAuth();
  const admin = userProfile as Admin;

  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [stats, setStats] = useState<UserActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<{
    userType?: 'jobhunter' | 'agency';
    activityType?: UserActivityType;
    category?: UserActivityCategory;
    dateFrom?: string;
    dateTo?: string;
    searchQuery?: string;
  }>({});

  const lastDocRef = useRef<DocumentSnapshot | null>(null);

  async function loadActivities(isLoadMore = false) {
    if (!canViewUserActivities(admin)) return;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const queryFilters: UserActivityFilters = {
        limit: 25,
        ...(filters.userType && { userType: filters.userType }),
        ...(filters.activityType && { activityType: filters.activityType }),
        ...(filters.category && { category: filters.category }),
        ...(filters.dateFrom && { dateFrom: new Date(filters.dateFrom) }),
        ...(filters.dateTo && { dateTo: new Date(filters.dateTo + 'T23:59:59') }),
        ...(filters.searchQuery && { searchQuery: filters.searchQuery }),
        ...(isLoadMore && lastDocRef.current && { startAfterDoc: lastDocRef.current }),
      };

      const result = await getAllUserActivities(queryFilters);

      if (isLoadMore) {
        setActivities((prev) => [...prev, ...result.activities]);
      } else {
        setActivities(result.activities);
      }

      lastDocRef.current = result.lastDoc;
      setHasMore(result.activities.length === 25);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    lastDocRef.current = null;
    setHasMore(true);
    loadActivities(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, admin]);

  useEffect(() => {
    if (canViewUserActivities(admin)) {
      getPlatformActivityStats().then(setStats).catch(console.error);
    }
  }, [admin]);

  function exportToCSV() {
    const headers = ['Timestamp', 'User', 'User Type', 'Activity', 'Category', 'Title', 'Description', 'Resource Type', 'Resource ID'];
    const rows = activities.map((a) => [
      a.timestamp instanceof Date ? a.timestamp.toISOString() : String(a.timestamp),
      a.userName,
      a.userType,
      formatActivityType(a.activityType),
      a.category,
      a.title,
      a.description,
      a.resourceType || '',
      a.resourceId || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-activities-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getBadgeColorClass(color: string) {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-800',
      orange: 'bg-orange-100 text-orange-800',
    };
    return colorMap[color] || colorMap.gray;
  }

  function formatTimestamp(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (!canViewUserActivities(admin)) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold">
              You do not have permission to view user activities.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Activity className="text-gray-700" size={24} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">User Activities</h1>
              <p className="text-sm text-gray-600">Monitor all user actions across the platform</p>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            disabled={activities.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-blue-600" />
                <span className="text-xs font-medium text-gray-500 uppercase">Total Activities</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalActivities.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={16} className="text-green-600" />
                <span className="text-xs font-medium text-gray-500 uppercase">Today</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.activitiesToday}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-purple-600" />
                <span className="text-xs font-medium text-gray-500 uppercase">Most Active</span>
              </div>
              <p className="text-sm font-medium text-gray-900 truncate">
                {stats.mostActiveUsers[0]?.userName || 'N/A'}
              </p>
              {stats.mostActiveUsers[0] && (
                <p className="text-xs text-gray-500">{stats.mostActiveUsers[0].count} activities</p>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        <ActivityFilters filters={filters} onFiltersChange={setFilters} />

        {/* Activities Table (Desktop) */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Activity size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No activities found matching your filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {formatTimestamp(activity.timestamp)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">{activity.userName}</div>
                          <div className="text-xs text-gray-500 capitalize">{activity.userType}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColorClass(getActivityBadgeColor(activity.activityType))}`}>
                            {activity.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">{formatActivityType(activity.activityType)}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                          {activity.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.userName}</p>
                      <p className="text-xs text-gray-500 capitalize">{activity.userType}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBadgeColorClass(getActivityBadgeColor(activity.activityType))}`}>
                      {activity.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{formatActivityType(activity.activityType)}</p>
                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                  <p className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</p>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => loadActivities(true)}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600"></div>
                      Loading...
                    </span>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
