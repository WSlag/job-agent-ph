'use client';

import { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { useAuth } from '@/contexts/AuthContext';
import { createFeaturedRequest, canRequestFeaturedJob } from '@/lib/featured-job-helpers';
import { getAgencyJobs } from '@/lib/job-helpers';
import { Job, PaymentMethod } from '@/types';
import { Star, DollarSign, FileText, CreditCard, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { logUserActivity } from '@/lib/activity-helpers';

interface FeaturedRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'gcash', label: 'GCash' },
  { value: 'paymaya', label: 'PayMaya' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'other', label: 'Other' },
];

export default function FeaturedRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: FeaturedRequestModalProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [canRequest, setCanRequest] = useState(true);

  const [formData, setFormData] = useState({
    jobId: '',
    paymentMethod: 'bank_transfer' as PaymentMethod,
    paymentReference: '',
    paymentAmount: '',
    currency: 'PHP',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && user) {
      loadAgencyJobs();
      checkAvailability();
    }
  }, [isOpen, user]);

  const loadAgencyJobs = async () => {
    if (!user) return;

    setLoadingJobs(true);
    try {
      const agencyJobs = await getAgencyJobs(user.uid);
      // Filter to only active, non-featured jobs
      const availableJobs = agencyJobs.filter(
        (job) => job.isActive && !job.isFeatured
      );
      setJobs(availableJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  const checkAvailability = async () => {
    try {
      const result = await canRequestFeaturedJob();
      setCanRequest(result.canRequest);
      setAvailabilityMessage(result.message);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.jobId) {
      newErrors.jobId = 'Please select a job to feature';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (!formData.paymentReference.trim()) {
      newErrors.paymentReference = 'Payment reference is required';
    }

    if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Please enter a valid payment amount';
    }

    if (!formData.currency.trim()) {
      newErrors.currency = 'Currency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!user) {
      toast.error('You must be logged in to submit a request');
      return;
    }

    setLoading(true);

    try {
      await createFeaturedRequest({
        jobId: formData.jobId,
        agencyId: user.uid,
        paymentMethod: formData.paymentMethod,
        paymentReference: formData.paymentReference.trim(),
        paymentAmount: parseFloat(formData.paymentAmount),
        currency: formData.currency.trim(),
        notes: formData.notes.trim() || undefined,
      });

      toast.success('Featured job request submitted successfully!');

      // Log activity
      logUserActivity({
        userId: user.uid,
        userType: 'agency',
        userName: user.displayName || 'Agency',
        activityType: 'featured_request_submitted',
        title: 'Featured Request Submitted',
        description: `Submitted featured job request`,
        resourceType: 'job',
        resourceId: formData.jobId,
        metadata: { paymentMethod: formData.paymentMethod, amount: formData.paymentAmount },
      });

      // Reset form
      setFormData({
        jobId: '',
        paymentMethod: 'bank_transfer',
        paymentReference: '',
        paymentAmount: '',
        currency: 'PHP',
        notes: '',
      });

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error('Error submitting featured request:', error);
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        jobId: '',
        paymentMethod: 'bank_transfer',
        paymentReference: '',
        paymentAmount: '',
        currency: 'PHP',
        notes: '',
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Request Featured Job Placement"
      maxWidth="lg"
      showCloseButton={!loading}
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Star className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Feature Your Job in the Homepage Carousel
              </p>
              <p className="text-xs text-blue-700">
                Featured jobs get premium visibility on the homepage carousel, reaching thousands of job seekers.
              </p>
            </div>
          </div>
        </div>

        {/* Availability Message */}
        {availabilityMessage && (
          <div
            className={`border rounded-lg p-3 text-sm ${
              canRequest
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {availabilityMessage}
          </div>
        )}

        {!canRequest ? (
          <div className="text-center py-8">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              All featured job slots are currently filled. Please check back later.
            </p>
            <button
              onClick={handleClose}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Job Selection */}
            <div>
              <label htmlFor="jobId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Job to Feature *
              </label>
              {loadingJobs ? (
                <div className="border border-gray-300 rounded-lg p-4 text-center">
                  <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-sm text-gray-600">Loading your jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="border border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="text-gray-300 mx-auto mb-2" size={32} />
                  <p className="text-sm text-gray-600">
                    No jobs available to feature. Post a job first.
                  </p>
                </div>
              ) : (
                <>
                  <select
                    id="jobId"
                    name="jobId"
                    value={formData.jobId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.jobId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">-- Select a job --</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.location}, {job.country}
                      </option>
                    ))}
                  </select>
                  {errors.jobId && (
                    <p className="mt-1 text-sm text-red-600">{errors.jobId}</p>
                  )}
                </>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <div className="relative">
                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
              )}
            </div>

            {/* Payment Reference */}
            <div>
              <label htmlFor="paymentReference" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Reference Number *
              </label>
              <input
                type="text"
                id="paymentReference"
                name="paymentReference"
                value={formData.paymentReference}
                onChange={handleChange}
                placeholder="e.g., TXN123456789"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.paymentReference ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.paymentReference && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentReference}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter your transaction or reference number from the payment
              </p>
            </div>

            {/* Payment Amount & Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    id="paymentAmount"
                    name="paymentAmount"
                    value={formData.paymentAmount}
                    onChange={handleChange}
                    placeholder="5000"
                    step="0.01"
                    min="0"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                {errors.paymentAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.paymentAmount}</p>
                )}
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  placeholder="PHP"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.currency ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.currency && (
                  <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional information about your payment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || loadingJobs || jobs.length === 0}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star size={20} />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </BaseModal>
  );
}
