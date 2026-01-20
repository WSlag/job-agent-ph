'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Send, Mail, Clock, CheckCircle, AlertCircle, Eye, Copy, Inbox, X, MessageCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface OutreachLog {
  id: string;
  recipientEmail: string;
  agencyName: string | null;
  messageType: 'short' | 'standard' | 'formal';
  sentBy: string;
  sentAt: string;
  status: string;
  messageId: string;
  hasReply?: boolean;
  emailStatus?: string;
}

interface OutreachReply {
  id: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  textContent: string | null;
  htmlContent: string | null;
  agencyName: string | null;
  outreachId: string | null;
  receivedAt: string;
  isRead: boolean;
}

const MESSAGE_TYPES = [
  {
    value: 'short',
    label: 'Short',
    description: 'Brief message, ideal for SMS-like outreach',
  },
  {
    value: 'standard',
    label: 'Standard (Recommended)',
    description: 'WhatsApp/Viber style with benefits highlighted',
  },
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional email for LinkedIn or formal channels',
  },
];

const MESSAGE_PREVIEWS = {
  short: `Hi [Agency Name],

Post your jobs FREE on JobAgentPH — reach thousands of verified Filipino workers.

5 free job posts, no commitment.

Start now: jobagentph.com/agency/register`,
  standard: `Hi [Agency Name],

Looking to hire quality Filipino workers faster?

JobAgentPH connects you directly with thousands of verified job seekers — OFWs, healthcare workers, domestic helpers, and skilled professionals ready to work.

✓ 5 FREE job posts (no credit card needed)
✓ Direct messaging with candidates
✓ DMW-verified platform for credibility

Agencies using JobAgentPH fill positions 2x faster.

Post your first job now: jobagentph.com/agency/register`,
  formal: `Dear [Agency Name],

I would like to introduce JobAgentPH, a platform connecting licensed recruitment agencies with verified Filipino professionals seeking local and overseas employment.

What we offer:
• 5 FREE job posts to start (no strings attached)
• Access to thousands of active, verified job seekers
• Direct candidate messaging and applicant tracking
• DMW-compliant platform that builds trust with workers

Many agencies report filling positions faster after joining our platform.

Create your free agency account: jobagentph.com/agency/register`,
};

