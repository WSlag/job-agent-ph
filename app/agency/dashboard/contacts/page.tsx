'use client';

import { useEffect, useState } from 'react';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
import { Mail, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  referenceNumber: string;
  status: 'new' | 'read' | 'responded';
  ipAddress: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'responded'>('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    // Real-time listener for contacts
    const contactsRef = collection(getDbInstance(), 'contacts');
    const q = query(contactsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData: Contact[] = [];
      snapshot.forEach((doc) => {
        contactsData.push({
          id: doc.id,
          ...doc.data(),
        } as Contact);
      });
      setContacts(contactsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching contacts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateContactStatus = async (contactId: string, status: 'new' | 'read' | 'responded') => {
    try {
      const contactRef = doc(getDbInstance(), 'contacts', contactId);
      await updateDoc(contactRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
      console.log(`Contact ${contactId} marked as ${status}`);
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.status === 'new') {
      updateContactStatus(contact.id, 'read');
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Mail className="w-4 h-4" />;
      case 'read':
        return <Clock className="w-4 h-4" />;
      case 'responded':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Manila',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
            <p className="text-gray-600">Manage and respond to contact form submissions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                </div>
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {contacts.filter((c) => c.status === 'new').length}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-blue-400" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Read</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {contacts.filter((c) => c.status === 'read').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Responded</p>
                  <p className="text-2xl font-bold text-green-600">
                    {contacts.filter((c) => c.status === 'responded').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, subject, or reference number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Contacts List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
              {loading ? (
                <Card className="p-4">
                  <p className="text-gray-500 text-center">Loading contacts...</p>
                </Card>
              ) : filteredContacts.length === 0 ? (
                <Card className="p-4">
                  <p className="text-gray-500 text-center">No contacts found</p>
                </Card>
              ) : (
                filteredContacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedContact?.id === contact.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleContactClick(contact)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{contact.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                        <p className="text-sm text-gray-700 font-medium truncate">{contact.subject}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                          contact.status
                        )}`}
                      >
                        {getStatusIcon(contact.status)}
                        {contact.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{contact.referenceNumber}</span>
                      <span>{formatDate(contact.createdAt)}</span>
                    </div>
                  </Card>
                ))
              )}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-2">
              {selectedContact ? (
                <Card className="p-6">
                  <div className="mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedContact.name}</h2>
                        <a
                          href={`mailto:${selectedContact.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedContact.email}
                        </a>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                          selectedContact.status
                        )}`}
                      >
                        {getStatusIcon(selectedContact.status)}
                        {selectedContact.status}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Reference:</span>
                          <p className="font-mono font-semibold text-gray-900">
                            {selectedContact.referenceNumber}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Submitted:</span>
                          <p className="font-semibold text-gray-900">
                            {formatDate(selectedContact.createdAt)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">IP Address:</span>
                          <p className="font-mono text-gray-900">{selectedContact.ipAddress}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Updated:</span>
                          <p className="text-gray-900">{formatDate(selectedContact.updatedAt)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Subject</h3>
                      <p className="text-gray-900">{selectedContact.subject}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Message</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => updateContactStatus(selectedContact.id, 'responded')}
                        disabled={selectedContact.status === 'responded'}
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Responded
                      </Button>
                      <a
                        href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}&body=Hi ${selectedContact.name},%0D%0A%0D%0AThank you for contacting Job Agent PH (Ref: ${selectedContact.referenceNumber}).%0D%0A%0D%0A`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Reply via Email
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Select a contact to view details</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
