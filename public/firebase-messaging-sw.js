// Firebase Cloud Messaging Service Worker
// This script runs in the background to handle push notifications when the app is not in focus

importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

// Initialize Firebase in service worker
// Note: These values should match your Firebase config
// You can get these from your Firebase project settings
firebase.initializeApp({
  apiKey: "AIzaSyC0Jq9nL5VKXqMQp8wYZ5_Ym0Yx9JZvQXM",
  authDomain: "job-agent-ph.firebaseapp.com",
  projectId: "job-agent-ph",
  storageBucket: "job-agent-ph.firebasestorage.app",
  messagingSenderId: "522717699654",
  appId: "1:522717699654:web:a0f8ad3f0e0b5c8c8f5e5a"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Job Agent PH';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/icon-144x144.png',
    data: payload.data,
    tag: 'job-agent-notification', // Group notifications
    requireInteraction: false, // Auto-dismiss after a while
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  const actionUrl = event.notification.data?.actionUrl || '/notifications';
  const fullUrl = self.location.origin + actionUrl;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === fullUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    })
  );
});
