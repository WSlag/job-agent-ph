'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import HeaderDesign1Enhanced from '@/components/layout/HeaderDesign1Enhanced';
import { Message } from '@/types';
import {
  subscribeToMessages,
  sendMessage,
  getConversationDetails,
  markMessagesAsRead,
  messageTemplates,
} from '@/lib/messaging-helpers';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import {
  ArrowLeft,
  Send,
  Loader2,
  Paperclip,
  Smile,
  MoreVertical,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userType } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationDetails, setConversationDetails] = useState<any>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/messages');
      return;
    }

    loadConversationDetails();

    const conversationId = params.id as string;
    const unsubscribe = subscribeToMessages(conversationId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);

      // Mark messages as read
      const unreadMessages = newMessages.filter(
        (msg) => !msg.read && msg.senderId !== user.uid
      );
      if (unreadMessages.length > 0) {
        markMessagesAsRead(
          conversationId,
          unreadMessages.map((msg) => msg.id)
        );
      }

      // Scroll to bottom
      setTimeout(() => scrollToBottom(), 100);
    });

    return () => unsubscribe();
  }, [user, params.id]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  const loadConversationDetails = async () => {
    try {
      const conversationId = params.id as string;
      const details = await getConversationDetails(conversationId);
      setConversationDetails(details);
    } catch (error) {
      console.error('Error loading conversation details:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !userType || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      await sendMessage(
        params.id as string,
        user.uid,
        userType,
        messageText
      );
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleUseTemplate = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const groupMessagesByDate = () => {
    const grouped: { [key: string]: Message[] } = {};

    messages.forEach((msg) => {
      const date = format(new Date(msg.createdAt), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });

    return grouped;
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

  const otherParty =
    userType === 'jobhunter'
      ? conversationDetails?.agency
      : conversationDetails?.jobHunter;
  const otherPartyName =
    userType === 'jobhunter'
      ? conversationDetails?.agency?.companyName
      : `${conversationDetails?.jobHunter?.firstName} ${conversationDetails?.jobHunter?.lastName}`;

  const groupedMessages = groupMessagesByDate();
  const templates = userType && (userType === 'jobhunter' || userType === 'agency')
    ? messageTemplates[userType]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex flex-col">
      <HeaderDesign1Enhanced hideSearch />

      {/* Chat Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {otherPartyName?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {otherPartyName}
                  </h2>
                  {conversationDetails?.job && (
                    <Link
                      href={`/jobs/${conversationDetails.job.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {conversationDetails.job.title}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {Object.keys(groupedMessages).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                {/* Date Divider */}
                <div className="flex items-center justify-center my-6">
                  <div className="bg-gray-200 px-4 py-1 rounded-full text-xs text-gray-600 font-medium">
                    {isToday(new Date(date))
                      ? 'Today'
                      : isYesterday(new Date(date))
                      ? 'Yesterday'
                      : format(new Date(date), 'MMMM d, yyyy')}
                  </div>
                </div>

                {/* Messages */}
                {msgs.map((message) => {
                  const isOwnMessage = message.senderId === user?.uid;

                  return (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${
                        isOwnMessage ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl'
                            : 'bg-white text-gray-900 rounded-r-2xl rounded-tl-2xl shadow-sm'
                        } px-4 py-3`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {formatMessageTime(new Date(message.createdAt))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {/* Template Suggestions */}
          {showTemplates && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Quick Templates
                </span>
              </div>
              <div className="space-y-2">
                {templates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => handleUseTemplate(template)}
                    className="block w-full text-left text-sm text-gray-700 bg-white hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-gray-200"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex-shrink-0 p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Use template message"
            >
              <Sparkles size={20} />
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type your message..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[200px]"
                rows={1}
              />
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="flex-shrink-0 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
