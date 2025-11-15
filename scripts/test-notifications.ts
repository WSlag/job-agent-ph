/**
 * Test script to verify notification system functionality
 * Run with: npx tsx scripts/test-notifications.ts
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Your Firebase configuration (replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const functions = getFunctions(app);

// Test user IDs (replace with actual IDs from your database)
const TEST_JOB_HUNTER_ID = 'test-job-hunter-id';
const TEST_AGENCY_ID = 'test-agency-id';

async function testMessageNotification() {
  console.log('\n📧 Testing Message Notification...');

  try {
    // Create a test message notification
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId: TEST_JOB_HUNTER_ID,
      type: 'message',
      title: 'New Message',
      message: 'Test message notification - You have a new message!',
      read: false,
      createdAt: Timestamp.now(),
      actionUrl: '/messages?conversationId=test',
    });

    console.log('✅ Message notification created:', notificationRef.id);

    // Verify it was created
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', TEST_JOB_HUNTER_ID),
      where('type', '==', 'message')
    );
    const snapshot = await getDocs(q);
    console.log(`✅ Found ${snapshot.size} message notification(s)`);

  } catch (error) {
    console.error('❌ Message notification test failed:', error);
  }
}

async function testJobNotification() {
  console.log('\n💼 Testing Job Notification...');

  try {
    // Create a test job notification
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId: TEST_JOB_HUNTER_ID,
      type: 'job_match',
      title: 'New Job Match!',
      message: 'Test job notification - A new job matches your profile!',
      read: false,
      createdAt: Timestamp.now(),
      actionUrl: '/jobs/test-job-id',
    });

    console.log('✅ Job notification created:', notificationRef.id);

    // Verify it was created
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', TEST_JOB_HUNTER_ID),
      where('type', '==', 'job_match')
    );
    const snapshot = await getDocs(q);
    console.log(`✅ Found ${snapshot.size} job notification(s)`);

  } catch (error) {
    console.error('❌ Job notification test failed:', error);
  }
}

async function testApplicationNotification() {
  console.log('\n📄 Testing Application Notification...');

  try {
    // Create a test application notification
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId: TEST_AGENCY_ID,
      type: 'application_update',
      title: 'New Application',
      message: 'Test application notification - Someone applied to your job!',
      read: false,
      createdAt: Timestamp.now(),
      actionUrl: '/agency/applications?id=test',
    });

    console.log('✅ Application notification created:', notificationRef.id);

    // Verify it was created
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', TEST_AGENCY_ID),
      where('type', '==', 'application_update')
    );
    const snapshot = await getDocs(q);
    console.log(`✅ Found ${snapshot.size} application notification(s)`);

  } catch (error) {
    console.error('❌ Application notification test failed:', error);
  }
}

async function testInterviewNotification() {
  console.log('\n📅 Testing Interview Notification...');

  try {
    // Create a test interview notification
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId: TEST_JOB_HUNTER_ID,
      type: 'interview',
      title: 'Interview Scheduled!',
      message: 'Test interview notification - You have been selected for an interview!',
      read: false,
      createdAt: Timestamp.now(),
      actionUrl: '/applications/test-id',
    });

    console.log('✅ Interview notification created:', notificationRef.id);

    // Verify it was created
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', TEST_JOB_HUNTER_ID),
      where('type', '==', 'interview')
    );
    const snapshot = await getDocs(q);
    console.log(`✅ Found ${snapshot.size} interview notification(s)`);

  } catch (error) {
    console.error('❌ Interview notification test failed:', error);
  }
}

async function testUnreadConversations() {
  console.log('\n💬 Testing Unread Conversations...');

  try {
    // Create a test conversation with unread messages
    const conversationRef = await addDoc(collection(db, 'conversations'), {
      jobHunterId: TEST_JOB_HUNTER_ID,
      agencyId: TEST_AGENCY_ID,
      [`unreadCount_${TEST_JOB_HUNTER_ID}`]: 2,
      [`unreadCount_${TEST_AGENCY_ID}`]: 0,
      lastMessage: {
        content: 'This is a test message from the agency',
        senderId: TEST_AGENCY_ID,
        createdAt: Timestamp.now(),
        read: false,
      },
      updatedAt: Timestamp.now(),
    });

    console.log('✅ Test conversation created:', conversationRef.id);

    // Verify unread count
    const q = query(
      collection(db, 'conversations'),
      where('jobHunterId', '==', TEST_JOB_HUNTER_ID)
    );
    const snapshot = await getDocs(q);

    let totalUnread = 0;
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const unreadCount = data[`unreadCount_${TEST_JOB_HUNTER_ID}`] || 0;
      totalUnread += unreadCount;
    });

    console.log(`✅ Job hunter has ${totalUnread} unread messages`);

  } catch (error) {
    console.error('❌ Unread conversations test failed:', error);
  }
}

async function checkNotificationCounts() {
  console.log('\n📊 Checking Notification Counts...');

  try {
    // Get all unread notifications for job hunter
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', TEST_JOB_HUNTER_ID),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);

    const counts = {
      total: 0,
      jobs: 0,
      messages: 0,
      applications: 0,
      interviews: 0,
    };

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      counts.total++;

      switch (data.type) {
        case 'job_match':
          counts.jobs++;
          break;
        case 'message':
          counts.messages++;
          break;
        case 'application_update':
          counts.applications++;
          break;
        case 'interview':
          counts.interviews++;
          break;
      }
    });

    console.log('📈 Notification counts for job hunter:');
    console.log(`  Total unread: ${counts.total}`);
    console.log(`  Jobs: ${counts.jobs}`);
    console.log(`  Messages: ${counts.messages}`);
    console.log(`  Applications: ${counts.applications}`);
    console.log(`  Interviews: ${counts.interviews}`);

  } catch (error) {
    console.error('❌ Failed to check notification counts:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Notification System Tests...\n');
  console.log('⚠️  Note: Replace TEST_JOB_HUNTER_ID and TEST_AGENCY_ID with real user IDs from your database\n');

  await testMessageNotification();
  await testJobNotification();
  await testApplicationNotification();
  await testInterviewNotification();
  await testUnreadConversations();
  await checkNotificationCounts();

  console.log('\n✨ All tests completed!');
  console.log('\nNext steps:');
  console.log('1. Check your Notifications page - you should see the test notifications');
  console.log('2. The Messages tab should show unread conversations');
  console.log('3. Badge counts should appear in navigation');
  console.log('4. Deploy Cloud Functions: npm run deploy:functions');
}

// Run the tests
runAllTests().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});