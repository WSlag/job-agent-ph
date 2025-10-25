'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Menu, X, MessageCircle, Briefcase, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '@/components/ui/Logo';
import { subscribeToConversations } from '@/lib/messaging-helpers';
import { subscribeToJobHunterApplications } from '@/lib/application-helpers';

export default function Header() {
  const { user, userType, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);

  useEffect(() => {
    if (!user || !userType) {
      setUnreadCount(0);
      return;
    }

    // Subscribe to conversations to count unread messages
    const unsubscribe = subscribeToConversations(
      user.uid,
      userType,
      (conversations) => {
        let total = 0;
        conversations.forEach((convo) => {
          // Count unread messages from the other party
          if (convo.lastMessage && convo.lastMessage.senderId !== user.uid && !convo.lastMessage.read) {
            total++;
          }
        });
        setUnreadCount(total);
      }
    );

    return () => unsubscribe();
  }, [user, userType]);

  useEffect(() => {
    if (!user || userType !== 'jobhunter') {
      setPendingApplications(0);
      return () => {}; // Return empty cleanup function
    }

    // Subscribe to applications to count pending ones
    const unsubscribe = subscribeToJobHunterApplications(user.uid, (applications) => {
      const pending = applications.filter(app => app.status === 'pending' || app.status === 'reviewing').length;
      setPendingApplications(pending);
    });

    return () => unsubscribe();
  }, [user, userType]);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/jobs';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-soft fixed top-0 left-0 right-0 w-full z-50 border-b border-white/20 hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="sm" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-6">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
              Browse Jobs
            </Link>

            {user ? (
              <>
                {userType === 'agency' && (
                  <>
                    <Link href="/jobs/post" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2">
                      <Briefcase size={18} />
                      Post Job
                    </Link>
                    <Link href="/agency/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                      Dashboard
                    </Link>
                  </>
                )}
                {userType === 'jobhunter' && (
                  <>
                    <Link href="/profile/applications" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 relative">
                      <span className="flex items-center gap-2">
                        <FileText size={18} />
                        Applications
                        {pendingApplications > 0 && (
                          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                            {pendingApplications > 9 ? '9+' : pendingApplications}
                          </span>
                        )}
                      </span>
                    </Link>
                    <Link href="/saved-jobs" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105">
                      Saved Jobs
                    </Link>
                  </>
                )}
                <Link href="/messages" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 relative">
                  <span className="flex items-center gap-2">
                    <MessageCircle size={18} />
                    Messages
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2">
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 hover:shadow-lg font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/jobs"
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Jobs
              </Link>

              {user ? (
                <>
                  {userType === 'agency' && (
                    <>
                      <Link
                        href="/jobs/post"
                        className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 flex items-center gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Briefcase size={18} />
                        Post Job
                      </Link>
                      <Link
                        href="/agency/dashboard"
                        className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </>
                  )}
                  {userType === 'jobhunter' && (
                    <>
                      <Link
                        href="/profile/applications"
                        className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 relative"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="flex items-center gap-2">
                          <FileText size={18} />
                          Applications
                          {pendingApplications > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {pendingApplications > 9 ? '9+' : pendingApplications}
                            </span>
                          )}
                        </span>
                      </Link>
                      <Link
                        href="/saved-jobs"
                        className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Saved Jobs
                      </Link>
                    </>
                  )}
                  <Link
                    href="/messages"
                    className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle size={18} />
                      Messages
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </span>
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-red-600 transition-colors px-2 py-1 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
