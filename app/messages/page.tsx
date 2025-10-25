'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HeaderDesign1Enhanced from '@/components/layout/HeaderDesign1Enhanced';
import { Conversation, Job, Agency, JobHunter } from '@/types';
import { subscribeToConversations, getOrCreateConversation } from '@/lib/messaging-helpers';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Loader2, Inbox } from 'lucide-react';
import Link from 'next/link';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userType, userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsWithDetails, setConversationsWithDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/messages');
      return;
    }

    if (!userType) {
      return;
    }

    // Check if we need to create a new conversation (coming from job details)
    const jobId = searchParams.get('jobId');
    if (jobId) {
      handleCreateConversationFromJob(jobId);
    }

    // Subscribe to conversations
    const unsubscribe = subscribeToConversations(
      user.uid,
      userType,
      (updatedConversations) => {
        setConversations(updatedConversations);
        loadConversationDetails(updatedConversations);
      }
    );

    return () => unsubscribe();
  }, [user, userType]);

  const handleCreateConversationFromJob = async (jobId: string) => {
    try {
      if (!user || !userType) return;

      // Fetch job to get agency ID
      const jobDoc = await getDoc(doc(db, COLLECTIONS.JOBS, jobId));
      if (!jobDoc.exists()) {
        alert('Job not found');
        return;
      }

      const jobData = jobDoc.data();
      const agencyId = jobData.agencyId;

      if (userType === 'jobhunter') {
        // Create or get conversation
        const conversationId = await getOrCreateConversation(
          jobId,
          user.uid,
          agencyId
        );

        // Navigate to the conversation
        router.push(`/messages/${conversationId}`);
      } else {
        alert('Only job hunters can message agencies about jobs');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to start conversation');
    }
  };

  const loadConversationDetails = async (convos: Conversation[]) => {
    try {
      const detailsPromises = convos.map(async (convo) => {
        const [jobDoc, agencyDoc, jobHunterDoc] = await Promise.all([
          getDoc(doc(db, COLLECTIONS.JOBS, convo.jobId)),
          getDoc(doc(db, COLLECTIONS.AGENCIES, convo.agencyId)),
          getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, convo.jobHunterId)),
        ]);

        return {
          ...convo,
          job: jobDoc.exists() ? { id: jobDoc.id, ...jobDoc.data() } : null,
          agency: agencyDoc.exists() ? { id: agencyDoc.id, ...agencyDoc.data() } : null,
          jobHunter: jobHunterDoc.exists()
            ? { id: jobHunterDoc.id, ...jobHunterDoc.data() }
            : null,
        };
      });

      const details = await Promise.all(detailsPromises);
      setConversationsWithDetails(details);
    } catch (error) {
      console.error('Error loading conversation details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <HeaderDesign1Enhanced hideSearch />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <HeaderDesign1Enhanced hideSearch />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-blue-100">
              {userType === 'jobhunter'
                ? 'Chat with recruitment agencies'
                : 'Chat with job hunters'}
            </p>
          </div>

          {/* Conversations List */}
          <div className="divide-y">
            {conversationsWithDetails.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No messages yet
                </h2>
                <p className="text-gray-500 mb-6">
                  {userType === 'jobhunter'
                    ? 'Start a conversation by clicking "Message Agency" on a job posting'
                    : 'Job hunters will reach out to you about job opportunities'}
                </p>
                {userType === 'jobhunter' && (
                  <Link
                    href="/jobs"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                )}
              </div>
            ) : (
              conversationsWithDetails.map((convo) => {
                const otherParty =
                  userType === 'jobhunter' ? convo.agency : convo.jobHunter;
                const otherPartyName =
                  userType === 'jobhunter'
                    ? convo.agency?.companyName
                    : `${convo.jobHunter?.firstName} ${convo.jobHunter?.lastName}`;

                return (
                  <Link
                    key={convo.id}
                    href={`/messages/${convo.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                          {otherPartyName?.charAt(0) || '?'}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Name and Job Title */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {otherPartyName}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">
                                {convo.job?.title || 'Job position'}
                              </p>
                            </div>
                            {convo.lastMessage && (
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatDistanceToNow(
                                  new Date(convo.lastMessage.createdAt),
                                  { addSuffix: true }
                                )}
                              </span>
                            )}
                          </div>

                          {/* Last Message */}
                          {convo.lastMessage ? (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {convo.lastMessage.senderType === userType
                                ? 'You: '
                                : ''}
                              {convo.lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic">
                              No messages yet
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 pt-16">
          <HeaderDesign1Enhanced hideSearch />
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
