'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDbInstance } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { logUserActivity } from '@/lib/activity-helpers';
import { Bell, Mail, MessageCircle, Briefcase, Calendar, Shield } from 'lucide-react';

interface NotificationPreferences {
  emailNotifications: boolean;
  applicationUpdates: boolean;
  newMessages: boolean;
  jobMatches: boolean;
  interviewReminders: boolean;
  systemAlerts: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  applicationUpdates: true,
  newMessages: true,
  jobMatches: true,
  interviewReminders: true,
  systemAlerts: true,
};

export default function NotificationSettingsPage() {
  const { user, userType } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const db = getDbInstance();
        const prefsDoc = await getDoc(doc(db, 'notificationPreferences', user.uid));

        if (prefsDoc.exists()) {
          setPreferences({ ...defaultPreferences, ...prefsDoc.data() });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setSaveMessage('');

    try {
      const db = getDbInstance();
      await setDoc(doc(db, 'notificationPreferences', user.uid), preferences);
      setSaveMessage('Preferences saved successfully!');
      logUserActivity({
        userId: user.uid,
        userType: (userType === 'agency' ? 'agency' : 'jobhunter') as 'jobhunter' | 'agency',
        userName: user.displayName || 'User',
        activityType: 'notification_preferences_updated',
        title: 'Notification Preferences Updated',
        description: 'Updated notification preferences',
        resourceType: 'profile',
        resourceId: user.uid,
      });
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveMessage('Error saving preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Notification Settings</h1>
                <p className="text-sm text-gray-600">Manage how you receive notifications</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="px-6 py-6 space-y-6">
            {/* Email Notifications Master Toggle */}
            <div className="pb-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive email notifications in addition to in-app alerts
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Individual Preferences */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Notification Types</h3>

              {/* Application Updates */}
              <div className="flex items-start justify-between py-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Application Updates</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Status changes on your job applications
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('applicationUpdates')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    preferences.applicationUpdates ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.applicationUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* New Messages */}
              <div className="flex items-start justify-between py-3">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">New Messages</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      When you receive a new message
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('newMessages')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    preferences.newMessages ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.newMessages ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Interview Reminders */}
              <div className="flex items-start justify-between py-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Interview Reminders</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Reminders for scheduled interviews
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('interviewReminders')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    preferences.interviewReminders ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.interviewReminders ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* System Alerts */}
              <div className="flex items-start justify-between py-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">System Alerts</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Important account and security updates
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => togglePreference('systemAlerts')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    preferences.systemAlerts ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      preferences.systemAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              {saveMessage && (
                <p className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {saveMessage}
                </p>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
