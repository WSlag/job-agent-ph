'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDbInstance } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, limit, Timestamp } from 'firebase/firestore';
import {
  ArrowLeft,
  Send,
  User,
  Building,
  Clock,
  CheckCheck,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import {
  sendIndividualMessage,
  getAdminConversationMessages,
  subscribeToAdminMessages,
  markAdminMessagesAsRead,
} from '@/lib/admin-messaging-helpers';
import { canSendMessages } from '@/lib/permission-helpers';
import { AdminMessageThread } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  type: 'jobhunter' | 'agency';
  avatar?: string;
  location?: string;
  phone?: string;
}

export default function AdminConversationPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const { user, userType, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<AdminMessageThread[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check permissions
  useEffect(() => {
    if (userType === 'admin' && user && userProfile) {
      const hasPermissions = canSendMessages(userProfile as any);
      if (!hasPermissions) {
        toast.error('You do not have permission to access messaging');
        router.push('/admin/dashboard');
      }
    }
  }, [user, userType, userProfile, router]);

  // Load user info
  useEffect(() => {
    if (!userId) return;

    const loadUserInfo = async () => {
      const db = getDbInstance();

      try {
        // Try job hunter first
        const jobHunterDoc = await getDoc(doc(db, 'jobHunters', userId));
        if (jobHunterDoc.exists()) {
          const data = jobHunterDoc.data();
          setUserInfo({
            id: userId,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            type: 'jobhunter',
            avatar: data.profileImageUrl,
            location: data.location,
            phone: data.phone,
          });
          return;
        }

        // Try agency
        const agencyDoc = await getDoc(doc(db, 'agencies', userId));
        if (agencyDoc.exists()) {
          const data = agencyDoc.data();
          setUserInfo({
            id: userId,
            name: data.companyName,
            email: data.email,
            type: 'agency',
            avatar: data.logoUrl,
            location: data.address,
            phone: data.phone,
          });
          return;
        }

        // User not found
        toast.error('User not found');
        router.push('/admin/messages');
      } catch (error) {
        console.error('Error loading user info:', error);
        toast.error('Failed to load user information');
        router.push('/admin/messages');
      }
    };

    loadUserInfo();
  }, [userId, router]);

  // Load or create conversation
  useEffect(() => {
    if (!user || !userId || userType !== 'admin') return;

    const loadConversation = async () => {
      const db = getDbInstance();
      setLoading(true);

      try {
        // Check if conversation exists
        const conversationsRef = collection(db, 'adminConversations');
        const q = query(
          conversationsRef,
          where('adminId', '==', user.uid),
          where('userId', '==', userId),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const convId = snapshot.docs[0].id;
          setConversationId(convId);

          // Load messages
          const result = await getAdminConversationMessages(convId);
          setMessages(result.messages);

          // Subscribe to real-time updates
          const unsubscribe = subscribeToAdminMessages(convId, (updatedMessages) => {
            setMessages(updatedMessages);
            scrollToBottom();
          });

          // Mark messages as read
          await markAdminMessagesAsRead(convId, user.uid, true);

          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error loading conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [user, userId, userType]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!user || !userId || !userInfo || !message.trim()) return;

    const messageContent = message.trim();
    setMessage('');
    setSending(true);

    try {
      const convId = await sendIndividualMessage(
        user.uid,
        user.displayName || 'Admin',
        userId,
        userInfo.type,
        messageContent
      );

      // Set conversation ID if this was the first message
      if (!conversationId) {
        setConversationId(convId);

        // Subscribe to messages
        const unsubscribe = subscribeToAdminMessages(convId, (updatedMessages) => {
          setMessages(updatedMessages);
          scrollToBottom();
        });

        return () => unsubscribe();
      }

      toast.success('Message sent');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => router.push('/admin/messages')}
            >
              Back
            </Button>

            {userInfo && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {userInfo.avatar ? (
                    <img
                      src={userInfo.avatar}
                      alt={userInfo.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500">
                      {userInfo.type === 'agency' ? (
                        <Building className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">{userInfo.name}</h2>
                  <p className="text-sm text-gray-600">
                    {userInfo.type === 'agency' ? 'Agency' : 'Job Hunter'}
                    {userInfo.location && ` • ${userInfo.location}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Info Button */}
          {userInfo && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const profilePath = userInfo.type === 'agency'
                  ? `/admin/users?type=agency&search=${userInfo.email}`
                  : `/admin/users?type=jobhunter&search=${userInfo.email}`;
                router.push(profilePath);
              }}
            >
              View Profile
            </Button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No messages yet</p>
                <p className="text-sm text-gray-500">Start the conversation</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const isAdmin = msg.senderType === 'admin';
                const showDate = index === 0 ||
                  new Date(messages[index - 1].timestamp).toDateString() !==
                  new Date(msg.timestamp).toDateString();

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-500 py-2">
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </div>
                    )}

                    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`
                          max-w-[70%] rounded-lg p-3
                          ${isAdmin
                            ? 'bg-primary-600 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'}
                        `}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <div className={`flex items-center gap-2 mt-2 text-xs ${
                          isAdmin ? 'text-primary-100' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(msg.timestamp)}</span>
                          {msg.read && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending || !userInfo}
              className="flex-1"
            />
            <Button
              variant="primary"
              icon={Send}
              onClick={handleSend}
              disabled={!message.trim() || sending || !userInfo}
              loading={sending}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}