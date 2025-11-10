'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import {
  Briefcase,
  Users,
  Building2,
  Star,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalAgencies: number;
  totalJobHunters: number;
  featuredJobs: number;
  pendingRequests: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    activeJobs: 0,
    totalAgencies: 0,
    totalJobHunters: 0,
    featuredJobs: 0,
    pendingRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const db = getDbInstance();
      // Load all stats in parallel
      const [
        jobsSnapshot,
        activeJobsSnapshot,
        agenciesSnapshot,
        jobHuntersSnapshot,
        featuredJobsSnapshot,
        pendingRequestsSnapshot,
      ] = await Promise.all([
        getDocs(collection(db, COLLECTIONS.JOBS)),
        getDocs(query(collection(db, COLLECTIONS.JOBS), where('isActive', '==', true))),
        getDocs(collection(db, COLLECTIONS.AGENCIES)),
        getDocs(collection(db, COLLECTIONS.JOB_HUNTERS)),
        getDocs(
          query(
            collection(db, COLLECTIONS.JOBS),
            where('isFeatured', '==', true),
            where('isActive', '==', true)
          )
        ),
        getDocs(
          query(
            collection(db, COLLECTIONS.FEATURED_REQUESTS),
            where('status', '==', 'pending')
          )
        ),
      ]);

      setStats({
        totalJobs: jobsSnapshot.size,
        activeJobs: activeJobsSnapshot.size,
        totalAgencies: agenciesSnapshot.size,
        totalJobHunters: jobHuntersSnapshot.size,
        featuredJobs: featuredJobsSnapshot.size,
        pendingRequests: pendingRequestsSnapshot.size,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      subtitle: `${stats.activeJobs} active`,
      icon: Briefcase,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Agencies',
      value: stats.totalAgencies,
      subtitle: 'Registered agencies',
      icon: Building2,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Job Hunters',
      value: stats.totalJobHunters,
      subtitle: 'Registered users',
      icon: Users,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Featured Jobs',
      value: stats.featuredJobs,
      subtitle: `${5 - stats.featuredJobs} slots available`,
      icon: Star,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      subtitle: 'Awaiting review',
      icon: FileText,
      color: 'orange',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Total Users',
      value: stats.totalAgencies + stats.totalJobHunters,
      subtitle: 'Platform users',
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to the Job Agent PH admin panel</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`${stat.iconColor}`} size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/featured-requests"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <FileText className="text-gray-400 group-hover:text-blue-600" size={24} />
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                  Review Requests
                </p>
                <p className="text-sm text-gray-500">
                  {stats.pendingRequests} pending
                </p>
              </div>
            </a>

            <a
              href="/admin/featured-jobs"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
            >
              <Star className="text-gray-400 group-hover:text-yellow-600" size={24} />
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-yellow-600">
                  Manage Featured
                </p>
                <p className="text-sm text-gray-500">
                  {stats.featuredJobs} active
                </p>
              </div>
            </a>

            <a
              href="/admin/users"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
            >
              <Users className="text-gray-400 group-hover:text-green-600" size={24} />
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-green-600">
                  View Users
                </p>
                <p className="text-sm text-gray-500">
                  {stats.totalAgencies + stats.totalJobHunters} total
                </p>
              </div>
            </a>

            <a
              href="/jobs"
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <Briefcase className="text-gray-400 group-hover:text-purple-600" size={24} />
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                  View Jobs
                </p>
                <p className="text-sm text-gray-500">
                  {stats.activeJobs} active
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Alerts */}
        {stats.pendingRequests > 0 && (
          <div className="mt-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="text-orange-600" size={24} />
              <div>
                <p className="font-semibold text-orange-900">
                  You have {stats.pendingRequests} pending featured job request
                  {stats.pendingRequests > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-orange-700">
                  Review and approve requests to feature jobs in the carousel.
                </p>
              </div>
              <a
                href="/admin/featured-requests"
                className="ml-auto bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Review Now
              </a>
            </div>
          </div>
        )}

        {stats.featuredJobs >= 5 && (
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-600" size={24} />
              <div>
                <p className="font-semibold text-yellow-900">
                  All featured job slots are filled
                </p>
                <p className="text-sm text-yellow-700">
                  Remove a featured job to make room for new requests.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
