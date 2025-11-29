'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, ChevronRight, Inbox } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, limit, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';

interface ConversationWithDetails {
  id: string;
  jobHunterName: string;
  jobTitle: string;
  lastMessage?: {
    content: string;
    createdAt: Date;
    senderId: string;
    read: boolean;
  };
  unreadCount: number;
}

export default function RecentMessagesWidget() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Subscribe to recent conversations
    const db = getDbInstance();
    const conversationsRef = collection(db, 'conversations');
    const conversationsQuery = query(
      conversationsRef,
      where('agencyId', '==', user.uid),
      orderBy('updatedAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(conversationsQuery, async (snapshot) => {
      const conversationPromises = snapshot.docs.map(async (conversationDoc) => {
        const data = conversationDoc.data();

        // Fetch job hunter details
        const jobHunterDoc = await getDoc(doc(db, 'jobHunters', data.jobHunterId));
        const jobHunterData = jobHunterDoc.data();

        // Fetch job details (only if jobId exists)
        let jobData = null;
        if (data.jobId) {
          const jobDoc = await getDoc(doc(db, 'jobs', data.jobId));
          jobData = jobDoc.data();
        }

        return {
          id: conversationDoc.id,
          jobHunterName: jobHunterData
            ? `${jobHunterData.firstName} ${jobHunterData.lastName}`
            : 'Deleted User',
          jobTitle: jobData?.title || 'Deleted Job',
          lastMessage: data.lastMessage
            ? {
                content: data.lastMessage.content,
                createdAt: data.lastMessage.createdAt?.toDate() || new Date(),
                senderId: data.lastMessage.senderId,
                read: data.lastMessage.read ?? true,
              }
            : undefined,
          unreadCount: data.unreadCount || 0, // Use the actual unreadCount field from conversation
        };
      });

      const conversationsWithDetails = await Promise.all(conversationPromises);
      setConversations(conversationsWithDetails);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Recent Messages
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Recent Messages
          </h2>
          <Link
            href="/messages"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No messages yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Job hunters will reach out to you about opportunities
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Recent Messages
        </h2>
        <Link
          href="/messages"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-2">
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className={`block p-3 rounded-lg border transition-colors hover:bg-gray-50 ${
              conversation.unreadCount > 0
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p
                    className={`font-medium text-sm truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {conversation.jobHunterName}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mb-1">{conversation.jobTitle}</p>
                {conversation.lastMessage && (
                  <p className="text-xs text-gray-600 truncate">
                    {conversation.lastMessage.content}
                  </p>
                )}
              </div>
              {conversation.lastMessage && (
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                  {formatDistanceToNow(conversation.lastMessage.createdAt, { addSuffix: true })}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
