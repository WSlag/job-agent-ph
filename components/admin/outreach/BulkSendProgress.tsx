'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Loader2, StopCircle } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import { OutreachBatch } from '@/types';

interface BulkSendProgressProps {
  batchId: string;
  onComplete: () => void;
  onCancel: () => void;
}

interface RecentActivity {
  email: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  timestamp: Date;
}

export default function BulkSendProgress({
  batchId,
  onComplete,
  onCancel,
}: BulkSendProgressProps) {
  const [batch, setBatch] = useState<OutreachBatch | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatchStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/outreach/bulk/${batchId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch batch status');
      }
      const data = await response.json();
      setBatch(data.batch);

      // Build recent activity from recipients
      if (data.batch?.recipients) {
        const activity: RecentActivity[] = data.batch.recipients
          .filter((r: any) => r.status !== 'pending')
          .slice(-10)
          .map((r: any) => ({
            email: r.email,
            status: r.status,
            error: r.error,
            timestamp: r.sentAt ? new Date(r.sentAt) : new Date(),
          }))
          .reverse();
        setRecentActivity(activity);
      }

      // Check if completed
      if (data.batch?.status === 'completed' || data.batch?.status === 'cancelled') {
        setIsProcessing(false);
        if (data.batch.status === 'completed') {
          setTimeout(() => onComplete(), 1000);
        }
      }
    } catch (err) {
      setError('Failed to fetch batch status');
    }
  }, [batchId, onComplete]);

  const processNextBatch = useCallback(async () => {
    if (!batch || batch.status === 'completed' || batch.status === 'cancelled') {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/outreach/bulk/${batchId}/process`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process batch');
      }

      // Fetch updated status
      await fetchBatchStatus();
    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
    }
  }, [batch, batchId, fetchBatchStatus]);

  const handleCancel = async () => {
    if (isCancelling) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/admin/outreach/bulk/${batchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel batch');
      }

      await fetchBatchStatus();
      onCancel();
    } catch (err) {
      setError('Failed to cancel batch');
    } finally {
      setIsCancelling(false);
    }
  };

  // Initial fetch and start processing
  useEffect(() => {
    fetchBatchStatus();
  }, [fetchBatchStatus]);

  // Auto-process in intervals
  useEffect(() => {
    if (!batch || batch.status !== 'processing') return;

    const remainingCount = batch.totalRecipients - batch.sentCount - batch.failedCount - batch.skippedCount;
    if (remainingCount <= 0) return;

    const timer = setTimeout(() => {
      processNextBatch();
    }, 2000); // 2 second delay between batches

    return () => clearTimeout(timer);
  }, [batch, processNextBatch]);

  // Start processing on mount if pending
  useEffect(() => {
    if (batch?.status === 'pending') {
      processNextBatch();
    }
  }, [batch?.status, processNextBatch]);

  if (!batch) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading batch status...</span>
      </div>
    );
  }

  const progressPercent = batch.totalRecipients > 0
    ? Math.round(((batch.sentCount + batch.failedCount + batch.skippedCount) / batch.totalRecipients) * 100)
    : 0;

  const remainingCount = batch.totalRecipients - batch.sentCount - batch.failedCount - batch.skippedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {batch.status === 'completed'
            ? 'Batch Complete!'
            : batch.status === 'cancelled'
            ? 'Batch Cancelled'
            : 'Sending Outreach Emails...'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {batch.fileName}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <ProgressBar
          value={progressPercent}
          variant={batch.status === 'cancelled' ? 'warning' : batch.status === 'completed' ? 'success' : 'primary'}
          size="lg"
          showPercentage
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Sent</span>
          </div>
          <span className="text-xl font-bold text-green-700">{batch.sentCount}</span>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Failed</span>
          </div>
          <span className="text-xl font-bold text-red-700">{batch.failedCount}</span>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
            <StopCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Skipped</span>
          </div>
          <span className="text-xl font-bold text-yellow-700">{batch.skippedCount}</span>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Remaining</span>
          </div>
          <span className="text-xl font-bold text-blue-700">{remainingCount}</span>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">Recent Activity</h4>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <li
                  key={index}
                  className="px-4 py-2 flex items-center gap-3 text-sm"
                >
                  {activity.status === 'sent' ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className="font-mono text-gray-600 truncate flex-1">
                    {activity.email}
                  </span>
                  <span
                    className={`text-xs ${activity.status === 'sent' ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {activity.status === 'sent' ? 'Sent' : activity.error || 'Failed'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Actions */}
      {batch.status !== 'completed' && batch.status !== 'cancelled' && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isCancelling}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            {isCancelling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <StopCircle className="w-4 h-4" />
                Cancel Batch
              </>
            )}
          </button>
        </div>
      )}

      {/* Completion Message */}
      {batch.status === 'completed' && (
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-green-800">
            Successfully sent {batch.sentCount} email(s)!
            {batch.failedCount > 0 && ` (${batch.failedCount} failed)`}
          </p>
        </div>
      )}
    </div>
  );
}
