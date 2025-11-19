# Admin Messaging Integration - User Guide

## Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [How It Works](#how-it-works)
4. [Managing Contact Submissions](#managing-contact-submissions)
5. [Converting Contacts to Conversations](#converting-contacts-to-conversations)
6. [Messaging System](#messaging-system)
7. [Complete Workflow](#complete-workflow)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## Overview

The Admin Messaging Integration feature transforms contact form submissions into interactive conversations between admins and users. Instead of receiving static contact forms via email, admins can now manage all inquiries through a centralized messaging interface with real-time two-way communication.

### Key Benefits
- ✅ Centralized inquiry management
- ✅ Real-time two-way messaging
- ✅ Automatic conversation creation for authenticated users
- ✅ Contact submission tracking with reference numbers
- ✅ Search and filter capabilities
- ✅ Status management (New → In Progress → Resolved)
- ✅ Full conversation history
- ✅ Support for both authenticated and guest users

---

## Quick Start

### Accessing the Feature

1. **Login to Admin Dashboard**
   - Navigate to `/admin/dashboard`
   - Ensure you have admin permissions

2. **Access Contact Submissions**
   - Click **"Contacts"** in the admin sidebar
   - Or navigate directly to `/admin/contacts`

3. **View New Submissions**
   - New submissions appear at the top
   - Blue "New" badge indicates unread submissions
   - Statistics cards show submission counts

4. **Start a Conversation**
   - For **authenticated users**: Click **"View Chat"** or **"Messages"**
   - For **guest users**: Click **"Convert to Chat"** first, then **"View Chat"**

5. **Manage Status**
   - Mark as **"In Progress"** when working on it
   - Mark as **"Resolved"** when complete
   - Mark as **"Spam"** if invalid

---

## How It Works

### Automatic Flow for Authenticated Users

```
User (Logged In) → Contact Form → Automatic Conversation Created → Admin Notified
```

**When an authenticated user submits the contact form:**

1. ✅ Contact record saved to database
2. ✅ Reference number generated (e.g., `CNT-20251119-A1B2C3`)
3. ✅ Admin conversation automatically created
4. ✅ First message added to conversation
5. ✅ Admin receives notification
6. ✅ User can view conversation in their messages

**Admin sees:**
- Contact submission in `/admin/contacts`
- New conversation in `/admin/messages`
- Notification bell update

### Manual Flow for Guest Users

```
Guest User → Contact Form → Admin Reviews → Admin Converts → Conversation Created
```

**When a guest (not logged in) submits the contact form:**

1. ✅ Contact record saved to database
2. ✅ Reference number generated
3. ⏸️ **No automatic conversation** (requires admin action)
4. ⏸️ Status remains "New" until admin converts

**Admin must:**
- Review the submission in `/admin/contacts`
- Click **"Convert to Chat"** to create conversation
- Then proceed with messaging

---

## Managing Contact Submissions

### The Contacts Dashboard

Access: **Admin Sidebar → Contacts** or `/admin/contacts`

#### Statistics Overview

Four key metrics displayed at the top:

| Metric | Description | Color |
|--------|-------------|-------|
| **New** | Unread submissions requiring attention | Blue |
| **In Progress** | Currently being handled | Yellow |
| **Resolved** | Completed inquiries | Green |
| **Total** | All submissions | Gray |

#### Search and Filter

**Search Bar:**
- Search by: Name, Email, Subject, or Reference Number
- Real-time filtering as you type
- Case-insensitive search

**Status Filter:**
- **All Status** - Show everything
- **New** - Only new submissions
- **In Progress** - Currently being handled
- **Resolved** - Completed inquiries
- **Spam** - Flagged as spam

**Example Search:**
```
Reference: CNT-20251119-A1B2C3
Email: john.doe@example.com
Subject: Job application inquiry
```

### Contact Submission Card

Each submission displays:

#### User Information
- **Name** - Contact person's name
- **Email** - Contact email address
- **User Type Badge**:
  - 🟦 **Authenticated** - Logged-in user
  - ⚪ **Guest** - Not logged in
- **Role** - jobhunter, agency, or guest

#### Submission Details
- **Subject** - Brief topic summary
- **Message Preview** - First 200 characters
- **Reference Number** - Unique tracking ID (CNT-YYYYMMDD-XXXXXX)
- **IP Address** - For security logging
- **Time** - Relative time (e.g., "2 hours ago")

#### Status Badge
- 🔵 **New** - Unread submission
- 🟡 **In Progress** - Being handled
- 🟢 **Resolved** - Completed
- 🔴 **Spam** - Flagged as spam

### Available Actions

#### For Guest Contacts (Not Yet Converted)

**"Convert to Chat" Button**
- Creates a new admin conversation
- Changes button to "View Chat"
- Updates status to "In Progress"

**"Mark In Progress" Button**
- Updates status without creating conversation
- Useful for tracking work in progress

**"Mark Resolved" Button**
- Closes the inquiry
- Use for simple questions that don't need conversation

**"Mark as Spam" Button**
- Flags submission as spam
- Hides from main view when spam filter is off

#### For Authenticated Users

**"Messages" Button**
- Opens the admin messages list
- Conversation already exists automatically

**"View Chat" Button**
- Opens the specific conversation
- Available after conversation is created

#### For Converted Contacts

**"View Chat" Button**
- Opens the conversation thread
- Allows sending messages back and forth

---

## Converting Contacts to Conversations

### When to Convert

**✅ Convert guest contacts when:**
- The inquiry requires back-and-forth discussion
- You need to request additional information
- The issue needs ongoing support
- You want to maintain a conversation history

**❌ Don't convert when:**
- The submission is spam
- It's a simple question answerable in one response
- The contact information is invalid

### Conversion Process

#### Step 1: Review the Contact

1. Read the full message
2. Check the user's email and name
3. Verify it's a legitimate inquiry
4. Note the reference number

#### Step 2: Click "Convert to Chat"

The system automatically:

1. ✅ Creates guest user ID: `guest_[email with @ replaced by _at_]`
   - Example: `guest_john.doe_at_example.com`

2. ✅ Creates new conversation in database:
   ```javascript
   {
     adminId: "your-admin-id",
     userId: "guest_john.doe_at_example.com",
     userType: "guest",
     guestEmail: "john.doe@example.com",
     guestName: "John Doe",
     contactRef: "contact-record-id",
     referenceNumber: "CNT-20251119-A1B2C3",
     status: "in_progress"
   }
   ```

3. ✅ Creates first message with contact form content:
   ```
   Subject: [Original Subject]

   [Original Message]

   Reference: CNT-20251119-A1B2C3
   ```

4. ✅ Updates contact status to "In Progress"

5. ✅ Links conversation ID to contact record

#### Step 3: Access the Conversation

1. Button changes from "Convert to Chat" to "View Chat"
2. Click "View Chat" to open conversation
3. Start messaging with the guest user

### What Happens After Conversion

**For Admin:**
- Conversation appears in `/admin/messages`
- Can send messages to guest user
- Real-time updates when guest replies

**For Guest User:**
- Would receive email notifications (if email integration is set up)
- Can access conversation via provided link
- Can reply to continue the conversation

**Important Notes:**
- ⚠️ Conversion is permanent - cannot be undone
- ⚠️ Original contact submission remains accessible
- ⚠️ Guest users need the conversation link to reply
- ⚠️ One conversation per contact submission

---

## Messaging System

### For Authenticated Users

#### User Side (`/messages/admin/[conversationId]`)

**Features:**
- Full conversation history
- Real-time message updates
- Read receipts
- Typing indicators
- Send new messages
- View admin profile

**User Experience:**
1. Submit contact form while logged in
2. Automatic conversation created
3. Can access via "Messages" in navigation
4. See conversation with admin
5. Send and receive messages in real-time

#### Admin Side (`/admin/messages/[userId]`)

**Features:**
- View full user profile
- See user type (Job Hunter/Agency/Admin)
- Link to user management page
- Full conversation history
- Real-time messaging
- Read/unread indicators

**Admin Workflow:**
1. Receive notification of new contact
2. Navigate to "Messages" in admin sidebar
3. Find conversation (marked with unread badge)
4. Click to open conversation
5. Read user's inquiry
6. Send response
7. Continue conversation until resolved

### For Guest Users

#### Guest Side (Email-based)

**Features:**
- No login required
- Access via unique conversation link
- Can reply to admin messages
- View conversation history

**Limitations:**
- Cannot initiate new conversations
- Limited profile information
- Email-based notifications only

#### Admin Side (`/admin/messages`)

**Features:**
- Guest badge indicator
- Email address displayed
- Name from contact form
- Reference number tracking
- Same messaging interface

**Admin View:**
- See "Guest" user type badge
- Email instead of user profile
- Reference number for tracking
- Original contact form content as first message

### Message Interface

#### Message Display

**Admin Messages:**
- Blue background
- Right-aligned
- Admin avatar/icon
- Timestamp

**User/Guest Messages:**
- White background
- Left-aligned
- User avatar/icon (or email for guests)
- Timestamp

**Message Metadata:**
- Sender type (admin/user/guest)
- Read/unread status
- Delivery confirmation
- Date separators

#### Sending Messages

1. Type message in text box
2. Messages limited to reasonable character count
3. Press Enter or click Send
4. Message appears immediately (optimistic UI)
5. Confirmation when delivered
6. Recipient notified of new message

#### Real-time Features

- **Live Updates**: Messages appear instantly using Firestore listeners
- **Read Receipts**: See when messages are read
- **Typing Indicators**: Know when other person is typing
- **Auto-scroll**: Automatically scroll to latest message
- **Notifications**: Badge count updates in real-time

---

## Complete Workflow

### End-to-End Process

```
┌─────────────────────────────────────────────────────────────┐
│                   CONTACT FORM SUBMITTED                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │  User?  │
                    └────┬────┘
                         │
            ┌────────────┴────────────┐
            │                         │
       Authenticated               Guest
            │                         │
            ↓                         ↓
    ┌───────────────┐         ┌──────────────┐
    │  Auto-Create  │         │  Save to     │
    │ Conversation  │         │  CONTACTS    │
    └───────┬───────┘         └──────┬───────┘
            │                        │
            ↓                        ↓
    ┌───────────────┐         ┌──────────────┐
    │ Notify Admin  │         │  Admin       │
    │               │         │  Reviews     │
    └───────┬───────┘         └──────┬───────┘
            │                        │
            │                   ┌────┴────┐
            │                   │Convert? │
            │                   └────┬────┘
            │                        │
            │              ┌─────────┴────────┐
            │              │                  │
            │             Yes                No
            │              │                  │
            │              ↓                  ↓
            │      ┌──────────────┐   ┌─────────────┐
            │      │   Create     │   │Mark Status: │
            │      │Conversation  │   │Resolved/Spam│
            │      └──────┬───────┘   └─────────────┘
            │             │
            └─────────────┴─────────────┐
                                        │
                                        ↓
                              ┌──────────────────┐
                              │  Admin Messages  │
                              │  User in Thread  │
                              └────────┬─────────┘
                                       │
                                       ↓
                              ┌──────────────────┐
                              │ Back-and-Forth   │
                              │  Conversation    │
                              └────────┬─────────┘
                                       │
                                       ↓
                              ┌──────────────────┐
                              │  Issue Resolved  │
                              └────────┬─────────┘
                                       │
                                       ↓
                              ┌──────────────────┐
                              │ Mark as Resolved │
                              │ in Contacts Page │
                              └──────────────────┘
```

### Detailed Steps

#### 1. Contact Form Submission

**User Actions:**
- Fills out contact form at `/contact`
- Enters: Name, Email, Subject, Message
- Clicks "Send Message"

**System Actions:**
- Validates all inputs
- Sanitizes data for security
- Checks rate limiting (5 per hour per email)
- Logs IP address
- Generates reference number

#### 2. Data Storage

**Contact Record Created:**
```javascript
{
  name: "John Doe",
  email: "john.doe@example.com",
  subject: "Job Application Question",
  message: "I would like to know...",
  referenceNumber: "CNT-20251119-A1B2C3",
  status: "new",
  userId: "user-id-or-null",
  userType: "jobhunter" | "agency" | "guest",
  ipAddress: "192.168.1.1",
  createdAt: "2025-11-19T10:30:00Z",
  updatedAt: "2025-11-19T10:30:00Z"
}
```

#### 3. Automatic Processing (Authenticated Users Only)

**System Actions:**
- Finds first available admin
- Creates conversation in ADMIN_CONVERSATIONS
- Creates first message in conversation
- Creates notification for admin
- Updates contact with conversationId

**Admin Receives:**
- Notification: "New Contact Form Submission"
- Email/In-app notification (if configured)
- Badge count update

#### 4. Admin Review

**Admin Accesses:**
- `/admin/contacts` to see all submissions
- Reviews new submissions
- Checks user information
- Reads message content

**Admin Decides:**
- Convert to conversation (for guests)
- Mark in progress
- Mark as resolved
- Mark as spam

#### 5. Conversation

**Admin Opens Chat:**
- Clicks "View Chat" or "Messages"
- Sees full conversation history
- Reviews user's original inquiry

**Admin Responds:**
- Types response message
- Provides helpful information
- Asks follow-up questions
- Offers solutions

**User Replies:**
- Receives notification
- Opens conversation
- Reads admin response
- Sends follow-up

#### 6. Resolution

**Admin Actions:**
- Continues conversation until issue resolved
- Provides final solution/answer
- Returns to `/admin/contacts`
- Clicks "Mark Resolved"

**Status Updates:**
- Contact status: `resolved`
- Conversation: Marked as resolved
- Statistics updated
- Removed from "New" filter

#### 7. Post-Resolution

**Conversation Remains:**
- Full history preserved
- Can be reopened if needed
- Reference number for tracking
- Audit trail maintained

---

## Best Practices

### Response Time

**Recommended Guidelines:**
- ⏱️ **New Submissions**: Review within 24 hours
- ⏱️ **Urgent Inquiries**: Respond immediately
- ⏱️ **Follow-ups**: Reply within 4-8 hours during business hours
- ⏱️ **Set Expectations**: Inform users of response time

### Contact Management

**Daily Routine:**
1. Check `/admin/contacts` for new submissions
2. Review "New" filter first
3. Prioritize by urgency
4. Use reference numbers for tracking
5. Update statuses promptly

**Organization Tips:**
- Use search for specific inquiries
- Filter by status to focus work
- Keep reference numbers for external communication
- Regular cleanup of spam entries

### Conversation Handling

**Professional Communication:**
- ✅ Keep responses professional
- ✅ Be clear and concise
- ✅ Provide actionable information
- ✅ Include next steps
- ✅ Use proper grammar and spelling

**Message Structure:**
```
Hi [Name],

Thank you for reaching out regarding [subject].

[Address their question/concern]

[Provide solution or next steps]

[Set expectations if applicable]

Best regards,
[Your Admin Name]
Job Agent PH Team

Reference: CNT-20251119-A1B2C3
```

**Don'ts:**
- ❌ Don't leave messages unanswered
- ❌ Don't mark as resolved prematurely
- ❌ Don't forget to update status
- ❌ Don't provide incomplete information

### Status Management

**When to Use Each Status:**

| Status | When to Use | Actions |
|--------|-------------|---------|
| **New** | Just submitted, not reviewed | Review message, verify legitimacy |
| **In Progress** | Actively working on inquiry | Respond to messages, gather info |
| **Resolved** | Issue completely addressed | Confirm resolution with user first |
| **Spam** | Invalid or spam submission | Mark immediately, no response needed |

**Status Workflow:**
```
New → In Progress → Resolved
  ↓
 Spam (if invalid)
```

### Guest vs Authenticated Users

**For Guest Users:**
- ✅ Convert only if conversation needed
- ✅ Include reference number in responses
- ✅ Provide clear contact information
- ✅ Be extra clear (they have no profile)

**For Authenticated Users:**
- ✅ Check user profile for context
- ✅ View previous conversations
- ✅ Personalize responses
- ✅ Reference their job applications if relevant

### Data Privacy

**Important:**
- 🔒 Treat all contact information as confidential
- 🔒 Don't share user emails or personal data
- 🔒 IP addresses are for security logging only
- 🔒 Follow GDPR/privacy regulations
- 🔒 Don't discuss users with third parties

---

## Troubleshooting

### Contact Not Showing in Admin Panel

**Possible Causes:**
- Rate limit exceeded (5 per hour per email)
- Form validation failed
- Firestore security rules blocking access
- Network connectivity issue

**Solutions:**
1. Check browser console for errors
2. Verify Firestore rules allow admin read access
3. Check if user exceeded rate limit
4. Refresh the page
5. Try different browser

**How to Check:**
```javascript
// Browser Console
console.log("Contacts loaded:", contacts.length)
```

### Cannot Convert Contact to Chat

**Possible Causes:**
- User is already authenticated (has auto-conversation)
- Conversation already exists
- Missing admin permissions
- Firestore security rules

**Solutions:**
1. Check if "View Chat" button already shows
2. Verify admin permissions in user profile
3. Check browser console for errors
4. Ensure Firestore rules allow conversation creation

**Check Permissions:**
- Navigate to `/admin/users`
- Find your user account
- Verify role is "admin"
- Check `canSendMessages` permission

### Messages Not Sending

**Possible Causes:**
- No internet connection
- Conversation doesn't exist
- Message too long
- Firestore security rules blocking write

**Solutions:**
1. Check internet connection
2. Verify conversation exists
3. Shorten message if very long
4. Check browser console for errors
5. Refresh page and try again

### User Not Receiving Responses

**For Authenticated Users:**
- They should see messages in `/messages/admin`
- Check if notifications are enabled
- Verify conversation is linked correctly

**For Guest Users:**
- Email notifications need to be configured
- Provide conversation link manually
- Include reference number for tracking

**Admin Check:**
1. Verify message was sent successfully
2. Check message appears in conversation
3. Verify user has access to conversation
4. Check notification settings

### Statistics Not Updating

**Possible Causes:**
- Real-time listener disconnected
- Browser cache issue
- Firestore connection issue

**Solutions:**
1. Refresh the page (Ctrl+F5)
2. Clear browser cache
3. Check internet connection
4. Try different browser
5. Check Firestore status

### Search Not Working

**Possible Causes:**
- JavaScript error
- Special characters in search
- Case sensitivity issue (shouldn't happen)

**Solutions:**
1. Try simpler search terms
2. Use reference number for exact match
3. Check browser console
4. Refresh page
5. Try filter dropdown instead

---

## FAQ

### General Questions

**Q: What happens to guest conversations after conversion?**

A: They remain in the system permanently with full conversation history. The original contact form submission is also preserved and linked via the `conversationId` field. You can access both the original contact and the conversation anytime.

**Q: Can users reply to admin messages?**

A: **Yes.**
- **Authenticated users**: Can reply directly through their messages page at `/messages/admin/[conversationId]`
- **Guest users**: Receive email notifications (if configured) with a link to reply

**Q: How do I find a specific contact submission?**

A: Multiple ways:
1. **Reference Number**: Most reliable - paste full reference (e.g., `CNT-20251119-A1B2C3`)
2. **Email Address**: Search by user's email
3. **Name**: Search by contact name
4. **Subject**: Search by subject keywords
5. **Filter + Search**: Combine status filter with search

**Q: Can I delete contact submissions?**

A: The current system doesn't include a delete function for data retention and audit purposes. Instead:
- Mark as "Spam" to hide from main view
- Use spam filter to exclude from default view
- Contact system administrator for permanent deletion if necessary

**Q: What's the difference between CONTACTS and ADMIN_CONVERSATIONS?**

A:
- **CONTACTS**: Original form submission data (name, email, subject, message, reference number)
- **ADMIN_CONVERSATIONS**: The ongoing conversation thread with all messages
- They are linked: Contact has `conversationId`, Conversation has `contactRef`

**Q: Can multiple admins handle the same conversation?**

A: Currently, conversations are assigned to the first available admin when created. For multi-admin handling:
- All admins can see all conversations in `/admin/messages`
- Messages show which admin sent them
- For reassignment, system would need enhancement

### Technical Questions

**Q: Where are conversations stored?**

A: **Firestore Collections:**
- `contacts` - Original contact form submissions
- `adminConversations` - Conversation metadata
- `adminConversations/{id}/messages` - Individual messages (subcollection)

**Q: How does real-time messaging work?**

A: Uses Firestore's `onSnapshot` listeners:
- Automatically receives updates when data changes
- No manual refresh needed
- Updates appear instantly
- Disconnects and reconnects automatically

**Q: What security measures are in place?**

A: Multiple security layers:
- ✅ Rate limiting (5 submissions per hour per email)
- ✅ Input sanitization for XSS prevention
- ✅ Email validation
- ✅ Message length validation
- ✅ IP logging for abuse tracking
- ✅ Session-based authentication
- ✅ Firestore security rules
- ✅ Admin-only access to certain features

**Q: How are reference numbers generated?**

A: Format: `CNT-YYYYMMDD-XXXXXX`
- `CNT`: Contact prefix
- `YYYYMMDD`: Date (20251119)
- `XXXXXX`: Random 6-character alphanumeric (A1B2C3)

Example: `CNT-20251119-A1B2C3`

**Q: Can I customize the messaging interface?**

A: Yes, with developer access:
- UI components in `/components`
- Styling with Tailwind CSS
- Message format in messaging helpers
- Notification templates

### Workflow Questions

**Q: What if I accidentally mark something as spam?**

A: You can change it back:
1. Go to `/admin/contacts`
2. Select "Spam" from status filter
3. Find the submission
4. Click status button to change to "New" or "In Progress"

**Q: How do I reopen a resolved conversation?**

A: Simple process:
1. Navigate to `/admin/contacts`
2. Filter by "Resolved"
3. Find the contact
4. Click "Mark In Progress"
5. Continue conversation

**Q: What happens if I convert a contact that already has a conversation?**

A: The system prevents duplicate conversations:
- Button shows "View Chat" instead of "Convert to Chat"
- Contact record has `conversationId` field
- Only one conversation per contact submission

**Q: How do I know if a message has been read?**

A: Read indicators:
- Unread messages show badge/dot
- Read messages don't show indicator
- Conversation list shows unread count
- `read` field in message metadata

### Best Practices Questions

**Q: How quickly should I respond to contacts?**

A: Recommended response times:
- **New Submissions**: Within 24 hours
- **Urgent Issues**: Same day
- **Follow-up Messages**: Within 4-8 business hours
- **Complex Issues**: Set expectations upfront

**Q: Should I convert all guest contacts to conversations?**

A: **No, only when necessary:**

**Convert when:**
- Need back-and-forth discussion
- Requires requesting more information
- Complex issue needing ongoing support
- Want to maintain detailed history

**Don't convert when:**
- Simple question with one-time answer
- Spam or invalid submission
- Contact info is invalid
- Can be resolved immediately

**Q: How should I organize my workflow?**

A: Suggested daily routine:
1. **Morning**: Check new submissions
2. **Priority**: Handle urgent inquiries first
3. **Follow-up**: Respond to ongoing conversations
4. **Afternoon**: Convert relevant guest contacts
5. **End of day**: Update statuses, mark resolved
6. **Weekly**: Clean up spam, review metrics

**Q: What information should I include in responses?**

A: Professional response template:
- ✅ Greeting with user's name
- ✅ Acknowledge their inquiry
- ✅ Provide clear answer/solution
- ✅ Next steps if applicable
- ✅ Set expectations for timeline
- ✅ Professional closing
- ✅ Include reference number

---

## Technical Details

### File Locations

**Key Files:**

**Backend:**
- `app/api/contact/route.ts` - Contact form API endpoint
- `lib/firebase-admin.ts` - Firebase admin initialization
- `lib/validation.ts` - Input validation and sanitization

**Admin Pages:**
- `app/(authenticated)/admin/contacts/page.tsx` - Contact submissions list
- `app/(authenticated)/admin/messages/page.tsx` - Admin messages list
- `app/(authenticated)/admin/messages/[userId]/page.tsx` - Conversation view

**User Pages:**
- `app/contact/page.tsx` - Public contact form
- `app/(authenticated)/messages/admin/[conversationId]/page.tsx` - User conversation view

**Components:**
- `components/layout/AdminLayout.tsx` - Admin layout wrapper
- `components/layout/AdminSidebar.tsx` - Admin navigation (includes Contacts link)
- `components/ui/Card.tsx` - Card component
- `components/ui/Button.tsx` - Button component

**Configuration:**
- `lib/collections.ts` - Firestore collection names and paths
- `lib/messaging-helpers.ts` - Messaging utility functions

### Database Collections

#### CONTACTS Collection

**Purpose**: Stores all contact form submissions

**Path**: `contacts`

**Structure:**
```javascript
{
  id: "auto-generated-id",
  name: "John Doe",
  email: "john.doe@example.com",
  subject: "Job Application Question",
  message: "I would like to know about...",
  referenceNumber: "CNT-20251119-A1B2C3",
  status: "new" | "in_progress" | "resolved" | "spam",
  userId: "user-id" | null,
  userType: "jobhunter" | "agency" | "admin" | "guest",
  ipAddress: "192.168.1.1",
  conversationId: "conversation-id" | null, // Set when converted
  createdAt: "2025-11-19T10:30:00Z",
  updatedAt: "2025-11-19T10:30:00Z"
}
```

**Indexes Needed:**
```javascript
{
  collection: 'contacts',
  fields: [
    { field: 'status', order: 'ASCENDING' },
    { field: 'createdAt', order: 'DESCENDING' }
  ]
}
```

#### ADMIN_CONVERSATIONS Collection

**Purpose**: Manages admin-user conversation metadata

**Path**: `adminConversations`

**Structure:**
```javascript
{
  id: "auto-generated-id",
  adminId: "admin-user-id",
  userId: "user-id" | "guest_email_at_domain.com",
  userType: "jobhunter" | "agency" | "guest",
  guestEmail: "john.doe@example.com", // For guests only
  guestName: "John Doe", // For guests only
  contactRef: "contact-document-id",
  referenceNumber: "CNT-20251119-A1B2C3",
  lastMessage: {
    id: "message-id",
    content: "Preview of last message...",
    senderId: "user-id-or-admin-id",
    senderType: "admin" | "user" | "guest",
    createdAt: Timestamp,
    read: false
  },
  unreadCount: 1,
  unreadCount_admin: 1,
  unreadCount_user: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Subcollection: messages**

**Path**: `adminConversations/{conversationId}/messages`

**Structure:**
```javascript
{
  id: "auto-generated-id",
  content: "Message text content here",
  senderId: "user-id-or-admin-id",
  senderType: "admin" | "user" | "guest",
  createdAt: Timestamp,
  read: false,
  metadata: {
    isContactForm: true, // Only for first message
    referenceNumber: "CNT-20251119-A1B2C3",
    contactId: "contact-id"
  }
}
```

**Indexes Needed:**
```javascript
{
  collection: 'adminConversations',
  fields: [
    { field: 'adminId', order: 'ASCENDING' },
    { field: 'updatedAt', order: 'DESCENDING' }
  ]
}
```

### API Endpoints

#### POST /api/contact

**Purpose**: Handle contact form submissions

**Request Body:**
```javascript
{
  name: "John Doe",
  email: "john.doe@example.com",
  subject: "Question about jobs",
  message: "I would like to know..."
}
```

**Response (Success):**
```javascript
{
  success: true,
  message: "Your message has been sent to our admin team...",
  referenceNumber: "CNT-20251119-A1B2C3"
}
```

**Response (Error):**
```javascript
{
  error: "Error message here"
}
```

**Status Codes:**
- `200` - Success
- `400` - Validation error
- `429` - Rate limit exceeded
- `500` - Server error

**Rate Limiting:**
- 5 submissions per hour per email address
- Tracked in memory (resets on server restart)

### Security

**Input Validation:**
- Email format validation
- Message length (min 10, max 2000 chars)
- Name length (min 2 chars)
- Subject length (min 3 chars)
- HTML/XSS sanitization

**Rate Limiting:**
- 5 submissions per hour per email
- Returns time until reset in error message

**Authentication:**
- Session cookie based
- Firebase Auth verification
- Admin role required for admin pages

**IP Logging:**
- Logged for all submissions
- Used for abuse prevention
- Not displayed to users

---

## Support

### Getting Help

**For Technical Issues:**
- Contact system administrator
- Check browser console for errors
- Review Firestore security rules
- Check Firebase Auth configuration

**For Feature Requests:**
- Submit via internal feedback system
- Contact development team
- Provide detailed use case

**For Training:**
- Review this guide
- Practice with test submissions
- Ask questions in team chat
- Request demonstration session

### Permissions

**Required Admin Permissions:**
- `role: "admin"` - Admin role access
- `canSendMessages: true` - Send individual messages
- `canSendBulkMessages: true` - Send bulk messages (optional)

**How to Check Your Permissions:**
1. Navigate to `/admin/users`
2. Find your user account
3. View permissions in user details
4. Contact admin if permissions missing

### Updates

**This guide covers:**
- Version: 1.0
- Last Updated: November 19, 2025
- Compatible with: Firebase App Hosting deployment

**Changelog:**
- Initial release with contact form integration
- Real-time messaging support
- Guest user conversion feature
- Status management system

---

## Appendix

### Glossary

**Terms:**

- **Contact Submission**: Original form submission from contact page
- **Conversation**: Two-way messaging thread between admin and user
- **Reference Number**: Unique tracking ID for each submission (CNT-YYYYMMDD-XXXXXX)
- **Guest User**: User who submitted contact form without logging in
- **Authenticated User**: Logged-in user who submitted contact form
- **Conversion**: Process of creating a conversation from guest contact
- **Status**: Current state of contact (new, in_progress, resolved, spam)
- **Admin Conversation**: Conversation type specifically for admin-user communication
- **Real-time Updates**: Automatic updates using Firestore listeners

### Quick Reference

**Common Tasks:**

| Task | Steps |
|------|-------|
| View new contacts | Admin → Contacts → Filter: New |
| Convert guest to chat | Contacts → Find guest → Convert to Chat |
| Reply to message | Messages → Select conversation → Type → Send |
| Mark as resolved | Contacts → Find contact → Mark Resolved |
| Search by reference | Contacts → Search bar → Paste reference number |
| Check unread count | See badge on "Messages" in sidebar |
| Change status | Contacts → Find contact → Click status button |

**Keyboard Shortcuts:**

(If implemented in UI)
- `Ctrl/Cmd + K`: Quick search
- `Enter`: Send message
- `Esc`: Close modal

**Status Colors:**

- 🔵 Blue: New
- 🟡 Yellow: In Progress
- 🟢 Green: Resolved
- 🔴 Red: Spam

---

**End of Guide**

For questions or issues not covered in this guide, please contact your system administrator or development team.
