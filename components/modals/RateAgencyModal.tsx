'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import { submitAgencyRating } from '@/lib/agency-rating';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface RateAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId: string;
  agencyName: string;
  existingRating?: number;
  onRatingSubmitted?: () => void;
}

export default function RateAgencyModal({
  isOpen,
  onClose,
  agencyId,
  agencyName,
  existingRating,
  onRatingSubmitted,
}: RateAgencyModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to rate agencies');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitAgencyRating(agencyId, user.uid, rating);
      toast.success(existingRating ? 'Rating updated successfully!' : 'Rating submitted successfully!');
      onRatingSubmitted?.();
      onClose();
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast.error(error.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {existingRating ? 'Update Your Rating' : 'Rate This Agency'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <p className="text-gray-600">
            How would you rate <span className="font-semibold">{agencyName}</span>?
          </p>

          <div className="flex justify-center py-4">
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size={40}
            />
          </div>

          {rating > 0 && (
            <p className="text-center text-sm text-gray-500">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : existingRating ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
}
