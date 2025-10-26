'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';
import { Admin } from '@/types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, userProfile, userType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (userType !== 'admin') {
        router.push('/');
      }
    }
  }, [user, userType, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || userType !== 'admin') {
    return null;
  }

  const adminProfile = userProfile as Admin;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="lg:ml-0 ml-12">
              <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
            </div>

            {/* Admin Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {adminProfile?.firstName} {adminProfile?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {adminProfile?.role?.replace('_', ' ')}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {adminProfile?.firstName?.charAt(0)}
                {adminProfile?.lastName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
