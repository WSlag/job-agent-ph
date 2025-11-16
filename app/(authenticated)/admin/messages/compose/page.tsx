'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDbInstance } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import {
  ArrowLeft,
  Send,
  Users,
  User,
  Filter,
  X,
  Check,
  AlertCircle,
  Search,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import Select from '@/components/ui/Select';
import toast from 'react-hot-toast';
import {
  sendBulkMessage,
  sendIndividualMessage,
  getFilteredRecipients,
} from '@/lib/admin-messaging-helpers';
import {
  canSendMessages,
  canSendBulkMessages,
} from '@/lib/permission-helpers';
import { RecipientFilters, RecipientType } from '@/types';

type MessageType = 'individual' | 'bulk';

interface Recipient {
  id: string;
  name: string;
  email: string;
  type: string;
  selected?: boolean;
}

export default function ComposeMessagePage() {
  const router = useRouter();
  const { user, userType, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>('individual');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState<RecipientFilters>({
    userType: 'all',
    activityStatus: 'all',
  });

  // Check permissions
  useEffect(() => {
    if (userType === 'admin' && userProfile) {
      const hasPermissions = canSendMessages(userProfile as any);
      if (!hasPermissions) {
        toast.error('You do not have permission to send messages');
        router.push('/admin/dashboard');
      }

      // Check bulk message permission
      if (messageType === 'bulk' && !canSendBulkMessages(userProfile as any)) {
        setMessageType('individual');
      }
    }
  }, [userProfile, userType, router, messageType]);

  // Load recipients based on filters
  useEffect(() => {
    if (!user || userType !== 'admin') return;

    const loadRecipients = async () => {
      setLoading(true);
      try {
        const filteredRecipients = await getFilteredRecipients(filters);
        setRecipients(filteredRecipients);
      } catch (error) {
        console.error('Error loading recipients:', error);
        toast.error('Failed to load recipients');
      } finally {
        setLoading(false);
      }
    };

    loadRecipients();
  }, [user, userType, filters]);

  // Filter recipients based on search
  const filteredRecipients = recipients.filter((recipient) =>
    recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecipientSelect = (recipientId: string) => {
    if (messageType === 'individual') {
      setSelectedRecipients([recipientId]);
    } else {
      if (selectedRecipients.includes(recipientId)) {
        setSelectedRecipients(selectedRecipients.filter((id) => id !== recipientId));
      } else {
        setSelectedRecipients([...selectedRecipients, recipientId]);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedRecipients.length === filteredRecipients.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(filteredRecipients.map((r) => r.id));
    }
  };

  const handleSend = async () => {
    if (!user || userType !== 'admin') return;

    // Validation
    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter message content');
      return;
    }

    if (messageType === 'bulk' && !subject.trim()) {
      toast.error('Please enter a subject for bulk message');
      return;
    }

    setSending(true);
    try {
      if (messageType === 'individual') {
        // Send individual message
        const recipientId = selectedRecipients[0];
        const recipient = recipients.find((r) => r.id === recipientId);
        if (!recipient) throw new Error('Recipient not found');

        await sendIndividualMessage(
          user.uid,
          user.displayName || 'Admin',
          recipientId,
          recipient.type as 'jobhunter' | 'agency',
          content
        );

        toast.success('Message sent successfully!');
        router.push(`/admin/messages/${recipientId}`);
      } else {
        // Send bulk message
        await sendBulkMessage(
          user.uid,
          user.displayName || 'Admin',
          selectedRecipients,
          subject,
          content,
          filters.userType || 'all',
          filters
        );

        toast.success(`Message sent to ${selectedRecipients.length} recipients!`);
        router.push('/admin/messages');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => router.push('/admin/messages')}
          >
            Back
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compose Message</h1>
            <p className="text-sm text-gray-600 mt-1">
              Send a message to users
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                {/* Message Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="messageType"
                        value="individual"
                        checked={messageType === 'individual'}
                        onChange={(e) => setMessageType(e.target.value as MessageType)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">Individual</span>
                    </label>

                    {canSendBulkMessages(userProfile as any) && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="messageType"
                          value="bulk"
                          checked={messageType === 'bulk'}
                          onChange={(e) => setMessageType(e.target.value as MessageType)}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Bulk</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Subject (for bulk messages) */}
                {messageType === 'bulk' && (
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Enter message subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                )}

                {/* Message Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <TextArea
                    id="content"
                    placeholder="Enter your message..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {content.length}/2000 characters
                  </p>
                </div>

                {/* Send Button */}
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin/messages')}
                    disabled={sending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    icon={Send}
                    onClick={handleSend}
                    disabled={sending || selectedRecipients.length === 0 || !content.trim()}
                    isLoading={sending}
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Recipients Panel */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Recipients</h3>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Filter className="w-4 h-4 inline mr-1" />
                    Filters
                  </button>
                </div>

                {showFilters && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        User Type
                      </label>
                      <Select
                        value={filters.userType || 'all'}
                        onChange={(e) => setFilters({ ...filters, userType: e.target.value as RecipientType })}
                        options={[
                          { value: 'all', label: 'All Users' },
                          { value: 'jobhunter', label: 'Job Hunters' },
                          { value: 'agency', label: 'Agencies' },
                        ]}
                      />
                    </div>
                  </div>
                )}

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search recipients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>

                {/* Select All (for bulk) */}
                {messageType === 'bulk' && filteredRecipients.length > 0 && (
                  <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.length === filteredRecipients.length}
                      onChange={handleSelectAll}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">
                      Select All ({filteredRecipients.length})
                    </span>
                  </label>
                )}

                {/* Recipients List */}
                <div className="max-h-96 overflow-y-auto space-y-1">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                    </div>
                  ) : filteredRecipients.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No recipients found
                    </p>
                  ) : (
                    filteredRecipients.map((recipient) => {
                      const isSelected = selectedRecipients.includes(recipient.id);
                      return (
                        <label
                          key={recipient.id}
                          className={`
                            flex items-center gap-2 p-2 rounded cursor-pointer transition-colors
                            ${isSelected ? 'bg-primary-50 border-primary-200' : 'hover:bg-gray-50'}
                          `}
                        >
                          <input
                            type={messageType === 'individual' ? 'radio' : 'checkbox'}
                            name={messageType === 'individual' ? 'recipient' : undefined}
                            checked={isSelected}
                            onChange={() => handleRecipientSelect(recipient.id)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {recipient.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {recipient.email}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {recipient.type}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>

                {/* Selected Count */}
                {selectedRecipients.length > 0 && (
                  <div className="text-sm text-gray-600 text-center py-2 border-t">
                    {selectedRecipients.length} recipient{selectedRecipients.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}