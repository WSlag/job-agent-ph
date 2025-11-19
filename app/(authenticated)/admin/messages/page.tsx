'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare,
  Send,
  Users,
  User,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Mail,
  Eye,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import {
  getAdminConversations,
  getAdminBulkMessages,
  getAdminMessageStats,
  subscribeToAdminConversations,
} from '@/lib/admin-messaging-helpers';
import {
  canSendMessages,
  canSendBulkMessages,
  requirePermission,
} from '@/lib/permission-helpers';
import { Permission, AdminConversation, AdminMessage } from '@/types';
import { formatDistanceToNow } from 'date-fns';

type TabType = 'individual' | 'bulk' | 'stats';

export default function AdminMessagesPage() {
  const router = useRouter();
  const { user, userType, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('individual');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [bulkMessages, setBulkMessages] = useState<AdminMessage[]>([]);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalDelivered: 0,
    totalRead: 0,
    totalConversations: 0,
  });

  // Check permissions
  useEffect(() => {
    if (userType === 'admin' && userProfile) {
      const hasPermissions = canSendMessages(userProfile as any);
      if (!hasPermissions) {
        toast.error('You do not have permission to access messaging');
        router.push('/admin/dashboard');
      }
    }
  }, [userProfile, userType, router]);

  // Load data based on active tab
  useEffect(() => {
    if (!user || userType !== 'admin') return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'individual') {
          // Load individual conversations
          const result = await getAdminConversations(user.uid);
          setConversations(result.conversations);

          // Subscribe to real-time updates
          const unsubscribe = subscribeToAdminConversations(user.uid, (updatedConversations) => {
            setConversations(updatedConversations);
          });

          return () => unsubscribe();
        } else if (activeTab === 'bulk') {
          // Load bulk messages
          const result = await getAdminBulkMessages(user.uid);
          setBulkMessages(result.messages);
        } else if (activeTab === 'stats') {
          // Load statistics
          const messageStats = await getAdminMessageStats(user.uid);
          setStats(messageStats);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, userType, activeTab]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    const userName = (conv as any).userName || 'Unknown User';
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter bulk messages based on search
  const filteredBulkMessages = bulkMessages.filter((msg) =>
    msg.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (conversationId: string, userId: string, userType: string) => {
    // For guest users, navigate to conversation ID; for regular users, use userId
    if (userType === 'guest') {
      router.push(`/admin/messages/conversation/${conversationId}`);
    } else {
      router.push(`/admin/messages/${userId}`);
    }
  };

  const handleComposeClick = () => {
    router.push('/admin/messages/compose');
  };

  const handleBulkMessageClick = (messageId: string) => {
    router.push(`/admin/messages/bulk/${messageId}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-sm text-gray-600 mt-1">
              Send and manage messages to users
            </p>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={handleComposeClick}
          >
            Compose Message
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('individual')}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'individual'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Individual Messages
              </div>
            </button>

            {canSendBulkMessages(userProfile as any) && (
              <button
                onClick={() => setActiveTab('bulk')}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === 'bulk'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Bulk Messages
                </div>
              </button>
            )}

            <button
              onClick={() => setActiveTab('stats')}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'stats'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Statistics
              </div>
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        {(activeTab === 'individual' || activeTab === 'bulk') && (
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={activeTab === 'individual' ? 'Search conversations...' : 'Search messages...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Individual Conversations */}
            {activeTab === 'individual' && (
              <div className="space-y-4">
                {filteredConversations.length === 0 ? (
                  <Card className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No conversations yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start a conversation with a user
                    </p>
                    <Button variant="primary" onClick={handleComposeClick}>
                      Start Conversation
                    </Button>
                  </Card>
                ) : (
                  filteredConversations.map((conversation) => {
                    const userName = (conversation as any).userName || 'Unknown User';
                    const unreadCount = conversation.unreadCount_admin || 0;
                    const lastMessage = conversation.lastMessage;

                    return (
                      <Card
                        key={conversation.id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleConversationClick(conversation.id, conversation.userId, conversation.userType)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">
                                {userName}
                              </h3>
                              <span className="text-xs text-gray-500">
                                ({conversation.userType})
                              </span>
                              {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                  {unreadCount} new
                                </span>
                              )}
                            </div>

                            {lastMessage && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600 truncate">
                                  {lastMessage.senderType === 'admin' ? 'You: ' : ''}
                                  {lastMessage.content}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDistanceToNow(
                                    (lastMessage.createdAt as any).toDate
                                      ? (lastMessage.createdAt as any).toDate()
                                      : new Date(lastMessage.createdAt),
                                    { addSuffix: true }
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {/* Bulk Messages */}
            {activeTab === 'bulk' && (
              <div className="space-y-4">
                {filteredBulkMessages.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No bulk messages sent
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Send a message to multiple users at once
                    </p>
                    <Button variant="primary" onClick={handleComposeClick}>
                      Compose Bulk Message
                    </Button>
                  </Card>
                ) : (
                  filteredBulkMessages.map((message) => {
                    const statusIcon =
                      message.status === 'sent' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                      message.status === 'sending' ? <AlertCircle className="w-4 h-4 text-yellow-500" /> :
                      message.status === 'failed' ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                      null;

                    return (
                      <Card
                        key={message.id}
                        className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleBulkMessageClick(message.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900">
                                {message.subject || 'No subject'}
                              </h3>
                              {statusIcon}
                              <span className="text-xs text-gray-500">
                                • {message.recipientIds.length} recipients
                              </span>
                            </div>

                            <p className="text-sm text-gray-600 truncate mt-2">
                              {message.content}
                            </p>

                            <div className="flex items-center gap-4 mt-2">
                              <p className="text-xs text-gray-400">
                                Sent {formatDistanceToNow(
                                  message.sentAt
                                    ? (message.sentAt as any).toDate
                                      ? (message.sentAt as any).toDate()
                                      : new Date(message.sentAt)
                                    : new Date(),
                                  { addSuffix: true }
                                )}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Delivered: {message.deliveredCount || 0}</span>
                                <span>•</span>
                                <span>Read: {message.readCount || 0}</span>
                              </div>
                            </div>
                          </div>

                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {/* Statistics */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Send className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Sent</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalSent}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalDelivered}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Read</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalRead}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Conversations</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalConversations}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}