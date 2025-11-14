'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  getAdminJobs,
  holdJob,
  unholdJob,
  softDeleteJob,
  bulkHoldJobs,
  bulkUnholdJobs,
  bulkDeleteJobs,
  JobFilters,
} from '@/lib/job-management-helpers';
import { logAdminAction } from '@/lib/audit-helpers';
import { canHoldJobs, canDeleteJobs } from '@/lib/permission-helpers';
import { Job, JobStatus, Admin } from '@/types';
import { formatSalaryRange } from '@/lib/job-helpers';

export default function AdminJobsPage() {
  const { userProfile } = useAuth();
  const admin = userProfile as Admin;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState<JobFilters>({
    status: undefined,
    searchQuery: '',
  });

  // Modal states
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdReason, setHoldReason] = useState('');
  const [targetJobId, setTargetJobId] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  async function loadJobs() {
    setLoading(true);
    try {
      const fetchedJobs = await getAdminJobs(filters);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleHoldJob(jobId: string) {
    if (!canHoldJobs(admin)) {
      alert('You do not have permission to hold jobs');
      return;
    }

    setTargetJobId(jobId);
    setShowHoldModal(true);
  }

  async function confirmHoldJob() {
    if (!targetJobId || !holdReason.trim()) {
      alert('Please provide a reason');
      return;
    }

    setActionLoading(true);
    try {
      await holdJob(targetJobId, admin.id, holdReason);

      // Log the action
      await logAdminAction({
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        action: 'job_held',
        resourceType: 'job',
        resourceId: targetJobId,
        details: { reason: holdReason },
      });

      setShowHoldModal(false);
      setHoldReason('');
      setTargetJobId(null);
      loadJobs();
    } catch (error) {
      console.error('Error holding job:', error);
      alert('Failed to hold job');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnholdJob(jobId: string) {
    if (!canHoldJobs(admin)) {
      alert('You do not have permission to unhold jobs');
      return;
    }

    if (!confirm('Are you sure you want to activate this job?')) return;

    setActionLoading(true);
    try {
      await unholdJob(jobId, admin.id);

      // Log the action
      await logAdminAction({
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        action: 'job_unheld',
        resourceType: 'job',
        resourceId: jobId,
        details: {},
      });

      loadJobs();
    } catch (error) {
      console.error('Error unholding job:', error);
      alert('Failed to unhold job');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteJob(jobId: string) {
    if (!canDeleteJobs(admin)) {
      alert('You do not have permission to delete jobs');
      return;
    }

    if (!confirm('Are you sure you want to delete this job?')) return;

    setActionLoading(true);
    try {
      await softDeleteJob(jobId, admin.id);

      // Log the action
      await logAdminAction({
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        action: 'job_deleted',
        resourceType: 'job',
        resourceId: jobId,
        details: {},
      });

      loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBulkHold() {
    if (!canHoldJobs(admin)) {
      alert('You do not have permission to hold jobs');
      return;
    }

    if (selectedJobs.length === 0) {
      alert('No jobs selected');
      return;
    }

    const reason = prompt('Reason for holding these jobs:');
    if (!reason) return;

    setActionLoading(true);
    try {
      await bulkHoldJobs(selectedJobs, admin.id, reason);

      // Log each action
      for (const jobId of selectedJobs) {
        await logAdminAction({
          adminId: admin.id,
          adminName: `${admin.firstName} ${admin.lastName}`,
          action: 'job_held',
          resourceType: 'job',
          resourceId: jobId,
          details: { reason, bulkAction: true },
        });
      }

      setSelectedJobs([]);
      loadJobs();
    } catch (error) {
      console.error('Error bulk holding jobs:', error);
      alert('Failed to hold jobs');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBulkUnhold() {
    if (!canHoldJobs(admin)) {
      alert('You do not have permission to unhold jobs');
      return;
    }

    if (selectedJobs.length === 0) {
      alert('No jobs selected');
      return;
    }

    if (!confirm(`Activate ${selectedJobs.length} jobs?`)) return;

    setActionLoading(true);
    try {
      await bulkUnholdJobs(selectedJobs, admin.id);

      // Log each action
      for (const jobId of selectedJobs) {
        await logAdminAction({
          adminId: admin.id,
          adminName: `${admin.firstName} ${admin.lastName}`,
          action: 'job_unheld',
          resourceType: 'job',
          resourceId: jobId,
          details: { bulkAction: true },
        });
      }

      setSelectedJobs([]);
      loadJobs();
    } catch (error) {
      console.error('Error bulk unholding jobs:', error);
      alert('Failed to unhold jobs');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleBulkDelete() {
    if (!canDeleteJobs(admin)) {
      alert('You do not have permission to delete jobs');
      return;
    }

    if (selectedJobs.length === 0) {
      alert('No jobs selected');
      return;
    }

    if (!confirm(`Delete ${selectedJobs.length} jobs?`)) return;

    setActionLoading(true);
    try {
      await bulkDeleteJobs(selectedJobs, admin.id);

      // Log each action
      for (const jobId of selectedJobs) {
        await logAdminAction({
          adminId: admin.id,
          adminName: `${admin.firstName} ${admin.lastName}`,
          action: 'job_deleted',
          resourceType: 'job',
          resourceId: jobId,
          details: { bulkAction: true },
        });
      }

      setSelectedJobs([]);
      loadJobs();
    } catch (error) {
      console.error('Error bulk deleting jobs:', error);
      alert('Failed to delete jobs');
    } finally {
      setActionLoading(false);
    }
  }

  function getStatusBadge(status: JobStatus | undefined, isActive: boolean) {
    const effectiveStatus = status || (isActive ? 'active' : 'deleted');

    const badgeClasses = {
      active: 'bg-green-100 text-green-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      deleted: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          badgeClasses[effectiveStatus]
        }`}
      >
        {effectiveStatus === 'on-hold' ? 'On Hold' : effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
      </span>
    );
  }

  const selectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map((j) => j.id));
    }
  };

  const toggleSelection = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Job Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    status: e.target.value as JobStatus | undefined,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by title, company..."
                value={filters.searchQuery || ''}
                onChange={(e) =>
                  setFilters({ ...filters, searchQuery: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedJobs.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-sm font-medium text-blue-900">
                {selectedJobs.length} job(s) selected
              </span>
              <div className="flex flex-wrap gap-2">
                {canHoldJobs(admin) && (
                  <>
                    <button
                      onClick={handleBulkHold}
                      disabled={actionLoading}
                      className="flex-1 sm:flex-none px-3 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                    >
                      Hold
                    </button>
                    <button
                      onClick={handleBulkUnhold}
                      disabled={actionLoading}
                      className="flex-1 sm:flex-none px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      Activate
                    </button>
                  </>
                )}
                {canDeleteJobs(admin) && (
                  <button
                    onClick={handleBulkDelete}
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No jobs found</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedJobs.length === jobs.length}
                          onChange={selectAll}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Job Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Company
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Salary
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Posted
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => {
                      const effectiveStatus = job.status || (job.isActive ? 'active' : 'deleted');
                      return (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedJobs.includes(job.id)}
                              onChange={() => toggleSelection(job.id)}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.category}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {job.companyName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {job.location}, {job.country}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(job.status, job.isActive)}
                            {job.onHoldReason && (
                              <div className="text-xs text-gray-500 mt-1">
                                {job.onHoldReason}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {job.postedAt.toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              {effectiveStatus === 'active' && canHoldJobs(admin) && (
                                <button
                                  onClick={() => handleHoldJob(job.id)}
                                  className="text-yellow-600 hover:text-yellow-800 text-sm"
                                  disabled={actionLoading}
                                >
                                  Hold
                                </button>
                              )}
                              {effectiveStatus === 'on-hold' && canHoldJobs(admin) && (
                                <button
                                  onClick={() => handleUnholdJob(job.id)}
                                  className="text-green-600 hover:text-green-800 text-sm"
                                  disabled={actionLoading}
                                >
                                  Activate
                                </button>
                              )}
                              {effectiveStatus !== 'deleted' && canDeleteJobs(admin) && (
                                <button
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="text-red-600 hover:text-red-800 text-sm"
                                  disabled={actionLoading}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-200">
                {/* Select All Header */}
                <div className="p-3 bg-gray-50 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedJobs.length === jobs.length}
                    onChange={selectAll}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </div>

                {jobs.map((job) => {
                  const effectiveStatus = job.status || (job.isActive ? 'active' : 'deleted');
                  return (
                    <div key={job.id} className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={() => toggleSelection(job.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-600">{job.companyName}</p>
                            </div>
                            {getStatusBadge(job.status, job.isActive)}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <p>{job.category}</p>
                            <p>{job.location}, {job.country}</p>
                            <p>{formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)}</p>
                            <p>Posted: {job.postedAt.toLocaleDateString()}</p>
                            {job.onHoldReason && (
                              <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded mt-2">
                                Reason: {job.onHoldReason}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {effectiveStatus === 'active' && canHoldJobs(admin) && (
                              <button
                                onClick={() => handleHoldJob(job.id)}
                                className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                disabled={actionLoading}
                              >
                                Hold
                              </button>
                            )}
                            {effectiveStatus === 'on-hold' && canHoldJobs(admin) && (
                              <button
                                onClick={() => handleUnholdJob(job.id)}
                                className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                disabled={actionLoading}
                              >
                                Activate
                              </button>
                            )}
                            {effectiveStatus !== 'deleted' && canDeleteJobs(admin) && (
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                disabled={actionLoading}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Hold Job Modal */}
        {showHoldModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Hold Job</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for holding this job:
                </label>
                <textarea
                  value={holdReason}
                  onChange={(e) => setHoldReason(e.target.value)}
                  className="w-full border rounded px-3 py-2 h-24 text-sm"
                  placeholder="Enter reason..."
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowHoldModal(false);
                    setHoldReason('');
                    setTargetJobId(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50 text-sm order-2 sm:order-1"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmHoldJob}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-sm order-1 sm:order-2"
                  disabled={actionLoading || !holdReason.trim()}
                >
                  {actionLoading ? 'Holding...' : 'Hold Job'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
