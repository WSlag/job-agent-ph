'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDbInstance } from '@/lib/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import {
  ArrowLeft,
  Send,
  Shield,
  Clock,
  CheckCheck,
  MessageSquare,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import {
  getAdminConversationMessages,
  subscribeToAdminMessages,
  markAdminMessagesAsRead,
} from '@/lib/admin-messaging-helpers';
import { AdminMessageThread } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface AdminInfo {
  id: string;
  name: string;
  role: string;
}

export default function UserAdminConversationPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user, userType } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<AdminMessageThread[]>([]);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load admin info and conversation
  useEffect(() => {
    if (!conversationId || !user) return;

    const loadConversation = async () => {
      const db = getDbInstance();
      setLoading(true);

      try {
        // Get conversation details
        const conversationDoc = await getDoc(doc(db, 'adminConversations', conversationId));

        if (!conversationDoc.exists()) {
          toast.error('Conversation not found');
          router.push('/messages');
          return;
        }

        const conversationData = conversationDoc.data();

        // Check if user is authorized to view this conversation
        if (conversationData.userId !== user.uid) {
          toast.error('You do not have permission to view this conversation');
          router.push('/messages');
          return;
        }

        // Get admin info
        const adminDoc = await getDoc(doc(db, 'admins', conversationData.adminId));
        if (adminDoc.exists()) {
          const adminData = adminDoc.data();
          setAdminInfo({
            id: conversationData.adminId,
            name: `${adminData.firstName} ${adminData.lastName}`,
            role: adminData.role || 'Admin',
          });
        }

        // Load messages
        const result = await getAdminConversationMessages(conversationId);
        setMessages(result.messages);

        // Subscribe to real-time updates
        const unsubscribe = subscribeToAdminMessages(conversationId, (updatedMessages) => {
          setMessages(updatedMessages);
          scrollToBottom();
        });

        // Mark messages as read
        await markAdminMessagesAsRead(conversationId, user.uid, false);

        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading conversation:', error);
        toast.error('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId, user, router]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!user || !conversationId || !message.trim()) return;

    const messageContent = message.trim();
    setMessage('');
    setSending(true);

    try {
      const db = getDbInstance();

      // Add message to conversation
      const messageData: Partial<AdminMessageThread> = {
        conversationId,
        senderId: user.uid,
        senderType: 'user',
        content: messageContent,
        timestamp: Timestamp.now() as any,
        read: false,
      };

      await addDoc(collection(db, `adminConversations/${conversationId}/messages`), messageData);

      // Update conversation
      await updateDoc(doc(db, 'adminConversations', conversationId), {
        lastMessage: {
          content: messageContent,
          senderId: user.uid,
          senderType: 'user',
          createdAt: Timestamp.now() as any,
          read: false,
        },
        unreadCount_admin: increment(1),
        updatedAt: serverTimestamp(),
      });

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
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                icon={ArrowLeft}
                onClick={() => router.push('/messages')}
              >
                Back
              </Button>

              {adminInfo && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">{adminInfo.name}</h2>
                    <p className="text-sm text-gray-600">
                      {adminInfo.role} • Job Agent PH Support
                    </p>
                  </div>
                </div>
              )}
            </div>
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
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isUser = msg.senderType === 'user';
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

                      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`
                            max-w-[70%] rounded-lg p-3
                            ${isUser
                              ? 'bg-primary-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-900'}
                          `}
                        >
                          {!isUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <Shield className="w-3 h-3 text-primary-600" />
                              <span className="text-xs font-medium text-primary-600">
                                Admin Message
                              </span>
                            </div>
                          )}
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <div className={`flex items-center gap-2 mt-2 text-xs ${
                            isUser ? 'text-primary-100' : 'text-gray-500'
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
                disabled={sending || !adminInfo}
                className="flex-1"
              />
              <Button
                variant="primary"
                icon={Send}
                onClick={handleSend}
                disabled={!message.trim() || sending || !adminInfo}
                loading={sending}
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}