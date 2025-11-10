'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Calendar,
  MapPin,
  DollarSign,
  Filter,
  Search,
  FileText,
  Eye,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { Timeline, Badge, StatCard, StatCardGrid, EmptyState } from '@/components/ui';
import { NoApplicationsEmptyState } from '@/components/ui/EmptyState';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  country: string;
  salary: string;
  appliedAt: Date;
  status: 'pending' | 'reviewing' | 'interview' | 'offered' | 'rejected' | 'withdrawn';
  timeline: TimelineStep[];
}

interface TimelineStep {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'scheduled' | 'in_progress' | 'pending';
  details?: string;
  location?: string;
  notes?: string;
}

const STATUS_COLORS: Record<Application['status'], string> = {
  pending: 'default',
  reviewing: 'info',
  interview: 'warning',
  offered: 'success',
  rejected: 'danger',
  withdrawn: 'default',
};

/**
 * My Applications Page
 *
 * Shows all job applications with status tracking
 * Uses Timeline component for deployment/interview tracking
 * Authenticated users only
 */
export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Application['status'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadApplications();
    }
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const db = getDbInstance();
      const applicationsRef = collection(db, COLLECTIONS.APPLICATIONS);
      const q = query(
        applicationsRef,
        where('userId', '==', user.uid),
        orderBy('appliedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        appliedAt: doc.data().appliedAt?.toDate() || new Date(),
      })) as Application[];

      setApplications(apps);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications
    .filter((app) => filter === 'all' || app.status === filter)
    .filter(
      (app) =>
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewing: applications.filter((a) => a.status === 'reviewing').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    offered: applications.filter((a) => a.status === 'offered').length,
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary-600" />
            My Applications
          </h1>
          <p className="text-gray-600">
            Track your job applications and interview schedules
          </p>
        </div>

        {applications.length === 0 ? (
          <NoApplicationsEmptyState />
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                icon={<Briefcase />}
                value={stats.total}
                label="Total Applied"
                variant="primary"
                size="md"
              />
              <StatCard
                icon={<FileText />}
                value={stats.pending}
                label="Pending"
                variant="default"
                size="md"
              />
              <StatCard
                icon={<Eye />}
                value={stats.reviewing}
                label="Reviewing"
                variant="info"
                size="md"
              />
              <StatCard
                icon={<Calendar />}
                value={stats.interview}
                label="Interview"
                variant="warning"
                size="md"
              />
              <StatCard
                icon={<Briefcase />}
                value={stats.offered}
                label="Offered"
                variant="success"
                size="md"
              />
            </div>

            {/* Search and Filter */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as Application['status'] | 'all')
                  }
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="interview">Interview</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2 font-medium">
                  No applications match your search
                </p>
                <button
                  onClick={() => {
                    setFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredApplications.map((application) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Application Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {application.jobTitle}
                            </h3>
                            <Badge
                              variant={STATUS_COLORS[application.status] as any}
                              size="md"
                            >
                              {application.status}
                            </Badge>
                          </div>
                          <p className="text-gray-700 font-medium mb-3">
                            {application.companyName}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                              <MapPin size={16} className="text-primary-600" />
                              {application.location}, {application.country}
                            </span>
                            <span className="flex items-center gap-2">
                              <DollarSign size={16} className="text-success-600" />
                              {application.salary}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-400" />
                              Applied {getTimeAgo(application.appliedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/jobs/${application.jobId}`}
                            className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                          >
                            View Job
                          </Link>
                          <Link
                            href={`/messages?jobId=${application.jobId}`}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
                          >
                            <MessageCircle size={18} />
                            Message
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    {application.timeline && application.timeline.length > 0 && (
                      <div className="p-6 bg-gray-50">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Calendar size={18} />
                          Application Timeline
                        </h4>
                        <Timeline
                          steps={application.timeline}
                          currentStep={application.timeline.findIndex(
                            (s) => s.status === 'in_progress'
                          )}
                          expandable
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
