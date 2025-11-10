'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Settings, Save, Bell, Mail, Shield, Database, Globe } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { user, userType } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // General Settings
  const [siteName, setSiteName] = useState('Job Agent PH');
  const [siteDescription, setSiteDescription] = useState('Your trusted partner in finding international job opportunities');
  const [contactEmail, setContactEmail] = useState('support@jobagentph.com');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [applicationNotifications, setApplicationNotifications] = useState(true);
  const [jobPostNotifications, setJobPostNotifications] = useState(true);

  // Security Settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [requireAgencyVerification, setRequireAgencyVerification] = useState(true);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  // Feature Flags
  const [enableChat, setEnableChat] = useState(true);
  const [enableAIAssistant, setEnableAIAssistant] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!user || userType !== 'admin') {
      router.push('/');
      return;
    }

    // Load settings from Firestore
    const loadSettings = async () => {
      try {
        const db = getDbInstance();
        const settingsDoc = await getDoc(doc(db, 'settings', 'platform'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setSiteName(data.siteName || 'Job Agent PH');
          setSiteDescription(data.siteDescription || '');
          setContactEmail(data.contactEmail || '');
          setEmailNotifications(data.emailNotifications ?? true);
          setApplicationNotifications(data.applicationNotifications ?? true);
          setJobPostNotifications(data.jobPostNotifications ?? true);
          setRequireEmailVerification(data.requireEmailVerification ?? true);
          setRequireAgencyVerification(data.requireAgencyVerification ?? true);
          setMaxLoginAttempts(data.maxLoginAttempts || 5);
          setEnableChat(data.enableChat ?? true);
          setEnableAIAssistant(data.enableAIAssistant ?? true);
          setMaintenanceMode(data.maintenanceMode ?? false);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      }
    };

    loadSettings();
  }, [user, userType, router]);

  const handleSave = async () => {
    setSaving(true);

    try {
      const db = getDbInstance();
      // Save settings to Firestore
      await setDoc(doc(db, 'settings', 'platform'), {
        siteName,
        siteDescription,
        contactEmail,
        emailNotifications,
        applicationNotifications,
        jobPostNotifications,
        requireEmailVerification,
        requireAgencyVerification,
        maxLoginAttempts,
        enableChat,
        enableAIAssistant,
        maintenanceMode,
        updatedAt: new Date(),
        updatedBy: user?.uid,
      });

      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            System Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Configure platform settings and preferences
          </p>
        </div>

        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Description
              </label>
              <textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Email Notifications</div>
                <div className="text-sm text-gray-600">Send email notifications to users</div>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Application Notifications</div>
                <div className="text-sm text-gray-600">Notify agencies of new applications</div>
              </div>
              <input
                type="checkbox"
                checked={applicationNotifications}
                onChange={(e) => setApplicationNotifications(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Job Post Notifications</div>
                <div className="text-sm text-gray-600">Notify job hunters of new matching jobs</div>
              </div>
              <input
                type="checkbox"
                checked={jobPostNotifications}
                onChange={(e) => setJobPostNotifications(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Require Email Verification</div>
                <div className="text-sm text-gray-600">Users must verify email before accessing features</div>
              </div>
              <input
                type="checkbox"
                checked={requireEmailVerification}
                onChange={(e) => setRequireEmailVerification(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Require Agency Verification</div>
                <div className="text-sm text-gray-600">Agencies must be verified before posting jobs</div>
              </div>
              <input
                type="checkbox"
                checked={requireAgencyVerification}
                onChange={(e) => setRequireAgencyVerification(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
                min={3}
                max={10}
                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-600 mt-1">
                Account will be temporarily locked after this many failed attempts
              </p>
            </div>
          </div>
        </Card>

        {/* Feature Flags */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Feature Flags</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Enable Chat</div>
                <div className="text-sm text-gray-600">Allow messaging between job hunters and agencies</div>
              </div>
              <input
                type="checkbox"
                checked={enableChat}
                onChange={(e) => setEnableChat(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Enable AI Assistant</div>
                <div className="text-sm text-gray-600">Enable GABAY AI chatbot for users</div>
              </div>
              <input
                type="checkbox"
                checked={enableAIAssistant}
                onChange={(e) => setEnableAIAssistant(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Maintenance Mode</div>
                <div className="text-sm text-gray-600">
                  <span className="text-red-600 font-medium">WARNING:</span> Site will be unavailable to users
                </div>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
            </label>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/dashboard')}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            icon={Save}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
