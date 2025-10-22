'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from '@/components/ui/Logo';

export default function Header() {
  const { user, userType, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/jobs';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/jobs" className="flex items-center">
            <Logo size="sm" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 transition-colors">
              Browse Jobs
            </Link>

            {user ? (
              <>
                {userType === 'agency' && (
                  <Link href="/agency/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                )}
                {userType === 'jobhunter' && (
                  <Link href="/saved-jobs" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Saved Jobs
                  </Link>
                )}
                <Link href="/messages" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Messages
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-red-600 transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                    <Link
                      href="/agency/dashboard"
                      className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {userType === 'jobhunter' && (
                    <Link
                      href="/saved-jobs"
                      className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Saved Jobs
                    </Link>
                  )}
                  <Link
                    href="/messages"
                    className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Messages
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
