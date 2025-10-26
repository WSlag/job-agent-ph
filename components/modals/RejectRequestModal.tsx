'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { useAuth } from '@/contexts/AuthContext';
import { rejectFeaturedRequest } from '@/lib/featured-job-helpers';
import { FeaturedJobRequestWithDetails } from '@/types';
import { XCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: FeaturedJobRequestWithDetails;
  onSuccess?: () => void;
}

export default function RejectRequestModal({
  isOpen,
  onClose,
  request,
  onSuccess,
}: RejectRequestModalProps) {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const predefinedReasons = [
    'Payment verification failed',
    'Insufficient payment amount',
    'Job does not meet quality standards',
    'All featured slots are currently filled',
    'Duplicate request',
    'Agency account not verified',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to reject requests');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setLoading(true);

    try {
      await rejectFeaturedRequest(request.id, reason.trim(), user.uid);
      toast.success('Featured job request rejected');

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      const errorMessage = error.message || 'Failed to reject request';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setReason('');
      onClose();
    }
  };

  const selectPredefinedReason = (predefinedReason: string) => {
    setReason(predefinedReason);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Featured Job Request"
      maxWidth="lg"
      showCloseButton={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Details */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-red-600 p-2 rounded-lg flex-shrink-0">
              <XCircle className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-900 mb-2">Request to Reject</p>
              <div className="space-y-1 text-sm text-red-800">
                <p>
                  <span className="font-medium">Job:</span> {request.job?.title}
                </p>
                <p>
                  <span className="font-medium">Company:</span> {request.job?.companyName}
                </p>
                <p>
                  <span className="font-medium">Agency:</span> {request.agency?.companyName}
                </p>
                <p>
                  <span className="font-medium">Payment:</span> {request.currency}{' '}
                  {request.paymentAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Rejection Reasons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select Reason (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {predefinedReasons.map((predefinedReason) => (
              <button
                key={predefinedReason}
                type="button"
                onClick={() => selectPredefinedReason(predefinedReason)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  reason === predefinedReason
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {predefinedReason}
              </button>
            ))}
          </div>
        </div>

        {/* Rejection Reason */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Reason *
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Provide a clear reason for rejecting this request. This will be visible to the agency."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
          <p className="mt-1 text-xs text-gray-600">
            Be professional and specific. The agency will receive this feedback.
          </p>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 mb-1">Important</p>
              <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
                <li>This action cannot be undone</li>
                <li>The agency will be notified of the rejection</li>
                <li>The agency can submit a new request if needed</li>
                <li>Consider providing constructive feedback to help the agency</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle size={20} />
                Reject Request
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
