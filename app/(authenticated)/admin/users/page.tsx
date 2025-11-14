'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Users, Search, Filter, MoreVertical, Mail, Ban, CheckCircle, Trash2, Shield } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/collections';
import toast from 'react-hot-toast';
import { suspendUser, unsuspendUser, softDeleteUser } from '@/lib/user-moderation-helpers';
import { logAdminAction } from '@/lib/audit-helpers';
import { canSuspendUsers, canDeleteUsers } from '@/lib/permission-helpers';
import { Admin, UserStatus } from '@/types';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'jobhunter' | 'agency' | 'admin';
  status: UserStatus | 'pending';
  createdAt: Date;
  lastActive?: Date;
  suspensionReason?: string;
  suspensionExpiry?: Date;
}

export default function AdminUsersPage() {
  const { user, userType, userProfile } = useAuth();
  const admin = userProfile as Admin;
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'jobhunter' | 'agency' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending' | 'deleted'>('all');

  // Modal states
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDays, setSuspendDays] = useState<number | ''>('');
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!user || userType !== 'admin') {
      router.push('/');
      return;
    }

    // Load users from Firestore
    const loadUsers = async () => {
      try {
        setLoading(true);
        const db = getDbInstance();
        const usersRef = collection(db, COLLECTIONS.USERS);
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const loadedUsers: User[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.fullName || data.companyName || data.name || 'Unknown',
            email: data.email,
            role: data.userType || 'jobhunter',
            status: data.status || 'active',
            createdAt: data.createdAt?.toDate() || new Date(),
            lastActive: data.lastActive?.toDate(),
          };
        });

        setUsers(loadedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [user, userType, router]);

  async function handleSuspendUser(userId: string) {
    if (!canSuspendUsers(admin)) {
      toast.error('You do not have permission to suspend users');
      return;
    }
    setTargetUserId(userId);
    setShowSuspendModal(true);
  }

  async function confirmSuspendUser() {
    if (!targetUserId || !suspendReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setActionLoading(true);
    try {
      const expiryDate = suspendDays
        ? new Date(Date.now() + Number(suspendDays) * 24 * 60 * 60 * 1000)
        : undefined;

      await suspendUser(targetUserId, admin.id, suspendReason, expiryDate);

      // Log the action
      await logAdminAction({
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        action: 'user_suspended',
        resourceType: 'user',
        resourceId: targetUserId,
        details: { reason: suspendReason, expiryDays: suspendDays || 'permanent' },
      });

      toast.success('User suspended successfully');
      setShowSuspendModal(false);
      setSuspendReason('');
      setSuspendDays('');
      setTargetUserId(null);

      // Reload users
      const db = getDbInstance();
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const loadedUsers: User[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || data.companyName || data.name || 'Unknown',
          email: data.email,
          role: data.userType || 'jobhunter',
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate(),
          suspensionReason: data.suspensionReason,
          suspensionExpiry: data.suspensionExpiry?.toDate(),
        };
      });
      setUsers(loadedUsers);
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleUnsuspendUser(userId: string) {
    if (!canSuspendUsers(admin)) {
      toast.error('You do not have permission to unsuspend users');
      return;
    }

    if (!confirm('Are you sure you want to unsuspend this user?')) return;

    setActionLoading(true);
    try {
      await unsuspendUser(userId, admin.id);

      // Log the action
      await logAdminAction({
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        action: 'user_unsuspended',
        resourceType: 'user',
        resourceId: userId,
        details: {},
      });

      toast.success('User unsuspended successfully');

      // Reload users
      const db = getDbInstance();
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const loadedUsers: User[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || data.companyName || data.name || 'Unknown',
          email: data.email,
          role: data.userType || 'jobhunter',
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate(),
        };
      });
      setUsers(loadedUsers);
    } catch (error) {
      console.error('Error unsuspending user:', error);
      toast.error('Failed to unsuspend user');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!canDeleteUsers(admin)) {
      toast.error('You do not have permission to delete users');
      return;
    }

    const reason = prompt('Reason for deleting this user:');
    if (!reason) return;

    if (!confirm('Are you sure you want to delete this user? This action marks the user as deleted but preserves their data.')) return;

    setActionLoading(true);
    try {
      await softDeleteUser(userId, admin.id, reason);

      // Log the action
      await logAdminAction({
        adminId: admin.id,
        adminName: `${admin.firstName} ${admin.lastName}`,
        action: 'user_deleted',
        resourceType: 'user',
        resourceId: userId,
        details: { reason },
      });

      toast.success('User deleted successfully');

      // Reload users
      const db = getDbInstance();
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const loadedUsers: User[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || data.companyName || data.name || 'Unknown',
          email: data.email,
          role: data.userType || 'jobhunter',
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate(),
        };
      });
      setUsers(loadedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      jobhunter: 'bg-blue-100 text-blue-700',
      agency: 'bg-purple-100 text-purple-700',
      admin: 'bg-red-100 text-red-700',
    };
    return styles[role as keyof typeof styles] || styles.jobhunter;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatLastActive = (date?: Date) => {
    if (!date) return 'Never';

    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-0">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 md:w-6 md:h-6" />
            User Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Manage job seekers, agencies, and admin users
          </p>
        </div>

        {/* Filters */}
        <Card className="p-3 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="jobhunter">Job Hunters</option>
              <option value="agency">Agencies</option>
              <option value="admin">Admins</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="p-3 md:p-4">
            <div className="text-xs md:text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{users.length}</div>
          </Card>
          <Card className="p-3 md:p-4">
            <div className="text-xs md:text-sm text-gray-600 mb-1">Job Hunters</div>
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'jobhunter').length}
            </div>
          </Card>
          <Card className="p-3 md:p-4">
            <div className="text-xs md:text-sm text-gray-600 mb-1">Agencies</div>
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'agency').length}
            </div>
          </Card>
          <Card className="p-3 md:p-4">
            <div className="text-xs md:text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-xl md:text-2xl font-bold text-yellow-600">
              {users.filter(u => u.status === 'pending').length}
            </div>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadge(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatLastActive(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                          className="text-gray-400 hover:text-gray-600"
                          disabled={actionLoading}
                        >
                          <MoreVertical size={20} />
                        </button>

                        {showActionMenu === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            {user.status === 'active' && canSuspendUsers(admin) && (
                              <button
                                onClick={() => {
                                  handleSuspendUser(user.id);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Ban size={16} />
                                Suspend User
                              </button>
                            )}
                            {user.status === 'suspended' && canSuspendUsers(admin) && (
                              <button
                                onClick={() => {
                                  handleUnsuspendUser(user.id);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle size={16} />
                                Unsuspend User
                              </button>
                            )}
                            {user.status !== 'deleted' && canDeleteUsers(admin) && (
                              <button
                                onClick={() => {
                                  handleDeleteUser(user.id);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Trash2 size={16} />
                                Delete User
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{user.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{user.email}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadge(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Joined: {formatDate(user.createdAt)}</div>
                      <div>Last Active: {formatLastActive(user.lastActive)}</div>
                      {user.suspensionReason && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
                          {user.suspensionReason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative ml-2">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      disabled={actionLoading}
                    >
                      <MoreVertical size={20} />
                    </button>

                    {showActionMenu === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        {user.status === 'active' && canSuspendUsers(admin) && (
                          <button
                            onClick={() => {
                              handleSuspendUser(user.id);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-yellow-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Ban size={16} />
                            Suspend
                          </button>
                        )}
                        {user.status === 'suspended' && canSuspendUsers(admin) && (
                          <button
                            onClick={() => {
                              handleUnsuspendUser(user.id);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Unsuspend
                          </button>
                        )}
                        {user.status !== 'deleted' && canDeleteUsers(admin) && (
                          <button
                            onClick={() => {
                              handleDeleteUser(user.id);
                              setShowActionMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No users found matching your filters.
            </div>
          )}
        </Card>

        {/* Suspend User Modal */}
        {showSuspendModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full">
              <div className="flex items-center gap-2 mb-4">
                <Ban className="text-yellow-600" size={20} />
                <h3 className="text-base md:text-lg font-semibold">Suspend User</h3>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for suspension:
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full border rounded px-3 py-2 h-24 text-sm"
                  placeholder="Enter reason..."
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suspension duration (optional):
                </label>
                <select
                  value={suspendDays}
                  onChange={(e) => setSuspendDays(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">Permanent</option>
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowSuspendModal(false);
                    setSuspendReason('');
                    setSuspendDays('');
                    setTargetUserId(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50 text-sm order-2 sm:order-1"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSuspendUser}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm order-1 sm:order-2"
                  disabled={actionLoading || !suspendReason.trim()}
                >
                  <Ban size={16} />
                  {actionLoading ? 'Suspending...' : 'Suspend User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
