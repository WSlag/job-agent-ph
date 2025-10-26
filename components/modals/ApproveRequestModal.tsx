'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';
import { useAuth } from '@/contexts/AuthContext';
import { approveFeaturedRequest } from '@/lib/featured-job-helpers';
import { FeaturedJobRequestWithDetails } from '@/types';
import { CheckCircle, Star, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ApproveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: FeaturedJobRequestWithDetails;
  onSuccess?: () => void;
}

export default function ApproveRequestModal({
  isOpen,
  onClose,
  request,
  onSuccess,
}: ApproveRequestModalProps) {
  const { user } = useAuth();
  const [priority, setPriority] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to approve requests');
      return;
    }

    if (priority < 1 || priority > 5) {
      setError('Priority must be between 1 and 5');
      return;
    }

    setLoading(true);

    try {
      await approveFeaturedRequest(request.id, priority, user.uid);
      toast.success('Featured job request approved successfully!');

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error('Error approving request:', error);
      const errorMessage = error.message || 'Failed to approve request';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      setPriority(1);
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Approve Featured Job Request"
      maxWidth="lg"
      showCloseButton={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Request Details */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-2">Request Summary</p>
              <div className="space-y-1 text-sm text-blue-800">
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
                  {request.paymentAmount.toLocaleString()} via{' '}
                  {request.paymentMethod.replace('_', ' ')}
                </p>
                <p>
                  <span className="font-medium">Reference:</span> {request.paymentReference}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Selection */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            <Star size={16} className="inline mr-1" />
            Carousel Priority (1-5) *
          </label>
          <div className="space-y-2">
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value={1}>1 - First Position (Highest Priority)</option>
              <option value={2}>2 - Second Position</option>
              <option value={3}>3 - Third Position</option>
              <option value={4}>4 - Fourth Position</option>
              <option value={5}>5 - Fifth Position (Lowest Priority)</option>
            </select>
            <p className="text-xs text-gray-600">
              Priority 1 appears first in the carousel, priority 5 appears last. Choose the
              appropriate position based on payment tier or featured duration.
            </p>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 mb-1">Important</p>
              <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
                <li>The job will be featured immediately on the homepage carousel</li>
                <li>If this priority slot is occupied, existing jobs will be reordered</li>
                <li>You can reorder featured jobs later from the Featured Jobs page</li>
                <li>The agency will be notified of the approval</li>
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
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Approve Request
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
