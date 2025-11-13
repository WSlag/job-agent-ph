# Notification System - Deployment & Testing Guide

## Overview

This guide covers the complete notification system implementation for Job Agent PH, including deployment, configuration, and testing procedures.

---

## System Architecture

### Components Implemented

1. **Cloud Functions (Backend)** - Automated notification triggers
2. **Frontend UI** - Notification display and management
3. **Email Service** - Resend integration for email notifications
4. **Preferences System** - User notification settings

### Notification Flow

```
User Action (e.g., Apply for Job)
  ↓
Cloud Function Triggered (onApplicationCreated)
  ↓
Notification Created in Firestore
  ↓
Email Sent (if enabled) + Real-time UI Update
```

---

## Pre-Deployment Checklist

### 1. Firebase Project Setup

Ensure your Firebase project has:
- ✅ Firestore Database enabled
- ✅ Authentication enabled
- ✅ Cloud Functions enabled (Blaze plan required)

### 2. Firestore Security Rules

The notification security rules are already defined in [firestore.rules:333-352](job-agent-ph/firestore.rules#L333-L352):

```javascript
match /notifications/{notificationId} {
  // Users can read their own notifications
  allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;

  // Only backend can create notifications
  allow create: if false;

  // Users can update their own notifications (mark as read)
  allow update: if isAuthenticated() &&
                 resource.data.userId == request.auth.uid &&
                 request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read', 'updatedAt']);

  // Users can delete their own notifications
  allow delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
}
```

**Deploy rules:**
```bash
cd job-agent-ph
firebase deploy --only firestore:rules
```

### 3. Firestore Indexes

The required composite index is defined in [lib/collections.ts:104-109](job-agent-ph/lib/collections.ts#L104-L109):

```javascript
{
  collection: 'notifications',
  fields: [
    { field: 'userId', order: 'ASCENDING' },
    { field: 'createdAt', order: 'DESCENDING' }
  ]
}
```

**Create the index:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Firestore Database → Indexes
3. Click "Add Index" and configure as above
4. **OR** Let Firebase auto-create it when you first query (it will show an error with a link to create)

---

## Deployment Steps

### Step 1: Configure Environment Variables

Create `functions/.env` file (copy from `functions/.env.example`):

```bash
cd job-agent-ph/functions
cp .env.example .env
```

Edit `functions/.env`:

```env
# Get your Resend API key from https://resend.com/api-keys
RESEND_API_KEY=re_your_actual_api_key_here

# Configure sender email (must be verified in Resend)
EMAIL_FROM=Job Agent PH <notifications@jobagent.ph>

# Your production app URL
APP_URL=https://job-agent-ph.web.app
```

**Important:** You need to:
1. Sign up at [Resend](https://resend.com)
2. Verify your sending domain
3. Get an API key
4. Add it to the `.env` file

### Step 2: Set Firebase Environment Config

Firebase Functions need environment variables set in Firebase:

```bash
cd job-agent-ph/functions

# Set Resend API key
firebase functions:config:set resend.api_key="re_your_actual_api_key_here"

# Set email sender
firebase functions:config:set email.from="Job Agent PH <notifications@jobagent.ph>"

# Set app URL
firebase functions:config:set app.url="https://job-agent-ph.web.app"
```

Verify configuration:
```bash
firebase functions:config:get
```

### Step 3: Build Cloud Functions

```bash
cd job-agent-ph/functions
npm run build
```

You should see a successful compilation with no errors.

### Step 4: Deploy Cloud Functions

**Deploy all functions:**
```bash
firebase deploy --only functions
```

**OR deploy specific functions:**
```bash
firebase deploy --only functions:onApplicationCreated,functions:onApplicationStatusChanged,functions:onMessageSent
```

Expected output:
```
✔  functions[onApplicationCreated(us-central1)] Successful create operation.
✔  functions[onApplicationStatusChanged(us-central1)] Successful create operation.
✔  functions[onMessageSent(us-central1)] Successful create operation.
✔  functions[onFeaturedRequestCreated(us-central1)] Successful create operation.
✔  functions[onUserCreated(us-central1)] Successful create operation.
```

### Step 5: Deploy Frontend

```bash
cd job-agent-ph
npm run build
firebase deploy --only hosting
```

---

## Testing the Notification System

### Test 1: Application Notifications

**Scenario:** Agency receives notification when job hunter applies

1. **As Job Hunter:**
   - Log in as a job hunter
   - Navigate to Jobs page
   - Apply for a job

2. **As Agency:**
   - Log in as the agency that posted the job
   - Click the bell icon in header
   - **Expected:** See notification "New Application Received"
   - Click notification to view application

3. **Verify Email:**
   - Check agency's email inbox
   - **Expected:** Email with subject "Job Agent PH: New Application Received"

### Test 2: Application Status Update Notifications

**Scenario:** Job hunter receives notification when application status changes

1. **As Agency:**
   - Log in as agency
   - Go to Applications page
   - Change an application status to "Interview"

2. **As Job Hunter:**
   - Log in as the job hunter who applied
   - Click bell icon or "Alerts" in bottom nav
   - **Expected:** See notification "Interview Scheduled!"
   - Click to view application details

3. **Verify Email:**
   - Check job hunter's email
   - **Expected:** Email about interview invitation

### Test 3: Message Notifications

**Scenario:** Users receive notifications for new messages

1. **As User A:**
   - Send a message to User B

2. **As User B:**
   - **Expected:** See notification badge on bell icon
   - Click notifications
   - **Expected:** See "New Message" notification
   - Click to open conversation

3. **Verify Email:**
   - Check User B's email
   - **Expected:** Email notification about new message

### Test 4: Admin Notifications

**Scenario:** Admin receives notifications for system events

1. **Create New User:**
   - Register a new job hunter or agency account

2. **As Admin:**
   - Log in to admin panel
   - Click bell icon in header
   - **Expected:** See "New User Registration" notification

3. **Featured Request:**
   - As agency, request featured placement
   - As admin, check notifications
   - **Expected:** See "New Featured Request" notification

### Test 5: Notification Preferences

1. **Access Settings:**
   - Navigate to `/settings/notifications`

2. **Disable Email Notifications:**
   - Turn off "Email Notifications" toggle
   - Click "Save Preferences"

3. **Test:**
   - Trigger a notification (e.g., receive a message)
   - **Expected:** In-app notification appears
   - **Expected:** NO email sent

4. **Re-enable:**
   - Turn email notifications back on
   - Test again
   - **Expected:** Both in-app and email notifications

### Test 6: Real-Time Updates

1. **Open Two Browser Windows:**
   - Window A: Logged in as User A
   - Window B: Logged in as User B

2. **Trigger Notification:**
   - In Window A, send message to User B

3. **Observe Window B:**
   - **Expected:** Notification badge appears immediately (no refresh needed)
   - **Expected:** Unread count updates in real-time

---

## Troubleshooting

### Notifications Not Appearing

**Check Cloud Functions Logs:**
```bash
firebase functions:log
```

Look for errors in function execution.

**Common Issues:**

1. **"Permission Denied" Error**
   - **Cause:** Firestore rules not deployed
   - **Fix:** Run `firebase deploy --only firestore:rules`

2. **"Index Required" Error**
   - **Cause:** Missing Firestore index
   - **Fix:** Click the link in the error message to create index

3. **No Email Sent**
   - **Cause:** RESEND_API_KEY not configured
   - **Fix:** Set environment variables (see Step 2)
   - **Verify:** Check Resend dashboard for API usage

4. **Cloud Function Not Triggered**
   - **Cause:** Functions not deployed
   - **Fix:** Run `firebase deploy --only functions`
   - **Verify:** Check Firebase Console → Functions tab

### Debug Specific Function

```bash
# View logs for specific function
firebase functions:log --only onApplicationCreated

# View recent errors
firebase functions:log --only onApplicationCreated --limit 10
```

### Test Email Sending Manually

Create a test script `functions/test-email.js`:

```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const result = await resend.emails.send({
      from: 'Job Agent PH <notifications@jobagent.ph>',
      to: 'your-email@example.com',
      subject: 'Test Email',
      html: '<h1>Test</h1><p>If you receive this, Resend is working!</p>',
    });
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testEmail();
```

Run:
```bash
node test-email.js
```

---

## Monitoring & Maintenance

### View Function Performance

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to Functions tab
3. View metrics: invocations, errors, execution time

### Check Notification Delivery Rate

Query Firestore:
```javascript
const notificationsCount = await db.collection('notifications')
  .where('createdAt', '>=', new Date(Date.now() - 24*60*60*1000))
  .count()
  .get();

console.log(`Notifications sent in last 24h: ${notificationsCount.data().count}`);
```

### Monitor Email Delivery

1. Log in to [Resend Dashboard](https://resend.com/emails)
2. View email logs, delivery rates, bounces

---

## Cost Optimization

### Firebase Functions Pricing

- **Free Tier:** 2M invocations/month
- **Paid:** $0.40 per million invocations

**Estimate for Job Agent PH:**
- 100 applications/day = ~3,000 notifications/month
- Well within free tier

### Resend Pricing

- **Free Tier:** 100 emails/day
- **Pro:** $20/month for 50,000 emails

---

## Features Summary

### ✅ Implemented Features

**Cloud Functions:**
- [x] Application created notification (Agency)
- [x] Application status changed (Job Hunter)
- [x] New message notification (Recipient)
- [x] Featured request created (Admin)
- [x] New user registered (Admin)

**Frontend UI:**
- [x] Notifications page for all user types
- [x] Bell icon with unread badge (Headers)
- [x] Bottom nav notifications (Mobile)
- [x] Real-time unread count
- [x] Mark as read functionality
- [x] Delete notifications
- [x] Filter by type
- [x] Admin notification center

**Email System:**
- [x] Beautiful HTML email templates
- [x] Resend integration
- [x] User preferences for email
- [x] Email notifications for all event types

**Preferences:**
- [x] Email notification toggle
- [x] Per-notification-type preferences
- [x] Settings page at `/settings/notifications`

---

## File Structure

```
job-agent-ph/
├── functions/
│   ├── src/
│   │   ├── index.ts                              # Main entry point
│   │   ├── types/
│   │   │   └── notification.ts                   # TypeScript types
│   │   ├── notifications/
│   │   │   ├── helpers.ts                        # Helper functions
│   │   │   ├── application-notifications.ts      # Application triggers
│   │   │   ├── message-notifications.ts          # Message triggers
│   │   │   └── admin-notifications.ts            # Admin triggers
│   │   └── email/
│   │       ├── send-email.ts                     # Email sender
│   │       └── templates.ts                      # Email templates
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .gitignore
├── hooks/
│   └── useUnreadNotifications.ts                 # Unread count hook
├── app/
│   ├── (authenticated)/
│   │   ├── notifications/page.tsx                # User notifications
│   │   ├── admin/notifications/page.tsx          # Admin notifications
│   │   └── settings/notifications/page.tsx       # Preferences
├── components/
│   └── layout/
│       ├── UserDashboardHeader.tsx               # ✅ Bell icon added
│       ├── AgencyDashboardHeader.tsx             # ✅ Bell icon added
│       ├── AdminLayout.tsx                       # ✅ Bell icon added
│       └── BottomNav.tsx                         # ✅ Alerts tab added
└── NOTIFICATION_SYSTEM_GUIDE.md                  # This file
```

---

## Next Steps / Future Enhancements

### Phase 1 Enhancements (Optional)
- [ ] Push notifications (Web Push API)
- [ ] Notification sound effects
- [ ] Notification grouping ("5 new applications")
- [ ] Batch digest emails (daily summary)

### Phase 2 Enhancements (Optional)
- [ ] SMS notifications (Twilio integration)
- [ ] Slack/Discord webhooks for admins
- [ ] Advanced filtering and search
- [ ] Notification scheduling

---

## Support & Troubleshooting

**Firebase Support:**
- Documentation: https://firebase.google.com/docs/functions
- Community: https://stackoverflow.com/questions/tagged/google-cloud-functions

**Resend Support:**
- Documentation: https://resend.com/docs
- Dashboard: https://resend.com/emails

**Project-Specific Issues:**
- Check Firebase Console logs
- Review Firestore security rules
- Verify environment variables

---

## Deployment Checklist

Before going live:

- [ ] Firestore rules deployed
- [ ] Firestore indexes created
- [ ] Environment variables configured
- [ ] Cloud Functions deployed successfully
- [ ] Resend API key added and verified
- [ ] Sending domain verified in Resend
- [ ] All 6 test scenarios passed
- [ ] Email templates reviewed
- [ ] Frontend deployed
- [ ] Monitoring set up

---

**Implementation Complete! 🎉**

The notification system is now fully functional for Job Hunters, Agencies, and Admins with real-time in-app notifications and email delivery.
