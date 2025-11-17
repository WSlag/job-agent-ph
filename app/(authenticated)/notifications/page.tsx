'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Bell, Check, Trash2, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { NoNotificationsEmptyState } from '@/components/ui/EmptyState';
import { collection, query, where, orderBy, onSnapshot, updateDoc, deleteDoc, doc, writeBatch, Timestamp, getDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import toast from 'react-hot-toast';
import UserDashboardHeader from '@/components/layout/UserDashboardHeader';
import MobileNativeHeader from '@/components/layout/MobileNativeHeader';

interface Notification {
  id: string;
  type: 'job_match' | 'message' | 'application_update' | 'interview' | 'document' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

interface UnreadConversation {
  id: string;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: Date;
}

export default function NotificationsPage() {
  const { user, userType } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadConversations, setUnreadConversations] = useState<UnreadConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'jobs' | 'messages' | 'applications'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const db = getDbInstance();
    // Load notifications from Firestore with real-time updates
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedNotifications: Notification[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          type: data.type || 'system',
          title: data.title,
          message: data.message,
          read: data.read ?? false,
          createdAt: data.createdAt?.toDate() || new Date(),
          actionUrl: data.actionUrl,
        };
      });

      setNotifications(loadedNotifications);
      setLoading(false);
    }, (error) => {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, router]);

  // Load unread conversations for message notifications fallback
  useEffect(() => {
    if (!user || !userType) return;

    const db = getDbInstance();
    const conversationsRef = collection(db, 'conversations');

    // Query conversations based on user type
    const conversationsQuery = userType === 'agency'
      ? query(conversationsRef, where('agencyId', '==', user.uid))
      : query(conversationsRef, where('jobHunterId', '==', user.uid));

    const unsubscribe = onSnapshot(conversationsQuery, async (snapshot) => {
      const unreadConvs: UnreadConversation[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const userUnreadKey = `unreadCount_${user.uid}`;
        const userUnreadCount = data[userUnreadKey] || 0;

        if (userUnreadCount > 0) {
          // Get the other user's info
          const otherUserId = userType === 'agency' ? data.jobHunterId : data.agencyId;
          const otherUserType = userType === 'agency' ? 'jobHunters' : 'agencies';

          try {
            // Fetch other user's data
            const userDocRef = doc(db, otherUserType, otherUserId);
            const userSnapshot = await getDoc(userDocRef);
            const userData = userSnapshot.data();

            unreadConvs.push({
              id: docSnap.id,
              otherUserName: userData?.name || userData?.companyName || 'Unknown User',
              otherUserAvatar: userData?.profilePicture || userData?.logo,
              lastMessage: data.lastMessage?.content || '',
              unreadCount: userUnreadCount,
              updatedAt: data.updatedAt?.toDate() || new Date(),
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      }

      // Sort by most recent first
      unreadConvs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      setUnreadConversations(unreadConvs);
    });

    return () => unsubscribe();
  }, [user, userType]);

  const handleMarkAllRead = async () => {
    if (!user) return;

    try {
      const db = getDbInstance();
      const batch = writeBatch(db);
      const unreadNotifications = notifications.filter(n => !n.read);

      unreadNotifications.forEach((notification) => {
        const notifRef = doc(db, 'notifications', notification.id);
        batch.update(notifRef, { read: true });
      });

      await batch.commit();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const db = getDbInstance();
      await deleteDoc(doc(db, 'notifications', id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        const db = getDbInstance();
        await updateDoc(doc(db, 'notifications', notification.id), {
          read: true,
        });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'jobs') return n.type === 'job_match';
    if (activeTab === 'messages') return n.type === 'message';
    if (activeTab === 'applications') return n.type === 'application_update' || n.type === 'interview';
    return true;
  });

  // For messages tab, also include unread conversations as pseudo-notifications
  const getDisplayItems = () => {
    if (activeTab === 'messages') {
      // Combine message notifications with unread conversations
      const messageNotifs = filteredNotifications;

      // Convert unread conversations to notification-like format
      const conversationNotifs: Notification[] = unreadConversations.map(conv => ({
        id: `conv-${conv.id}`,
        type: 'message' as const,
        title: `New message from ${conv.otherUserName}`,
        message: conv.lastMessage.length > 100
          ? `${conv.lastMessage.substring(0, 100)}...`
          : conv.lastMessage,
        read: false,
        createdAt: conv.updatedAt,
        actionUrl: `/messages?conversationId=${conv.id}`,
      }));

      // Combine and sort by date
      const allItems = [...messageNotifs, ...conversationNotifs];
      allItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return allItems;
    }

    return filteredNotifications;
  };

  const displayItems = getDisplayItems();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'job_match':
        return '💼';
      case 'message':
        return '💬';
      case 'application_update':
        return '👁️';
      case 'interview':
        return '📅';
      case 'document':
        return '📄';
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <div className="hidden md:block">
          <UserDashboardHeader showNotifications={true} />
        </div>
        <MobileNativeHeader
          title="Notifications"
          onBack={() => router.back()}
          hideOnScroll
          showShadowOnScroll
        />
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <UserDashboardHeader showNotifications={true} />
      </div>
      <MobileNativeHeader
        title="Notifications"
        onBack={() => router.back()}
        hideOnScroll
        showShadowOnScroll
      />
      <div className="min-h-screen bg-gray-50 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Stay updated with your job search activities
              </p>
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                icon={Check}
              >
                Mark All Read
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {[
              { key: 'all', label: 'All' },
              { key: 'jobs', label: 'Jobs' },
              { key: 'messages', label: 'Messages' },
              { key: 'applications', label: 'Applications' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {displayItems.length === 0 ? (
          <Card className="p-8">
            <NoNotificationsEmptyState />
          </Card>
        ) : (
          <div className="space-y-2">
            {displayItems.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? 'bg-blue-50 border-l-4 border-l-primary-600' : 'bg-white'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                    aria-label="Delete notification"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
