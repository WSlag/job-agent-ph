'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import {
  getAdminAuditLogs,
  formatAuditAction,
  getActionBadgeColor,
  AuditLogFilters,
} from '@/lib/audit-helpers';
import { canViewAuditLogs } from '@/lib/permission-helpers';
import { AuditLog, AuditAction, AuditResourceType, Admin } from '@/types';
import { ScrollText, Filter, Download } from 'lucide-react';

export default function AuditLogsPage() {
  const { userProfile } = useAuth();
  const admin = userProfile as Admin;

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuditLogFilters>({
    limit: 100,
  });

  useEffect(() => {
    if (!canViewAuditLogs(admin)) {
      return;
    }
    loadLogs();
  }, [filters]);

  async function loadLogs() {
    setLoading(true);
    try {
      const fetchedLogs = await getAdminAuditLogs(filters);
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error loading audit logs:', error);
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    const headers = ['Timestamp', 'Admin', 'Action', 'Resource Type', 'Resource ID', 'Details'];
    const rows = logs.map((log) => [
      log.timestamp.toISOString(),
      log.adminName,
      formatAuditAction(log.action),
      log.resourceType,
      log.resourceId,
      JSON.stringify(log.details),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getBadgeColorClass(color: string) {
    const colorMap: Record<string, string> = {
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    return colorMap[color] || colorMap.gray;
  }

  if (!canViewAuditLogs(admin)) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-semibold mb-2">
              You do not have permission to view audit logs.
            </p>
            <div className="mt-4 p-3 bg-white rounded border border-red-300">
              <p className="text-sm text-gray-700 mb-2">Debug Info:</p>
              <p className="text-xs text-gray-600">Role: {admin?.role || 'Not set'}</p>
              <p className="text-xs text-gray-600">
                Permissions: {admin?.permissions?.length || 0} permission(s)
              </p>
              {admin?.permissions && admin.permissions.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Has permissions: {admin.permissions.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <ScrollText className="text-gray-700" size={24} />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Audit Logs</h1>
              <p className="text-sm md:text-base text-gray-600">Track all admin actions and system events</p>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            disabled={logs.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={16} />
            Export to CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Filter size={18} className="text-gray-600" />
            <h3 className="text-sm md:text-base font-medium text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Action Type
              </label>
              <select
                value={filters.action || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    action: e.target.value as AuditAction | undefined,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">All Actions</option>
                <option value="job_held">Job Held</option>
                <option value="job_unheld">Job Unheld</option>
                <option value="job_deleted">Job Deleted</option>
                <option value="user_suspended">User Suspended</option>
                <option value="user_unsuspended">User Unsuspended</option>
                <option value="user_deleted">User Deleted</option>
                <option value="featured_request_approved">Featured Request Approved</option>
                <option value="featured_request_rejected">Featured Request Rejected</option>
                <option value="settings_updated">Settings Updated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <select
                value={filters.resourceType || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    resourceType: e.target.value as AuditResourceType | undefined,
                  })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">All Resources</option>
                <option value="job">Jobs</option>
                <option value="user">Users</option>
                <option value="agency">Agencies</option>
                <option value="jobhunter">Job Hunters</option>
                <option value="featured_request">Featured Requests</option>
                <option value="settings">Settings</option>
              </select>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                Limit
              </label>
              <select
                value={filters.limit || 100}
                onChange={(e) =>
                  setFilters({ ...filters, limit: Number(e.target.value) })
                }
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="50">Last 50</option>
                <option value="100">Last 100</option>
                <option value="250">Last 250</option>
                <option value="500">Last 500</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ limit: 100 });
                }}
                className="w-full px-4 py-2 border rounded text-sm hover:bg-gray-50"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 md:p-8 text-center text-sm text-gray-500">Loading audit logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-6 md:p-8 text-center text-sm text-gray-500">No audit logs found</div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Admin
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Resource
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => {
                    const badgeColor = getActionBadgeColor(log.action);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <div>{log.timestamp.toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {log.adminName}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColorClass(
                              badgeColor
                            )}`}
                          >
                            {formatAuditAction(log.action)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-medium capitalize">{log.resourceType}</div>
                          <div className="text-xs text-gray-500 font-mono">
                            {log.resourceId.substring(0, 12)}...
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {log.details.reason && (
                            <div className="max-w-xs truncate" title={log.details.reason}>
                              Reason: {log.details.reason}
                            </div>
                          )}
                          {log.details.expiryDays && (
                            <div className="text-xs text-gray-500">
                              Duration: {log.details.expiryDays === 'permanent' ? 'Permanent' : `${log.details.expiryDays} days`}
                            </div>
                          )}
                          {log.details.bulkAction && (
                            <div className="text-xs text-blue-600">Bulk Action</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {logs.map((log) => {
                const badgeColor = getActionBadgeColor(log.action);
                return (
                  <div key={log.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColorClass(
                              badgeColor
                            )}`}
                          >
                            {formatAuditAction(log.action)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {log.adminName}
                        </p>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p>
                            <span className="font-medium capitalize">{log.resourceType}</span>
                          </p>
                          <p className="font-mono text-xs break-all">
                            {log.resourceId}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 text-right ml-3">
                        <div>{log.timestamp.toLocaleDateString()}</div>
                        <div>{log.timestamp.toLocaleTimeString()}</div>
                      </div>
                    </div>
                    {log.details.reason && (
                      <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                        <span className="font-medium">Reason:</span> {log.details.reason}
                      </div>
                    )}
                    {log.details.expiryDays && (
                      <div className="text-xs text-gray-500 mt-1">
                        Duration: {log.details.expiryDays === 'permanent' ? 'Permanent' : `${log.details.expiryDays} days`}
                      </div>
                    )}
                    {log.details.bulkAction && (
                      <div className="text-xs text-blue-600 font-medium mt-1">Bulk Action</div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
          )}
        </div>

        {/* Stats Footer */}
        {logs.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {logs.length} audit log entries
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
