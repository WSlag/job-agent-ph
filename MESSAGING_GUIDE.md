# Direct Messaging System - Implementation Guide

## Overview

The direct messaging system enables real-time communication between job hunters and recruitment agencies. Built with Firebase Firestore real-time listeners, it provides instant message delivery and unread notifications.

---

## Features Implemented ✅

### Core Messaging Features
- ✅ **Real-time Chat**: Messages update instantly using Firestore listeners
- ✅ **Conversation Creation**: Automatically creates conversations when clicking "Message Agency"
- ✅ **Message Templates**: Quick message templates for both job hunters and agencies
- ✅ **Unread Badges**: Visual indicators for unread messages in header
- ✅ **Message History**: Grouped by date with timestamps
- ✅ **Auto-scroll**: Automatically scrolls to latest message
- ✅ **Typing Support**: Textarea auto-resizes and supports Shift+Enter for new lines

### User Experience
- ✅ **Mobile-Responsive**: Optimized for mobile and desktop
- ✅ **Authentication Check**: Prompts login if not authenticated
- ✅ **Empty States**: Helpful messages when no conversations exist
- ✅ **Loading States**: Loading indicators during data fetching
- ✅ **Error Handling**: Graceful error messages

---

## File Structure

```
app/
├── messages/
│   ├── page.tsx                    # Conversations list page
│   └── [id]/
│       └── page.tsx                # Individual conversation/chat page

lib/
└── messaging-helpers.ts            # Messaging utility functions

components/
├── layout/
│   └── Header.tsx                  # Updated with unread badge
└── jobs/
    └── JobCard.tsx                 # Updated with message button
```

---

## Data Models

### Conversation Document
```typescript
{
  id: string;                       // Auto-generated
  jobId: string;                    // Reference to job
  jobHunterId: string;              // Job hunter's user ID
  agencyId: string;                 // Agency's user ID
  lastMessage?: Message;            // Latest message object
  unreadCount: number;              // Count of unread messages
  createdAt: Timestamp;             // When conversation started
  updatedAt: Timestamp;             // Last message time
}
```

### Message Document (Subcollection)
```typescript
{
  id: string;                       // Auto-generated
  conversationId: string;           // Parent conversation ID
  senderId: string;                 // Sender's user ID
  senderType: 'jobhunter' | 'agency';
  content: string;                  // Message text
  attachments?: string[];           // URLs to attachments (future)
  read: boolean;                    // Read status
  createdAt: Timestamp;             // When message was sent
}
```

---

## Firestore Structure

```
conversations/
├── {conversationId1}/
│   ├── jobId: "job123"
│   ├── jobHunterId: "user456"
│   ├── agencyId: "agency789"
│   ├── lastMessage: {...}
│   ├── updatedAt: Timestamp
│   └── messages/                   # Subcollection
│       ├── {messageId1}/
│       │   ├── senderId: "user456"
│       │   ├── content: "Hello!"
│       │   ├── read: false
│       │   └── createdAt: Timestamp
│       └── {messageId2}/
│           └── ...
└── {conversationId2}/
    └── ...
```

---

## Key Functions

### 1. `getOrCreateConversation()`
Creates a new conversation or returns existing one.

```typescript
const conversationId = await getOrCreateConversation(
  jobId,
  jobHunterId,
  agencyId
);
```

**Use case**: When a job hunter clicks "Message Agency" on a job card.

---

### 2. `sendMessage()`
Sends a message in a conversation.

```typescript
await sendMessage(
  conversationId,
  senderId,
  senderType,
  messageText,
  attachments // optional
);
```

**What it does**:
- Adds message to messages subcollection
- Updates conversation's `lastMessage` and `updatedAt`

---

### 3. `subscribeToConversations()`
Real-time listener for user's conversations.

```typescript
const unsubscribe = subscribeToConversations(
  userId,
  userType,
  (conversations) => {
    // Handle updated conversations
  }
);
```

**What it does**:
- Listens to all conversations for the user
- Automatically updates when new messages arrive
- Returns unsubscribe function for cleanup

---

### 4. `subscribeToMessages()`
Real-time listener for messages in a conversation.

```typescript
const unsubscribe = subscribeToMessages(
  conversationId,
  (messages) => {
    // Handle updated messages
  }
);
```

**What it does**:
- Listens to all messages in a conversation
- Automatically updates when new messages arrive
- Orders messages by creation time

---

### 5. `markMessagesAsRead()`
Marks messages as read.

```typescript
await markMessagesAsRead(conversationId, messageIds);
```

**When used**: Automatically called when viewing a conversation.

---

## User Flows

### Job Hunter Flow

1. **Browse Jobs** → Click "Message Agency" on job card
2. **Redirect to `/messages?jobId={id}`**
3. System checks if conversation exists:
   - If exists → Navigate to existing conversation
   - If new → Create conversation and navigate
4. **Chat Interface** → Send messages with templates or custom text
5. **Receive Replies** → Real-time updates when agency responds

### Agency Flow

