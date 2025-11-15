'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDbInstance } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  ArrowLeft,
  Shield,
  Clock,
  Mail,
  Info,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { markBulkMessageAsRead } from '@/lib/admin-messaging-helpers';
import { AdminMessage } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export default function UserBulkMessagePage() {
  const router = useRouter();
  const params = useParams();
  const messageId = params.messageId as string;
  const { user, userType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<AdminMessage | null>(null);
  const [adminInfo, setAdminInfo] = useState<{ name: string; role: string } | null>(null);

  // Load bulk message
  useEffect(() => {
    if (!messageId || !user) return;

    const loadMessage = async () => {
      const db = getDbInstance();
      setLoading(true);

      try {
        const messageDoc = await getDoc(doc(db, 'adminMessages', messageId));

        if (!messageDoc.exists()) {
          toast.error('Message not found');
          router.push('/notifications');
          return;
        }

        const data = messageDoc.data() as AdminMessage;

        // Check if user is a recipient
        if (!data.recipientIds?.includes(user.uid)) {
          toast.error('You do not have permission to view this message');
          router.push('/notifications');
          return;
        }

        setMessage({
          id: messageDoc.id,
          ...data,
        });

        // Get admin info
        const adminDoc = await getDoc(doc(db, 'admins', data.adminId));
        if (adminDoc.exists()) {
          const adminData = adminDoc.data();
          setAdminInfo({
            name: `${adminData.firstName} ${adminData.lastName}`,
            role: adminData.role || 'Admin',
          });
        }

        // Mark message as read
        if (!data.readBy?.[user.uid]) {
          await markBulkMessageAsRead(messageId, user.uid);
        }
      } catch (error) {
        console.error('Error loading message:', error);
        toast.error('Failed to load message');
        router.push('/notifications');
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [messageId, user, router]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!message) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-lg font-medium text-gray-900">Message not found</h2>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => router.push('/notifications')}
          >
            Back to Notifications
          </Button>
        </div>

        {/* Message Card */}
        <Card className="p-6">
          {/* Admin Info */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-900">
                  {adminInfo?.name || 'Admin'}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Official Admin Message
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {adminInfo?.role || 'Admin'} • Job Agent PH
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(message.sentAt?.toDate() || new Date(), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Subject */}
          {message.subject && (
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{message.subject}</h1>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>

          {/* Message Type Indicator */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="w-4 h-4" />
              <span>
                This is a bulk message sent to multiple recipients.
                {message.recipientType === 'jobhunter' && ' This message was sent to job hunters.'}
                {message.recipientType === 'agency' && ' This message was sent to agencies.'}
                {message.recipientType === 'all' && ' This message was sent to all users.'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/notifications')}
            >
              Back to Notifications
            </Button>

            <Button
              variant="primary"
              icon={Mail}
              onClick={() => {
                // Check if there's an existing conversation
                router.push('/messages');
              }}
            >
              View All Messages
            </Button>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            If you have questions about this message, you can contact support through the Messages section.
          </p>
        </div>
      </div>
    </Layout>
  );
}