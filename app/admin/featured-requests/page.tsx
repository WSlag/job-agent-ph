'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getFeaturedRequests } from '@/lib/featured-job-helpers';
import { FeaturedJobRequestWithDetails, FeaturedRequestStatus } from '@/types';
import {
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Building2,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import ApproveRequestModal from '@/components/modals/ApproveRequestModal';
import RejectRequestModal from '@/components/modals/RejectRequestModal';

export default function FeaturedRequestsPage() {
  const [requests, setRequests] = useState<FeaturedJobRequestWithDetails[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<FeaturedJobRequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<FeaturedRequestStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRequest, setSelectedRequest] = useState<FeaturedJobRequestWithDetails | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, selectedStatus, searchQuery]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getFeaturedRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((req) => req.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.job?.title.toLowerCase().includes(query) ||
          req.job?.companyName.toLowerCase().includes(query) ||
          req.agency?.companyName.toLowerCase().includes(query) ||
          req.paymentReference.toLowerCase().includes(query)
      );
    }

    setFilteredRequests(filtered);
  };

  const handleApprove = (request: FeaturedJobRequestWithDetails) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleReject = (request: FeaturedJobRequestWithDetails) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleModalSuccess = () => {
    loadRequests();
    setShowApproveModal(false);
    setShowRejectModal(false);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: FeaturedRequestStatus) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };

    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
    };

    const Icon = icons[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
      >
        <Icon size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Job Requests</h1>
          <p className="text-gray-600">
            Review and manage featured job placement requests from agencies
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as FeaturedRequestStatus | 'all')
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                <Search size={16} className="inline mr-1" />
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, company, reference..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
              <p className="text-gray-600">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="text-gray-300 mx-auto mb-4" size={48} />
              <p className="text-gray-600 mb-2">No requests found</p>
              <p className="text-sm text-gray-500">
                {selectedStatus !== 'all' || searchQuery
                  ? 'Try changing your filters'
                  : 'Featured job requests will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Agency
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      {/* Job Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                            <Briefcase className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {request.job?.title || 'Job not found'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {request.job?.location}, {request.job?.country}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Agency */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 size={16} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {request.agency?.companyName || 'Unknown'}
                          </span>
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              {request.currency} {request.paymentAmount.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 capitalize">
                            {request.paymentMethod.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            Ref: {request.paymentReference}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">{getStatusBadge(request.status)}</td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {formatDate(request.createdAt)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        {request.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(request)}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request)}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {request.reviewedAt
                              ? `Reviewed ${formatDate(request.reviewedAt)}`
                              : '-'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedRequest && (
        <>
          <ApproveRequestModal
            isOpen={showApproveModal}
            onClose={() => {
              setShowApproveModal(false);
              setSelectedRequest(null);
            }}
            request={selectedRequest}
            onSuccess={handleModalSuccess}
          />
          <RejectRequestModal
            isOpen={showRejectModal}
            onClose={() => {
              setShowRejectModal(false);
              setSelectedRequest(null);
            }}
            request={selectedRequest}
            onSuccess={handleModalSuccess}
          />
        </>
      )}
    </AdminLayout>
  );
}