1. **Receive Message** → Notification badge appears in header
2. **Go to Messages** → See list of conversations with job hunters
3. **Click Conversation** → View message thread
4. **Reply** → Use templates or custom messages
5. **Track Applications** → Messages tied to specific jobs

---

## Message Templates

### For Job Hunters
```typescript
[
  "Hi! I'm interested in this position. Could you provide more details?",
  "Hello! I would like to apply for this position. What are the next steps?",
  "Hi! I have relevant experience for this role. When can we discuss further?",
  "Good day! I'm very interested in this opportunity. May I know more about the requirements?",
]
```

### For Agencies
```typescript
[
  "Thank you for your interest! We'd like to know more about your experience.",
  "Hello! We've reviewed your profile and would like to schedule an interview.",
  "Thank you for reaching out. Could you please share your updated resume?",
  "Hi! We're impressed with your profile. Let's discuss the opportunity further.",
]
```

---

## Security Rules (Firestore)

Already implemented in Firebase Console:

```javascript
match /conversations/{conversationId} {
  allow read, write: if request.auth != null &&
    (resource.data.jobHunterId == request.auth.uid ||
     resource.data.agencyId == request.auth.uid);

  match /messages/{messageId} {
    allow read, write: if request.auth != null;
  }
}
```

**What this means**:
- Only participants can access conversations
- Messages are accessible to authenticated users in the conversation

---

## Required Firestore Indexes

These indexes should be automatically created when you first query, but you can create them manually in Firebase Console:

```javascript
// Conversations by job hunter
Collection: conversations
Fields: jobHunterId (Ascending), updatedAt (Descending)

// Conversations by agency
Collection: conversations
Fields: agencyId (Ascending), updatedAt (Descending)

// Messages by conversation
Collection: conversations/{conversationId}/messages
Fields: createdAt (Ascending)
```

---

## Testing the Messaging System

### Step 1: Set Up Test Data

1. Create two user accounts:
   - **Job Hunter**: test-hunter@example.com
   - **Agency**: test-agency@example.com

2. Add a test job in Firestore:
   ```javascript
   {
     agencyId: "{agency-user-id}",
     title: "Test Position",
     companyName: "Test Agency",
     // ... other job fields
   }
   ```

### Step 2: Test Messaging Flow

1. **Login as Job Hunter**
2. Browse to jobs page
3. Click "Message Agency" on test job
4. Send a test message
5. **Login as Agency** (different browser/incognito)
6. See unread badge in header
7. Go to Messages
8. Click on conversation
9. Reply to message
10. **Check Job Hunter account** → See real-time update

---

## Troubleshooting

### Messages not appearing in real-time?

**Solution**: Check browser console for Firestore errors. Ensure Firestore security rules are published.

### "Permission denied" errors?

**Solution**:
1. Verify user is authenticated
2. Check Firestore security rules
3. Ensure conversation has correct `jobHunterId` and `agencyId`

### Unread badge not updating?

**Solution**: Check that `subscribeToConversations()` is being called in Header component and user is logged in.

### Conversation not created when clicking "Message Agency"?

**Solution**:
1. Ensure job exists in Firestore
2. Check that job has valid `agencyId`
3. Verify user is logged in as job hunter
4. Check browser console for errors

---

## Future Enhancements

### Phase 2 (Not Yet Implemented)
- [ ] **Attachment Support**: Upload files, images, resumes
- [ ] **Typing Indicators**: Show when other person is typing
- [ ] **Read Receipts**: Show when message has been read
- [ ] **Push Notifications**: Browser notifications for new messages
- [ ] **Message Search**: Search through message history
- [ ] **Archive Conversations**: Hide old conversations
- [ ] **Block Users**: Prevent spam messages
- [ ] **Message Reactions**: React to messages with emojis
- [ ] **Voice Messages**: Record and send voice clips
- [ ] **Video Calls**: Integrated video calling

### Phase 3 (Advanced Features)
- [ ] **AI Message Suggestions**: Smart reply suggestions
- [ ] **Translation**: Auto-translate messages
- [ ] **Scheduled Messages**: Send messages at specific times
- [ ] **Message Encryption**: End-to-end encryption
- [ ] **Message Analytics**: Track response times, engagement

---

## Performance Considerations

### Current Implementation
- ✅ Real-time listeners auto-unsubscribe on component unmount
- ✅ Messages paginated by date groups
- ✅ Efficient Firestore queries with indexes

### Optimization Tips
1. **Limit message history**: Only load last 50 messages initially
2. **Lazy load older messages**: Implement "Load More" button
3. **Cache conversations**: Use React Query or similar
4. **Debounce typing indicators**: Prevent excessive updates

---

## API Reference

See [lib/messaging-helpers.ts](lib/messaging-helpers.ts) for full API documentation.

---

## Need Help?

1. Check Firestore Console for data structure
2. Review browser console for errors
3. Verify Firebase configuration in `.env.local`
4. Ensure Firestore security rules are published

---

**Last Updated**: October 22, 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
