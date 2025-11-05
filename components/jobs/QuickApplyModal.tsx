'use client';

import React, { useState } from 'react';
import { X, AlertCircle, FileText, CheckCircle2, DollarSign, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Job } from '@/types';
import { ProgressBar, Badge } from '@/components/ui';

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  profileCompletionPercentage: number;
  hasResume: boolean;
  hasCertificates: boolean;
  hasValidId: boolean;
  onSubmit: (data: ApplicationData) => Promise<void>;
}

interface ApplicationData {
  coverLetter?: string;
  additionalNotes?: string;
}

/**
 * QuickApplyModal Component
 *
 * Quick apply flow for authenticated users
 * Shows warnings for incomplete profiles and missing documents
 * Estimates application processing cost
 */
export default function QuickApplyModal({
  isOpen,
  onClose,
  job,
  profileCompletionPercentage,
  hasResume,
  hasCertificates,
  hasValidId,
  onSubmit,
}: QuickApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isProfileComplete = profileCompletionPercentage >= 80;
  const hasAllDocuments = hasResume && hasCertificates && hasValidId;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        coverLetter: coverLetter || undefined,
        additionalNotes: additionalNotes || undefined,
      });
      onClose();
    } catch (error) {
      console.error('Application failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable';
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    return `Up to ${job.currency} ${job.salaryMax?.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">Apply to Job</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Job Summary Card */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 border-2 border-primary-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-1">{job.title}</h3>
              <p className="text-sm text-gray-700 mb-3">{job.companyName}</p>
              <div className="flex items-center gap-4 text-sm text-gray-700">
                <span className="flex items-center gap-1">
                  <DollarSign size={16} className="text-success-600" />
                  {formatSalary()}
                </span>
                <span>{job.location}, {job.country}</span>
              </div>
            </div>

            {/* Profile Completion Warning */}
            {!isProfileComplete && (
              <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-warning-900 mb-2">
                      Incomplete Profile
                    </h4>
                    <p className="text-sm text-warning-700 mb-3">
                      Your profile is only {profileCompletionPercentage}% complete.
                      Complete profiles have 3x higher success rates.
                    </p>
                    <ProgressBar
                      value={profileCompletionPercentage}
                      variant="warning"
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Document Checklist */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={18} />
                Required Documents
              </h4>
              <div className="space-y-2">
                <DocumentCheckItem
                  label="Resume / CV"
                  isAttached={hasResume}
                  isRequired
                />
                <DocumentCheckItem
                  label="Certificates / Licenses"
                  isAttached={hasCertificates}
                  isRequired={false}
                />
                <DocumentCheckItem
                  label="Valid ID"
                  isAttached={hasValidId}
                  isRequired={false}
                />
              </div>
              {!hasAllDocuments && (
                <p className="text-xs text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg">
                  💡 Tip: Applications with complete documents get 5x more responses
                </p>
              )}
            </div>

            {/* Cover Letter (Optional) */}
            <div>
              <button
                onClick={() => setShowCoverLetter(!showCoverLetter)}
                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-2"
              >
                <span>Cover Letter (Optional)</span>
                <span className="text-sm text-primary-600">
                  {showCoverLetter ? 'Hide' : 'Add'}
                </span>
              </button>
              {showCoverLetter && (
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the agency why you're a great fit for this position..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block font-semibold text-gray-900 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Any special requests or information..."
                className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                maxLength={300}
              />
            </div>

            {/* Cost Estimate */}
            <div className="bg-success-50 border border-success-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-success-900 mb-1">
                    No Placement Fee
                  </h4>
                  <p className="text-sm text-success-700">
                    This application is completely free. We don't charge job seekers any placement fees.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-info-50 border border-info-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-info-700">
                    By applying, you agree to share your profile information with {job.companyName}.
                    The agency will review your application and contact you if interested.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !hasResume}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Helper component for document checklist
function DocumentCheckItem({
  label,
  isAttached,
  isRequired,
}: {
  label: string;
  isAttached: boolean;
  isRequired: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {isAttached ? (
          <CheckCircle2 className="w-5 h-5 text-success-500" />
        ) : (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
        )}
        <span className="text-sm text-gray-900">
          {label}
          {isRequired && <span className="text-error-500 ml-1">*</span>}
        </span>
      </div>
      {isAttached ? (
        <Badge variant="success" size="sm">Attached</Badge>
      ) : (
        <Badge variant="default" size="sm">Missing</Badge>
      )}
    </div>
  );
}
