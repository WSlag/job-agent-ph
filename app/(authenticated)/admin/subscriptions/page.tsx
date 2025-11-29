'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Subscription, SubscriptionPayment, Agency } from '@/types';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X
} from 'lucide-react';

interface SubscriptionWithAgency extends Subscription {
  agency?: {
    companyName: string;
    email: string;
  };
}

interface PaymentWithDetails extends SubscriptionPayment {
  agency?: {
    companyName: string;
    email: string;
  };
}

export default function AdminSubscriptionsPage() {
  const { user, userType } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'subscriptions'>('pending');
  const [pendingPayments, setPendingPayments] = useState<PaymentWithDetails[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithAgency[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'premium'>('all');
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user is admin
    if (userType !== 'admin') {
      router.push('/');
      return;
    }

    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch pending payments
      const paymentsResponse = await fetch('/api/admin/subscription/pending-payments');
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPendingPayments(paymentsData.payments || []);
      }

      // Fetch all subscriptions
      const subsResponse = await fetch('/api/admin/subscription/list');
      if (subsResponse.ok) {
        const subsData = await subsResponse.json();
        setSubscriptions(subsData.subscriptions || []);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    if (!confirm('Are you sure you want to approve this payment?')) return;

    try {
      setProcessingPaymentId(paymentId);

      const response = await fetch('/api/admin/subscription/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });

      if (response.ok) {
        alert('Payment approved successfully!');
        fetchData();
        setSelectedPayment(null);
      } else {
        const error = await response.json();
        alert(`Failed to approve payment: ${error.message}`);
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('An error occurred while approving the payment');
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setProcessingPaymentId(paymentId);

      const response = await fetch('/api/admin/subscription/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, reason }),
      });

      if (response.ok) {
        alert('Payment rejected successfully');
        fetchData();
        setSelectedPayment(null);
      } else {
        const error = await response.json();
        alert(`Failed to reject payment: ${error.message}`);
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('An error occurred while rejecting the payment');
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = !searchTerm ||
      sub.agency?.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.agency?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan = filterPlan === 'all' || sub.plan === filterPlan;

    return matchesSearch && matchesPlan;
  });

  const stats = {
    totalSubscriptions: subscriptions.length,
    activePremium: subscriptions.filter(s => s.plan === 'premium' && s.status === 'active').length,
    freeTier: subscriptions.filter(s => s.plan === 'free').length,
    pendingPayments: pendingPayments.length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-600 mt-1">Manage agency subscriptions and payment verifications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Subscriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalSubscriptions}</p>
            </div>
            <CreditCard className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Premium</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.activePremium}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Free Tier</p>
              <p className="text-3xl font-bold text-gray-600 mt-1">{stats.freeTier}</p>
            </div>
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pendingPayments}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'pending'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Payments ({stats.pendingPayments})
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'subscriptions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All Subscriptions ({stats.totalSubscriptions})
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Pending Payments Tab */}
          {activeTab === 'pending' && (
            <div>
              {pendingPayments.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No pending payments</p>
                  <p className="text-sm text-gray-400 mt-1">
                    All payment verifications are up to date
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <div key={payment.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {payment.agency?.companyName || 'Unknown Agency'}
                              </h3>
                              <p className="text-sm text-gray-600">{payment.agency?.email}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-600">Amount</p>
                              <p className="font-semibold text-gray-900">
                                ₱{payment.amount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Payment Method</p>
                              <p className="font-semibold text-gray-900">{payment.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Submitted</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Reference</p>
                              <p className="font-semibold text-gray-900 truncate">
                                {payment.paymentReference || 'N/A'}
                              </p>
                            </div>
                          </div>

                          {payment.proofImageUrl && (
                            <div className="mb-4">
                              <button
                                onClick={() => window.open(payment.proofImageUrl, '_blank')}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View Payment Proof
                              </button>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApprove(payment.id)}
                              disabled={processingPaymentId === payment.id}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Check className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(payment.id)}
                              disabled={processingPaymentId === payment.id}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Subscriptions Tab */}
          {activeTab === 'subscriptions' && (
            <div>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by agency name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Plans</option>
                  <option value="free">Free Tier</option>
                  <option value="premium">Premium</option>
                </select>
              </div>

              {/* Subscriptions Table */}
              {filteredSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No subscriptions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Agency
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Plan
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Jobs Posted
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Expiry
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredSubscriptions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {sub.agency?.companyName || 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-600">{sub.agency?.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sub.plan === 'premium'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {sub.plan === 'premium' ? 'Premium' : 'Free'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sub.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : sub.status === 'expired'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-gray-900">{sub.lifetimeJobsPosted || 0}</p>
                            <p className="text-xs text-gray-500">
                              {sub.currentPeriodJobsPosted || 0} this period
                            </p>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {sub.endDate
                              ? new Date(sub.endDate).toLocaleDateString()
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
