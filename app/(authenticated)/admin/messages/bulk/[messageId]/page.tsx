'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDbInstance } from '@/lib/firebase';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Eye,
  Send,
  Filter,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { AdminMessage } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function BulkMessageDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const messageId = params.messageId as string;
  const { user, userType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<AdminMessage | null>(null);
  const [recipientDetails, setRecipientDetails] = useState<{
    total: number;
    delivered: number;
    read: number;
    failed: number;
  }>({
    total: 0,
    delivered: 0,
    read: 0,
    failed: 0,
  });

  // Load bulk message details
  useEffect(() => {
    if (!messageId || !user || userType !== 'admin') return;

    const loadMessage = async () => {
      const db = getDbInstance();
      setLoading(true);

      try {
        const messageDoc = await getDoc(doc(db, 'adminMessages', messageId));

        if (!messageDoc.exists()) {
          toast.error('Message not found');
          router.push('/admin/messages');
          return;
        }

        const data = messageDoc.data() as AdminMessage;

        // Check if this admin can view this message
        if (data.adminId !== user.uid) {
          toast.error('You do not have permission to view this message');
          router.push('/admin/messages');
          return;
        }

        setMessage({
          ...data,
          id: messageDoc.id,
        });

        setRecipientDetails({
          total: data.recipientIds?.length || 0,
          delivered: data.deliveredCount || 0,
          read: data.readCount || 0,
          failed: data.failedCount || 0,
        });
      } catch (error) {
        console.error('Error loading message:', error);
        toast.error('Failed to load message');
        router.push('/admin/messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [messageId, user, userType, router]);

  const getStatusBadge = () => {
    if (!message) return null;

    const { status } = message;

    if (status === 'sent') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3" />
          Sent
        </span>
      );
    } else if (status === 'sending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3" />
          Sending
        </span>
      );
    } else if (status === 'failed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }

    return null;
  };

  const formatFilters = () => {
    if (!message?.filters) return null;

    const filters = message.filters;
    const filterItems: string[] = [];

    if (filters.userType && filters.userType !== 'all') {
      filterItems.push(`Type: ${filters.userType === 'jobhunter' ? 'Job Hunters' : 'Agencies'}`);
    }

    if (filters.location && filters.location.length > 0) {
      filterItems.push(`Locations: ${filters.location.join(', ')}`);
    }

    if (filters.skills && filters.skills.length > 0) {
      filterItems.push(`Skills: ${filters.skills.join(', ')}`);
    }

    if (filters.specializations && filters.specializations.length > 0) {
      filterItems.push(`Specializations: ${filters.specializations.join(', ')}`);
    }

    if (filters.experienceMin !== undefined || filters.experienceMax !== undefined) {
      const min = filters.experienceMin || 0;
      const max = filters.experienceMax || '∞';
      filterItems.push(`Experience: ${min}-${max} years`);
    }

    if (filters.verified !== undefined) {
      filterItems.push(`Verified: ${filters.verified ? 'Yes' : 'No'}`);
    }

    return filterItems.length > 0 ? filterItems : null;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!message) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-lg font-medium text-gray-900">Message not found</h2>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/messages')}
            >
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {message.subject || 'Bulk Message'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {getStatusBadge()}
                <span className="text-sm text-gray-600">
                  Sent {formatDistanceToNow(
                    message.sentAt
                      ? (message.sentAt as any).toDate
                        ? (message.sentAt as any).toDate()
                        : new Date(message.sentAt)
                      : new Date(),
                    { addSuffix: true }
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recipients</p>
                <p className="text-xl font-bold text-gray-900">{recipientDetails.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Delivered</p>
                <p className="text-xl font-bold text-gray-900">{recipientDetails.delivered}</p>
                {recipientDetails.total > 0 && (
                  <p className="text-xs text-gray-500">
                    {Math.round((recipientDetails.delivered / recipientDetails.total) * 100)}%
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-xl font-bold text-gray-900">{recipientDetails.read}</p>
                {recipientDetails.delivered > 0 && (
                  <p className="text-xs text-gray-500">
                    {Math.round((recipientDetails.read / recipientDetails.delivered) * 100)}%
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-xl font-bold text-gray-900">{recipientDetails.failed}</p>
                {recipientDetails.total > 0 && (
                  <p className="text-xs text-gray-500">
                    {Math.round((recipientDetails.failed / recipientDetails.total) * 100)}%
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Message Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Message Content</h2>

          {/* Subject */}
          {message.subject && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Subject</h3>
              <p className="text-gray-900">{message.subject}</p>
            </div>
          )}

          {/* Content */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Message</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>

          {/* Filters Applied */}
          {formatFilters() && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Filters Applied
              </h3>
              <div className="flex flex-wrap gap-2">
                {formatFilters()?.map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Sent by:</span>
                <span className="ml-2 text-gray-900">{message.adminName}</span>
              </div>
              <div>
                <span className="text-gray-600">Message ID:</span>
                <span className="ml-2 text-gray-900 font-mono">{message.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 text-gray-900">
                  {message.createdAt
                    ? (message.createdAt as any).toDate
                      ? (message.createdAt as any).toDate().toLocaleString()
                      : new Date(message.createdAt).toLocaleString()
                    : ''}
                </span>
              </div>
              {message.sentAt && (
                <div>
                  <span className="text-gray-600">Sent:</span>
                  <span className="ml-2 text-gray-900">
                    {(message.sentAt as any).toDate
                      ? (message.sentAt as any).toDate().toLocaleString()
                      : new Date(message.sentAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/messages')}
          >
            Back to Messages
          </Button>
          <Button
            variant="primary"
            icon={Mail}
            onClick={() => router.push('/admin/messages/compose')}
          >
            Compose New Message
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}