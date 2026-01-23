'use client';

import { UserActivityType, UserActivityCategory } from '@/types';
import { Filter, Search } from 'lucide-react';

interface ActivityFiltersProps {
  filters: {
    userType?: 'jobhunter' | 'agency';
    activityType?: UserActivityType;
    category?: UserActivityCategory;
    dateFrom?: string;
    dateTo?: string;
    searchQuery?: string;
  };
  onFiltersChange: (filters: ActivityFiltersProps['filters']) => void;
}

const activityTypeOptions: { value: UserActivityType; label: string }[] = [
  { value: 'login', label: 'Login' },
  { value: 'account_created', label: 'Account Created' },
  { value: 'application_submitted', label: 'Application Submitted' },
  { value: 'application_withdrawn', label: 'Application Withdrawn' },
  { value: 'application_status_changed', label: 'Application Status Changed' },
  { value: 'job_saved', label: 'Job Saved' },
  { value: 'job_unsaved', label: 'Job Unsaved' },
  { value: 'job_posted', label: 'Job Posted' },
  { value: 'job_updated', label: 'Job Updated' },
  { value: 'job_deactivated', label: 'Job Deactivated' },
  { value: 'job_reactivated', label: 'Job Reactivated' },
  { value: 'profile_updated', label: 'Profile Updated' },
  { value: 'resume_uploaded', label: 'Resume Uploaded' },
  { value: 'agency_profile_updated', label: 'Agency Profile Updated' },
  { value: 'message_sent', label: 'Message Sent' },
  { value: 'message_sent_to_applicant', label: 'Message to Applicant' },
  { value: 'featured_request_submitted', label: 'Featured Request' },
  { value: 'subscription_purchased', label: 'Subscription Purchased' },
  { value: 'notification_preferences_updated', label: 'Notification Prefs Updated' },
];

const categoryOptions: { value: UserActivityCategory; label: string }[] = [
  { value: 'account', label: 'Account' },
  { value: 'application', label: 'Application' },
  { value: 'job', label: 'Job' },
  { value: 'profile', label: 'Profile' },
  { value: 'message', label: 'Message' },
  { value: 'subscription', label: 'Subscription' },
];

export default function ActivityFilters({ filters, onFiltersChange }: ActivityFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <Filter size={18} className="text-gray-600" />
        <h3 className="text-sm md:text-base font-medium text-gray-900">Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">Search User</label>
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
            <input
              type="text"
              value={filters.searchQuery || ''}
              onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value || undefined })}
              placeholder="Name..."
              className="w-full border rounded px-3 py-2 pl-8 text-sm"
            />
          </div>
        </div>

        {/* User Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">User Type</label>
          <select
            value={filters.userType || ''}
            onChange={(e) => onFiltersChange({ ...filters, userType: (e.target.value || undefined) as any })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">All Users</option>
            <option value="jobhunter">Job Hunters</option>
            <option value="agency">Agencies</option>
          </select>
        </div>

        {/* Activity Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Activity Type</label>
          <select
            value={filters.activityType || ''}
            onChange={(e) => onFiltersChange({ ...filters, activityType: (e.target.value || undefined) as any })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">All Activities</option>
            {activityTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFiltersChange({ ...filters, category: (e.target.value || undefined) as any })}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value || undefined })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value || undefined })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}
