'use client';

import { ArrowLeft, Search, Phone, Video, MoreVertical, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

interface MessagesHeaderProps {
  mode: 'list' | 'conversation';
  // List mode props
  onSearch?: (query: string) => void;
  onNewMessage?: () => void;
  // Conversation mode props
  contactName?: string;
  contactAvatar?: string;
  isOnline?: boolean;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onMore?: () => void;
}

export default function MessagesHeader({
  mode,
  onSearch,
  onNewMessage,
  contactName,
  contactAvatar,
  isOnline,
  onBack,
  onCall,
  onVideoCall,
  onMore,
}: MessagesHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  if (mode === 'list') {
    return (
      <>
        {/* Desktop - Messages List Header */}
        <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Left: Title */}
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>

              {/* Center: Search */}
              <div className="flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </form>
              </div>

              {/* Right: New Message Button */}
              {onNewMessage && (
                <button
                  onClick={onNewMessage}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Message</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Mobile - Messages List Header */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-14 px-4">
            <h1 className="text-lg font-semibold text-gray-900">Messages</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              {onNewMessage && (
                <button
                  onClick={onNewMessage}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {showSearch && (
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  autoFocus
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </header>
      </>
    );
  }

  // Conversation mode
  return (
    <>
      {/* Desktop - Conversation Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back + Contact Info */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {contactName?.[0] || 'C'}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Name + Status */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{contactName}</h2>
                  {isOnline && (
                    <p className="text-xs text-green-600">Online</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {onCall && (
                <button
                  onClick={onCall}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </button>
              )}
              {onVideoCall && (
                <button
                  onClick={onVideoCall}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Video className="w-5 h-5" />
                </button>
              )}
              {onMore && (
                <button
                  onClick={onMore}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile - Conversation Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left: Back + Contact Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {contactName?.[0] || 'C'}
              </div>
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">{contactName}</h2>
              {isOnline && (
                <p className="text-xs text-green-600">Online</p>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            {onCall && (
              <button
                onClick={onCall}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5" />
              </button>
            )}
            {onMore && (
              <button
                onClick={onMore}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
