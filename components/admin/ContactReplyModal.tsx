'use client';

import { useState } from 'react';
import { X, Send, Loader2, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface ContactReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    referenceNumber: string;
  };
  adminUserId?: string;
  onSuccess?: () => void;
}

export default function ContactReplyModal({
  isOpen,
  onClose,
  contact,
  adminUserId,
  onSuccess,
}: ContactReplyModalProps) {
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    if (replyMessage.length > 5000) {
      toast.error('Message is too long (max 5000 characters)');
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`/api/contacts/${contact.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyMessage,
          adminUserId: adminUserId || 'admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reply');
      }

      toast.success('Reply sent successfully!');
      setReplyMessage('');
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (sending) return;
    if (replyMessage.trim() && !confirm('Are you sure you want to close? Your message will be lost.')) {
      return;
    }
    setReplyMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Reply to Contact
                </h2>
                <p className="text-sm text-gray-500">
                  Sending to: {contact.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={sending}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Original Message Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-gray-700">Original Message</h3>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Ref: {contact.referenceNumber}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-600">From:</span>{' '}
                  <span className="text-gray-900">{contact.name}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600">Subject:</span>{' '}
                  <span className="text-gray-900">{contact.subject}</span>
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {contact.message}
                </p>
              </div>
            </div>

            {/* Reply Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                rows={10}
                disabled={sending}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {replyMessage.length} / 5000 characters
                </p>
                {replyMessage.length > 4500 && (
                  <p className="text-sm text-amber-600">
                    Approaching character limit
                  </p>
                )}
              </div>
            </div>

            {/* Email Preview Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Email will be sent FROM:</strong> contact@jobagentph.com<br />
                <strong>Subject:</strong> Re: {contact.subject}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={handleClose}
              variant="outline"
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              disabled={sending || !replyMessage.trim()}
              className="flex items-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
