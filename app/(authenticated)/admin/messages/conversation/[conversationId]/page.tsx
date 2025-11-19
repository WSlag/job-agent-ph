'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDbInstance } from '@/lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';
import {
  ArrowLeft,
  Send,
  User,
  Mail,
  Clock,
  CheckCheck,
  MessageSquare,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import {
  getAdminConversationMessages,
  subscribeToAdminMessages,
  markAdminMessagesAsRead,
} from '@/lib/admin-messaging-helpers';
import { canSendMessages } from '@/lib/permission-helpers';
import { AdminMessageThread } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface GuestInfo {
  name: string;
  email: string;
  referenceNumber?: string;
  contactRef?: string;
}

export default function AdminGuestConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user, userType, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<AdminMessageThread[]>([]);
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);
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

  // Load conversation and guest info
  useEffect(() => {
    if (!conversationId || !user || userType !== 'admin') return;

    const loadConversation = async () => {
      const db = getDbInstance();
      setLoading(true);

      try {
        // Load conversation document
        const conversationDoc = await getDoc(doc(db, 'adminConversations', conversationId));

        if (!conversationDoc.exists()) {
          toast.error('Conversation not found');
          router.push('/admin/messages');
          return;
        }

        const conversationData = conversationDoc.data();

        // Set guest info from conversation
        setGuestInfo({
          name: conversationData.guestName || 'Unknown Guest',
          email: conversationData.guestEmail || '',
          referenceNumber: conversationData.referenceNumber,
          contactRef: conversationData.contactRef,
        });

        // Load messages
        const result = await getAdminConversationMessages(conversationId);
        setMessages(result.messages);

        // Subscribe to real-time updates
        const unsubscribe = subscribeToAdminMessages(conversationId, (updatedMessages) => {
          setMessages(updatedMessages);
          scrollToBottom();
        });

        // Mark messages as read
        await markAdminMessagesAsRead(conversationId, user.uid, true);

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading conversation:', error);
        toast.error('Failed to load conversation');
        router.push('/admin/messages');
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId, user, userType, router]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!user || !message.trim() || !conversationId) return;

    const messageContent = message.trim();
    setMessage('');
    setSending(true);

    try {
      // Send message via API route
      const response = await fetch(`/api/admin/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent,
          adminId: user.uid,
          adminName: user.displayName || 'Admin',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Message sent');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
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

  const formatTimestamp = (timestamp: Date | any) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
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

            {guestInfo && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">{guestInfo.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span>{guestInfo.email}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                      Guest
                    </span>
                  </div>
                  {guestInfo.referenceNumber && (
                    <p className="text-xs text-gray-500 mt-1">
                      Ref: {guestInfo.referenceNumber}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* View Contact Button */}
          {guestInfo?.contactRef && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/contacts')}
            >
              View Contact Form
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
                const msgTimestamp = msg.timestamp;
                const showDate = index === 0 ||
                  new Date(messages[index - 1].timestamp).toDateString() !==
                  new Date(msgTimestamp).toDateString();

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-500 py-2">
                        {new Date(msgTimestamp).toLocaleDateString()}
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
                          <span>{formatTimestamp(msgTimestamp)}</span>
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
              disabled={sending || !guestInfo}
              className="flex-1"
            />
            <Button
              variant="primary"
              icon={Send}
              onClick={handleSend}
              disabled={!message.trim() || sending || !guestInfo}
              isLoading={sending}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
