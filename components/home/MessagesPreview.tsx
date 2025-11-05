'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, ArrowRight, User } from 'lucide-react';
import { Badge } from '@/components/ui';

interface Message {
  id: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: 'agency' | 'user';
  message: string;
  timestamp: Date;
  unread: boolean;
}

interface MessagesPreviewProps {
  messages: Message[];
  unreadCount: number;
  loading?: boolean;
}

/**
 * MessagesPreview Component
 *
 * Shows latest 2 messages on home screen for authenticated users
 * Quick access to messaging without navigating away
 */
export default function MessagesPreview({
  messages,
  unreadCount,
  loading = false,
}: MessagesPreviewProps) {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          {unreadCount > 0 && (
            <Badge variant="danger" size="sm">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Link
          href="/messages"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Messages list */}
      {messages.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-2 font-medium">No messages yet</p>
          <p className="text-sm text-gray-500">
            Start applying to jobs to connect with agencies
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.slice(0, 2).map((message) => (
            <Link
              key={message.id}
              href={`/messages/${message.id}`}
              className="block"
            >
              <div
                className={`bg-white border-2 rounded-xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5 ${
                  message.unread
                    ? 'border-primary-200 bg-primary-50/50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center overflow-hidden">
                    {message.senderAvatar ? (
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-primary-600" />
                    )}
                  </div>

                  {/* Message content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-semibold truncate ${
                          message.unread ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {message.senderName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {getTimeAgo(message.timestamp)}
                      </span>
                    </div>
                    <p
                      className={`text-sm line-clamp-2 ${
                        message.unread ? 'text-gray-700 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {message.message}
                    </p>
                    {message.senderRole === 'agency' && (
                      <div className="mt-2">
                        <Badge variant="info" size="sm">
                          Agency
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {message.unread && (
                    <div className="flex-shrink-0 w-2.5 h-2.5 bg-primary-600 rounded-full mt-2" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
