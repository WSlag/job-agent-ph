'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';

interface ConversationPreview {
  id: string;
  agencyName: string;
  jobTitle?: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

interface MessagesWidgetProps {
  loading?: boolean;
}

export default function MessagesWidget({ loading: initialLoading }: MessagesWidgetProps) {
  const { user, sessionReady } = useAuth();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !sessionReady) {
      setLoading(false);
      return;
    }

    const fetchRecentConversations = async () => {
      let retries = 0;
      const maxRetries = 5;
      const baseDelay = 3000; // Start with 3 seconds

      while (retries <= maxRetries) {
        try {
          // Wait before attempting query (exponential backoff)
          const delay = retries === 0 ? 8000 : baseDelay * Math.pow(2, retries - 1);
          await new Promise(resolve => setTimeout(resolve, delay));

          const db = getDbInstance();
          const conversationsRef = collection(db, 'conversations');
          const q = query(
            conversationsRef,
            where('jobHunterId', '==', user.uid),
            orderBy('updatedAt', 'desc'),
            limit(3)
          );

          const snapshot = await getDocs(q);
          const conversationPreviews: ConversationPreview[] = [];

          for (const docSnap of snapshot.docs) {
            const data = docSnap.data();

            // Fetch agency details
            let agencyName = 'Unknown Agency';
            if (data.agencyId) {
              const agencyDoc = await getDoc(doc(db, 'users', data.agencyId));
              const agencyData = agencyDoc.data();
              agencyName = agencyData?.companyName || agencyData?.firstName || 'Unknown Agency';
            }

            // Fetch job title if available
            let jobTitle: string | undefined;
            if (data.jobId) {
              const jobDoc = await getDoc(doc(db, 'jobs', data.jobId));
              const jobData = jobDoc.data();
              jobTitle = jobData?.title;
            }

            conversationPreviews.push({
              id: docSnap.id,
              agencyName,
              jobTitle,
              lastMessage: data.lastMessage?.text || 'No messages yet',
              timestamp: data.lastMessage?.createdAt?.toDate() || data.createdAt?.toDate() || new Date(),
              unread: data.lastMessage?.senderId !== user.uid && data.lastMessage?.read === false,
            });
          }

          setConversations(conversationPreviews);
          // Success - exit the retry loop
          break;
        } catch (error: any) {
          // Check if it's a permission error and we have retries left
          const isPermissionError =
            error?.code === 'permission-denied' ||
            error?.message?.includes('Missing or insufficient permissions');

          if (isPermissionError && retries < maxRetries) {
            console.log(`[MessagesWidget] Permission denied, retrying (${retries + 1}/${maxRetries})...`);
            retries++;
            continue;
          }

          // Either not a permission error, or we're out of retries
          console.error('Error fetching conversations:', error);
          break;
        }
      }

      setLoading(false);
    };

    fetchRecentConversations();
  }, [user?.uid, sessionReady]);

  if (loading || initialLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2 text-sm">No messages yet</p>
          <p className="text-xs text-gray-500 mb-4">
            Apply to jobs to start conversations with agencies
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
        <Link
          href="/messages"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group relative"
          >
            {conversation.unread && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-error-500 rounded-full" />
            )}
            <div className="mb-2">
              <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                {conversation.agencyName}
              </h4>
              {conversation.jobTitle && (
                <p className="text-xs text-gray-500 truncate">{conversation.jobTitle}</p>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate mb-2">
              {conversation.lastMessage}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/messages"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center gap-2"
        >
          View All Messages
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
