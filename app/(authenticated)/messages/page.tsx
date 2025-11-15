'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MobileNativeHeader from '@/components/layout/MobileNativeHeader';
import { Conversation, Job, Agency, JobHunter, AdminConversation } from '@/types';
import { subscribeToConversations, getOrCreateConversation } from '@/lib/messaging-helpers';
import { subscribeToAdminConversations } from '@/lib/admin-messaging-helpers';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Loader2, Inbox, Shield } from 'lucide-react';
import Link from 'next/link';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userType, userProfile, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [adminConversations, setAdminConversations] = useState<AdminConversation[]>([]);
  const [conversationsWithDetails, setConversationsWithDetails] = useState<any[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const creatingConversation = useRef(false); // Prevent duplicate conversation creation
  const touchStartY = useRef(0);
  const pullDistance = useRef(0);

  // Store referrer jobId in sessionStorage for smart back navigation
  useEffect(() => {
    const jobId = searchParams.get('jobId');
    if (jobId) {
      sessionStorage.setItem('messagesReferrer', jobId);
    }
  }, [searchParams]);

  // Smart back navigation handler - user-type aware
  const handleBack = useCallback(() => {
    const referrerJobId = sessionStorage.getItem('messagesReferrer');

    // Agency users always go back to their dashboard
    if (userType === 'agency') {
      router.push('/agency/dashboard');
      return;
    }

    // Job hunters: if came from job details page, go back there
    if (userType === 'jobhunter' && referrerJobId) {
      sessionStorage.removeItem('messagesReferrer');
      router.push(`/jobs/${referrerJobId}`);
      return;
    }

    // Otherwise (job hunters without referrer, guests), go to jobs listing
    router.push('/jobs');
  }, [router, userType]);

  // Memoize handleCreateConversationFromJob to prevent recreation
  const handleCreateConversationFromJob = useCallback(async (jobId: string) => {
    // Prevent duplicate calls
    if (creatingConversation.current) return;

    creatingConversation.current = true;
    try {
      if (!user || !userType) return;

      const db = getDbInstance();
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

        // Navigate to the conversation (replace to avoid navigation loop)
        router.replace(`/messages/${conversationId}`);
      } else {
        alert('Only job hunters can message agencies about jobs');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to start conversation');
    } finally {
      creatingConversation.current = false;
    }
  }, [user, userType, router]);

  // Memoize loadConversationDetails with batching to reduce N+1 queries
  const loadConversationDetails = useCallback(async (convos: Conversation[]) => {
    try {
      const db = getDbInstance();
      // Collect unique IDs to batch fetch
      const uniqueJobIds = [...new Set(convos.map(c => c.jobId))];
      const uniqueAgencyIds = [...new Set(convos.map(c => c.agencyId))];
      const uniqueJobHunterIds = [...new Set(convos.map(c => c.jobHunterId))];

      // Batch fetch all unique entities
      const [jobDocs, agencyDocs, jobHunterDocs] = await Promise.all([
        Promise.all(uniqueJobIds.map(id => getDoc(doc(db, COLLECTIONS.JOBS, id)))),
        Promise.all(uniqueAgencyIds.map(id => getDoc(doc(db, COLLECTIONS.AGENCIES, id)))),
        Promise.all(uniqueJobHunterIds.map(id => getDoc(doc(db, COLLECTIONS.JOB_HUNTERS, id)))),
      ]);

      // Create lookup maps for O(1) access
      const jobsMap = new Map(
        jobDocs.map(d => [d.id, d.exists() ? { id: d.id, ...d.data() } : null])
      );
      const agenciesMap = new Map(
        agencyDocs.map(d => [d.id, d.exists() ? { id: d.id, ...d.data() } : null])
      );
      const jobHuntersMap = new Map(
        jobHunterDocs.map(d => [d.id, d.exists() ? { id: d.id, ...d.data() } : null])
      );

      // Map conversations with their details using lookup maps
      const details = convos.map(convo => ({
        ...convo,
        job: jobsMap.get(convo.jobId) || null,
        agency: agenciesMap.get(convo.agencyId) || null,
        jobHunter: jobHuntersMap.get(convo.jobHunterId) || null,
      }));

      setConversationsWithDetails(details);
    } catch (error) {
      console.error('Error loading conversation details:', error);
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    if (refreshing || !user || !userType) return;

    setRefreshing(true);
    try {
      // Force reload conversations
      if (conversations.length > 0) {
        await loadConversationDetails(conversations);
      }
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, user, userType, conversations, loadConversationDetails]);

  useEffect(() => {
    // Wait for AuthContext to finish loading before making authentication decisions
    if (authLoading) {
      return;
    }

    if (!user) {
      // Redirect unauthenticated users to signup page
      const jobId = searchParams.get('jobId');
      const agencyId = searchParams.get('agencyId');
      const params = new URLSearchParams({ redirect: '/messages' });
      if (jobId) params.append('jobId', jobId);
      if (agencyId) params.append('agencyId', agencyId);
      router.push(`/auth/signup?${params.toString()}`);
      return;
    }

    if (!userType) {
      // Keep loading state active while userType is being determined
      setConversationsLoading(true);
      return;
    }

    // Check if we need to create a new conversation (coming from job details)
    const jobId = searchParams.get('jobId');
    if (jobId) {
      handleCreateConversationFromJob(jobId);
    }

    // Subscribe to regular conversations
    const unsubscribeRegular = subscribeToConversations(
      user.uid,
      userType,
      (updatedConversations) => {
        setConversations(updatedConversations);
        loadConversationDetails(updatedConversations);
      }
    );

    // Subscribe to admin conversations
    const db = getDbInstance();
    const adminConvRef = collection(db, 'adminConversations');
    const adminConvQuery = query(adminConvRef, where('userId', '==', user.uid));

    const unsubscribeAdmin = onSnapshot(adminConvQuery, async (snapshot) => {
      const adminConvos: AdminConversation[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();

        // Get admin details
        const adminDoc = await getDoc(doc(db, 'admins', data.adminId));
        const adminData = adminDoc.data();

        adminConvos.push({
          id: doc.id,
          ...data,
          adminName: adminData ? `${adminData.firstName} ${adminData.lastName}` : 'Admin',
        } as AdminConversation);
      }

      setAdminConversations(adminConvos);
      setConversationsLoading(false);
    });

    return () => {
      unsubscribeRegular();
      unsubscribeAdmin();
    };
  }, [authLoading, user, userType, searchParams, router, handleCreateConversationFromJob, loadConversationDetails]);

  // Show loading state while authenticating or while userType/conversations are loading
  if (authLoading || conversationsLoading || (user && !userType)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileNativeHeader title="Messages" onBack={handleBack} />
        <div className="flex flex-col items-center justify-center py-20 pt-24">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileNativeHeader
        title="Messages"
        onBack={handleBack}
        hideOnScroll
        showShadowOnScroll
      />

      <div className="container mx-auto px-4 pt-20 pb-8 max-w-4xl">
        {/* Pull to refresh indicator */}
        {refreshing && (
          <div className="flex justify-center py-2">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        )}

        <div
          className="bg-white rounded-xl shadow-md overflow-hidden"
          onTouchStart={(e) => {
            if (typeof window !== 'undefined' && window.scrollY === 0) {
              touchStartY.current = e.touches[0].clientY;
            }
          }}
          onTouchMove={(e) => {
            if (typeof window !== 'undefined' && window.scrollY === 0 && touchStartY.current > 0) {
              const currentY = e.touches[0].clientY;
              pullDistance.current = Math.max(0, currentY - touchStartY.current);
            }
          }}
          onTouchEnd={() => {
            if (pullDistance.current > 80) {
              handleRefresh();
            }
            touchStartY.current = 0;
            pullDistance.current = 0;
          }}
        >
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
            {/* Admin Conversations */}
            {adminConversations.map((convo) => {
              const adminName = (convo as any).adminName || 'Admin';
              const unreadCount = convo.unreadCount_user || 0;

              return (
                <Link
                  key={`admin-${convo.id}`}
                  href={`/messages/admin/${convo.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Admin Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white flex-shrink-0">
                        <Shield className="w-6 h-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Admin Name and Badge */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {adminName}
                              </h3>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                Admin
                              </span>
                              {unreadCount > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                                  {unreadCount} new
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              Job Agent PH Support
                            </p>
                          </div>
                          {convo.lastMessage && convo.lastMessage.createdAt &&
                           !isNaN(new Date(convo.lastMessage.createdAt).getTime()) && (
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
                            {convo.lastMessage.senderType === 'user'
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
            })}

            {/* Regular Conversations */}
            {conversationsWithDetails.length === 0 && adminConversations.length === 0 ? (
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
                    ? convo.agency?.companyName || 'Deleted Agency'
                    : convo.jobHunter
                      ? `${convo.jobHunter.firstName || ''} ${convo.jobHunter.lastName || ''}`.trim() || 'Deleted User'
                      : 'Deleted User';

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
                                {convo.job?.title || 'Deleted Job'}
                              </p>
                            </div>
                            {convo.lastMessage && convo.lastMessage.createdAt &&
                             !isNaN(new Date(convo.lastMessage.createdAt).getTime()) && (
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
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gray-50">
            <MobileNativeHeader title="Messages" />
            <div className="flex items-center justify-center py-20 pt-24">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          </div>
        }
      >
        <MessagesContent />
      </Suspense>
    </ErrorBoundary>
  );
}