export default function AdminOutreachPage() {
  const { user } = useAuth();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [messageType, setMessageType] = useState<'short' | 'standard' | 'formal'>('standard');
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState<OutreachLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Replies state
  const [replies, setReplies] = useState<OutreachReply[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedReply, setSelectedReply] = useState<OutreachReply | null>(null);
  const [activeTab, setActiveTab] = useState<'send' | 'replies'>('send');

  useEffect(() => {
    fetchLogs();
    fetchReplies();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/outreach');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await fetch('/api/admin/outreach/replies');
      if (response.ok) {
        const data = await response.json();
        setReplies(data.replies || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      toast.error('Please enter a recipient email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/admin/outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          agencyName: agencyName.trim() || null,
          messageType,
          adminUserId: user?.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      toast.success(`Outreach email sent to ${recipientEmail}`);
      setRecipientEmail('');
      setAgencyName('');
      fetchLogs();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setSending(false);
    }
  };

  const markReplyAsRead = async (replyId: string) => {
    try {
      await fetch(`/api/admin/outreach/replies?id=${replyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      });
      setReplies(replies.map(r => r.id === replyId ? { ...r, isRead: true } : r));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking reply as read:', error);
    }
  };

  const deleteReply = async (replyId: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      await fetch(`/api/admin/outreach/replies?id=${replyId}`, {
        method: 'DELETE',
      });
      setReplies(replies.filter(r => r.id !== replyId));
      setSelectedReply(null);
      toast.success('Reply deleted');
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Failed to delete reply');
    }
  };

  const openReply = (reply: OutreachReply) => {
    setSelectedReply(reply);
    if (!reply.isRead) {
      markReplyAsRead(reply.id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getPreviewText = () => {
    return MESSAGE_PREVIEWS[messageType].replace('[Agency Name]', agencyName || '');
  };

  const getEmailStatusBadge = (log: OutreachLog) => {
    if (log.hasReply) {
      return <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded">Replied</span>;
    }
    if (log.emailStatus === 'opened') {
      return <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Opened</span>;
    }
    if (log.emailStatus === 'delivered') {
      return <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">Delivered</span>;
    }
    if (log.emailStatus === 'bounced') {
      return <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Bounced</span>;
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Agency Outreach</h1>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('send')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'send'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Send
            </button>
            <button
              onClick={() => setActiveTab('replies')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                activeTab === 'replies'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Inbox className="w-4 h-4 inline mr-2" />
              Replies
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'send' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Send Email Form */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  Send Outreach Email
                </h2>

                <div className="space-y-4">
                  {/* Recipient Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="agency@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Agency Name (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agency Name <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="ABC Recruitment Agency"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Message Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Type
                    </label>
                    <div className="space-y-2">
                      {MESSAGE_TYPES.map((type) => (
                        <label
                          key={type.value}
                          className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            messageType === type.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="messageType"
                            value={type.value}
                            checked={messageType === type.value}
                            onChange={(e) => setMessageType(e.target.value as typeof messageType)}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{type.label}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preview Button */}
                  <Button
                    variant="secondary"
                    onClick={() => setShowPreview(!showPreview)}
                    icon={Eye}
                    iconPosition="left"
                    className="w-full"
                  >
                    {showPreview ? 'Hide Preview' : 'Preview Message'}
                  </Button>

                  {/* Preview */}
                  {showPreview && (
                    <div className="relative bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <button
                        onClick={() => copyToClipboard(getPreviewText())}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {getPreviewText()}
                      </pre>
                    </div>
                  )}

                  {/* Send Button */}
                  <Button
                    onClick={handleSendEmail}
                    disabled={sending || !recipientEmail.trim()}
                    icon={Send}
                    iconPosition="left"
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {sending ? 'Sending...' : 'Send Outreach Email'}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Email will be sent from contact@jobagentph.com
                  </p>
                </div>
              </Card>

              {/* Recent Outreach Logs */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Recent Outreach
                </h2>

                {loadingLogs ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No outreach emails sent yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className={`border rounded-lg p-3 hover:bg-gray-50 ${
                          log.hasReply ? 'border-green-200 bg-green-50' : 'border-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate flex items-center gap-2">
                              {log.recipientEmail}
                              {log.hasReply && (
                                <MessageCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            {log.agencyName && (
                              <div className="text-sm text-gray-500 truncate">
                                {log.agencyName}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded capitalize">
                                {log.messageType}
                              </span>
                              {getEmailStatusBadge(log)}
                              <span className="text-xs text-gray-400">
                                {log.sentAt
                                  ? formatDistanceToNow(new Date(log.sentAt), { addSuffix: true })
                                  : 'Just now'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {log.status === 'sent' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Quick Copy Messages */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Copy Messages</h2>
              <p className="text-sm text-gray-500 mb-4">
                Copy these messages for WhatsApp, Viber, or other messaging platforms
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MESSAGE_TYPES.map((type) => (
                  <div key={type.value} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{type.label.replace(' (Recommended)', '')}</h3>
                      <button
                        onClick={() => copyToClipboard(MESSAGE_PREVIEWS[type.value as keyof typeof MESSAGE_PREVIEWS])}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans line-clamp-6">
                      {MESSAGE_PREVIEWS[type.value as keyof typeof MESSAGE_PREVIEWS]}
                    </pre>
                  </div>
                ))}
              </div>
            </Card>
          </>
        ) : (
          /* Replies Tab */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Replies List */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Inbox className="w-5 h-5 text-blue-600" />
                Inbox
                {unreadCount > 0 && (
                  <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </h2>

              {loadingReplies ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : replies.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Inbox className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">No replies yet</p>
                  <p className="text-sm mt-1">
                    Replies from agencies will appear here
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left text-sm">
                    <p className="font-medium text-blue-800 mb-2">How it works:</p>
                    <p className="text-blue-700 mb-2">
                      When you send outreach emails, agencies can reply directly. Their replies will automatically appear here.
                    </p>
                    <p className="text-blue-600 text-xs">
                      Note: Replies are sent to the Resend inbound email address and processed via webhook.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {replies.map((reply) => (
                    <div
                      key={reply.id}
                      onClick={() => openReply(reply)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedReply?.id === reply.id
                          ? 'border-blue-500 bg-blue-50'
                          : reply.isRead
                          ? 'border-gray-100 hover:bg-gray-50'
                          : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!reply.isRead && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                            )}
                            <span className={`font-medium truncate ${!reply.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {reply.fromName || reply.fromEmail}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {reply.fromEmail}
                          </div>
                          <div className="text-sm text-gray-600 truncate mt-1">
                            {reply.subject}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {reply.receivedAt
                              ? formatDistanceToNow(new Date(reply.receivedAt), { addSuffix: true })
                              : 'Just now'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Reply Detail */}
            <Card className="p-6">
              {selectedReply ? (
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold">{selectedReply.subject}</h2>
                      <div className="text-sm text-gray-500 mt-1">
                        From: {selectedReply.fromName || selectedReply.fromEmail}
                        {selectedReply.fromName && (
                          <span className="text-gray-400"> &lt;{selectedReply.fromEmail}&gt;</span>
                        )}
                      </div>
                      {selectedReply.agencyName && (
                        <div className="text-sm text-blue-600 mt-1">
                          Agency: {selectedReply.agencyName}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {selectedReply.receivedAt
                          ? new Date(selectedReply.receivedAt).toLocaleString()
                          : 'Just now'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteReply(selectedReply.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete reply"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedReply(null)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    {selectedReply.htmlContent ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedReply.htmlContent }}
                      />
                    ) : selectedReply.textContent ? (
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                        {selectedReply.textContent}
                      </pre>
                    ) : (
                      <p className="text-gray-500 italic">No content available</p>
                    )}
                  </div>

                  <div className="border-t mt-6 pt-4">
                    <Button
                      onClick={() => {
                        window.open(`mailto:${selectedReply.fromEmail}?subject=Re: ${selectedReply.subject}`, '_blank');
                      }}
                      icon={Send}
                      iconPosition="left"
                      className="w-full"
                    >
                      Reply via Email Client
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                  <Mail className="w-16 h-16 mb-4 opacity-50" />
                  <p>Select a reply to view details</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
