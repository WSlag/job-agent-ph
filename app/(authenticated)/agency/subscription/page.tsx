'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Subscription, SubscriptionPayment } from '@/types';
import { CreditCard, Calendar, CheckCircle, Clock, XCircle, Upload, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UpgradeModal from '@/components/subscription/UpgradeModal';
import UsageMeter from '@/components/subscription/UsageMeter';
import PricingExplainerModal from '@/components/pricing/PricingExplainerModal';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    fetchSubscriptionData();
  }, [user, router]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);

      // Fetch subscription status
      const statusResponse = await fetch('/api/subscription/status');
      if (statusResponse.ok) {
        const data = await statusResponse.json();

        // Convert dates
        if (data.subscription) {
          data.subscription.startDate = data.subscription.startDate
            ? new Date(data.subscription.startDate)
            : undefined;
          data.subscription.endDate = data.subscription.endDate
            ? new Date(data.subscription.endDate)
            : undefined;
          data.subscription.createdAt = new Date(data.subscription.createdAt);
          data.subscription.updatedAt = new Date(data.subscription.updatedAt);
        }

        if (data.payments) {
          data.payments = data.payments.map((payment: any) => ({
            ...payment,
            createdAt: new Date(payment.createdAt),
            processedAt: payment.processedAt ? new Date(payment.processedAt) : undefined,
          }));
        }

        setSubscription(data.subscription);
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 h-64"></div>
            <div className="bg-white rounded-lg shadow p-6 h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  const plan = subscription?.plan || 'free';
  const status = subscription?.status || 'active';
  const lifetimeJobsPosted = subscription?.lifetimeJobsPosted || 0;
  const currentPeriodJobsPosted = subscription?.currentPeriodJobsPosted || 0;
  const endDate = subscription?.endDate;
  const isPremium = plan === 'premium' && status === 'active';
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const approvedPayments = payments.filter(p => p.status === 'completed');
  const rejectedPayments = payments.filter(p => p.status === 'failed');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
          <p className="text-gray-600 mt-1">Manage your subscription plan and payment history</p>
        </div>
        <button
          onClick={() => setShowPricingModal(true)}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          How pricing works
        </button>
      </div>

      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Plan Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Current Plan
            </h2>
            <div className={`px-3 py-1 rounded-full ${
              isPremium
                ? 'bg-green-100 text-green-600'
                : status === 'expired'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600'
            } font-medium text-sm`}>
              {isPremium ? 'Premium Active' : status === 'expired' ? 'Expired' : 'Free Tier'}
            </div>
          </div>

          <div className="space-y-4">
            {plan === 'free' ? (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Free Tier</p>
                  <p className="text-3xl font-bold text-gray-900">₱0</p>
                  <p className="text-sm text-gray-500">2 lifetime job posts</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Usage</p>
                  <UsageMeter current={lifetimeJobsPosted} limit={2} />
                  <p className="text-sm text-gray-600 mt-2">
                    {lifetimeJobsPosted} of 2 posts used
                  </p>
                </div>

                {lifetimeJobsPosted >= 2 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 font-medium mb-2">
                      Free limit reached
                    </p>
                    <p className="text-sm text-yellow-700 mb-3">
                      Upgrade to Premium for unlimited job postings
                    </p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-2">
                      Want unlimited posts?
                    </p>
                    <p className="text-sm text-blue-700 mb-3">
                      Upgrade to Premium for just ₱5,000/month
                    </p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Premium Monthly</p>
                  <p className="text-3xl font-bold text-gray-900">₱5,000</p>
                  <p className="text-sm text-gray-500">Unlimited job posts</p>
                </div>

                {endDate && (
                  <div className="flex items-center gap-2 text-sm border-t border-gray-200 pt-4">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {status === 'active' ? 'Renews on' : 'Expired on'}:{' '}
                      <span className="font-medium text-gray-900">
                        {endDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600 mb-1">Total Jobs Posted</p>
                  <p className="text-2xl font-semibold text-gray-900">{lifetimeJobsPosted}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {currentPeriodJobsPosted} this period
                  </p>
                </div>

                {status !== 'active' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium mb-2">
                      Subscription {status}
                    </p>
                    <p className="text-sm text-red-700 mb-3">
                      Renew your subscription to continue posting unlimited jobs
                    </p>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Renew Subscription
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Plan Comparison Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Benefits</h2>

          <div className="space-y-6">
            {/* Free Tier */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Free Tier</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">2 lifetime job posts</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Full applicant tracking</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Direct messaging</span>
                </li>
              </ul>
            </div>

            {/* Premium Tier */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Premium</h3>
                <span className="text-blue-600 font-semibold">₱5,000/mo</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Unlimited</strong> job posts</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">All Free tier features</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Featured job placement (₱10,000/job)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No payment history yet</p>
            <p className="text-sm text-gray-400 mt-1">
              {plan === 'free'
                ? 'Upgrade to Premium to start posting unlimited jobs'
                : 'Your payment submissions will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pending Payments */}
            {pendingPayments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Pending Verification</h3>
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">₱{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">
                            Submitted {payment.createdAt.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Payment method: {payment.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </div>
                    </div>
                    <p className="text-sm text-yellow-700 mt-3">
                      Your payment is being verified. This usually takes up to 24 hours.
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Approved Payments */}
            {approvedPayments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Approved</h3>
                {approvedPayments.map((payment) => (
                  <div key={payment.id} className="border border-green-200 bg-green-50 rounded-lg p-4 mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">₱{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">
                            Verified {payment.processedAt?.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Payment method: {payment.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Approved
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Rejected Payments */}
            {rejectedPayments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Rejected</h3>
                {rejectedPayments.map((payment) => (
                  <div key={payment.id} className="border border-red-200 bg-red-50 rounded-lg p-4 mb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">₱{payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">
                            Rejected {payment.processedAt?.toLocaleDateString()}
                          </p>
                          {payment.rejectionReason && (
                            <p className="text-sm text-red-700 mt-2">
                              Reason: {payment.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Rejected
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        agencyId={user?.uid || ''}
      />

      <PricingExplainerModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />
    </div>
  );
}
