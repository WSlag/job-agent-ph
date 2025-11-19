'use client';

import { useState, useEffect } from 'react';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, addDoc, serverTimestamp, where, getDocs, limit } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDistanceToNow } from 'date-fns';
import { Mail, MessageSquare, Clock, User, CheckCircle, XCircle, AlertCircle, ExternalLink, Filter, Search } from 'lucide-react';
import { COLLECTIONS } from '@/lib/collections';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  referenceNumber: string;
  status: 'new' | 'in_progress' | 'resolved' | 'spam';
  userId: string | null;
  userType: string;
  ipAddress: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactsPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved' | 'spam'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Get Firestore instance
    const db = getDbInstance();

    // Subscribe to contacts collection
    const contactsQuery = query(
      collection(db, COLLECTIONS.CONTACTS),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(contactsQuery, (snapshot) => {
      const contactsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
      setContacts(contactsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateContactStatus = async (contactId: string, newStatus: Contact['status']) => {
    try {
      const db = getDbInstance();
      await updateDoc(doc(db, COLLECTIONS.CONTACTS, contactId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Contact marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Failed to update contact status');
    }
  };

  const convertToConversation = async (contact: Contact) => {
    if (contact.userId || converting) return;

    setConverting(true);
    try {
      const db = getDbInstance();

      // Create a guest user conversation
      const conversationData = {
        adminId: user?.uid,
        userId: `guest_${contact.email.replace('@', '_at_')}`,
        userType: 'guest',
        guestEmail: contact.email,
        guestName: contact.name,
        contactRef: contact.id,
        referenceNumber: contact.referenceNumber,
        lastMessage: {
          id: '',
          content: `[Contact Form: ${contact.subject}] ${contact.message.substring(0, 100)}...`,
          senderId: `guest_${contact.email.replace('@', '_at_')}`,
          senderType: 'user',
          createdAt: serverTimestamp(),
          read: false,
        },
        unreadCount: 0,
        unreadCount_admin: 1,
        unreadCount_user: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const conversationRef = await addDoc(collection(db, COLLECTIONS.ADMIN_CONVERSATIONS), conversationData);

      // Add the first message
      const messageData = {
        content: `Subject: ${contact.subject}\n\n${contact.message}\n\nReference: ${contact.referenceNumber}`,
        senderId: `guest_${contact.email.replace('@', '_at_')}`,
        senderType: 'user',
        createdAt: serverTimestamp(),
        read: false,
        metadata: {
          isContactForm: true,
          referenceNumber: contact.referenceNumber,
          contactId: contact.id,
        },
      };

      const messageRef = await addDoc(
        collection(db, COLLECTIONS.ADMIN_CONVERSATIONS, conversationRef.id, 'messages'),
        messageData
      );

      // Update conversation with message ID
      await updateDoc(conversationRef, {
        'lastMessage.id': messageRef.id,
      });

      // Update contact with conversation ID
      await updateDoc(doc(db, COLLECTIONS.CONTACTS, contact.id), {
        conversationId: conversationRef.id,
        status: 'in_progress',
        updatedAt: new Date().toISOString()
      });

      toast.success('Conversation created successfully');
      setSelectedContact(null);
    } catch (error) {
      console.error('Error converting to conversation:', error);
      toast.error('Failed to create conversation');
    } finally {
      setConverting(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter !== 'all' && contact.status !== filter) return false;
    if (searchTerm && !contact.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !contact.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !contact.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: Contact['status']) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      spam: 'bg-red-100 text-red-800'
    };

    const icons = {
      new: <AlertCircle className="w-3 h-3 mr-1" />,
      in_progress: <Clock className="w-3 h-3 mr-1" />,
      resolved: <CheckCircle className="w-3 h-3 mr-1" />,
      spam: <XCircle className="w-3 h-3 mr-1" />
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Contact Submissions</h1>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 md:space-y-6 p-4 md:p-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <div className="space-y-6">
        {/* Filters and Search */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, email, subject, or reference..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="spam">Spam</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">{contacts.filter(c => c.status === 'new').length}</div>
            <div className="text-sm text-gray-600">New</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{contacts.filter(c => c.status === 'in_progress').length}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{contacts.filter(c => c.status === 'resolved').length}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-gray-600">{contacts.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </Card>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No contact submissions found.</p>
            </Card>
          ) : (
            filteredContacts.map(contact => (
              <Card key={contact.id} className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                      <h3 className="text-lg font-semibold">{contact.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(contact.status)}
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="break-all">{contact.email}</span>
                        {contact.userId && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs whitespace-nowrap">
                            Authenticated
                          </span>
                        )}
                      </div>

                      <div className="font-medium text-gray-900">
                        Subject: {contact.subject}
                      </div>

                      <div className="text-gray-600">
                        {contact.message.length > 200
                          ? `${contact.message.substring(0, 200)}...`
                          : contact.message}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 flex-wrap">
                        <span className="whitespace-nowrap">Ref: {contact.referenceNumber}</span>
                        <span className="whitespace-nowrap">IP: {contact.ipAddress}</span>
                        {contact.userType !== 'guest' && (
                          <span className="whitespace-nowrap">Type: {contact.userType}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto md:ml-4">
                    {contact.conversationId ? (
                      <Link href={`/admin/messages/${contact.conversationId}`} className="w-full sm:w-auto">
                        <Button size="sm" className="w-full sm:w-auto whitespace-nowrap">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          View Chat
                        </Button>
                      </Link>
                    ) : contact.userId ? (
                      <Link href={`/admin/messages`} className="w-full sm:w-auto">
                        <Button size="sm" className="w-full sm:w-auto whitespace-nowrap">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Messages
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => convertToConversation(contact)}
                        disabled={converting}
                        className="w-full sm:w-auto whitespace-nowrap"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Convert to Chat
                      </Button>
                    )}

                    {contact.status === 'new' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateContactStatus(contact.id, 'in_progress')}
                        className="w-full sm:w-auto whitespace-nowrap"
                      >
                        Mark In Progress
                      </Button>
                    )}

                    {contact.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateContactStatus(contact.id, 'resolved')}
                        className="w-full sm:w-auto whitespace-nowrap"
                      >
                        Mark Resolved
                      </Button>
                    )}

                    {contact.status !== 'spam' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full sm:w-auto text-red-600 hover:bg-red-50 whitespace-nowrap"
                        onClick={() => updateContactStatus(contact.id, 'spam')}
                      >
                        Mark as Spam
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}