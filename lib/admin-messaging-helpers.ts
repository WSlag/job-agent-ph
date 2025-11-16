import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  updateDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  increment,
  arrayUnion,
} from 'firebase/firestore';
import { getDbInstance } from './firebase';
import {
  AdminMessage,
  AdminConversation,
  AdminMessageThread,
  RecipientFilters,
  RecipientType,
  AdminMessageStatus,
  AdminMessageType,
  JobHunter,
  Agency,
} from '@/types';
import { logAdminAction } from './audit-helpers';

/**
 * Send a bulk message to multiple recipients
 */
export async function sendBulkMessage(
  adminId: string,
  adminName: string,
  recipientIds: string[],
  subject: string,
  content: string,
  recipientType: RecipientType,
  filters?: RecipientFilters
): Promise<string> {
  if (!adminId || !content || recipientIds.length === 0) {
    throw new Error('Admin ID, content, and recipients are required');
  }

  const db = getDbInstance();
  const batch = writeBatch(db);

  try {
    // Create the bulk message document
    const adminMessageRef = doc(collection(db, 'adminMessages'));
    const messageData: Partial<AdminMessage> = {
      adminId,
      adminName,
      messageType: 'bulk',
      subject,
      content,
      recipientType,
      recipientIds,
      status: 'sending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
      readBy: {},
      filters,
    };

    batch.set(adminMessageRef, messageData);

    // Create individual notifications for each recipient
    recipientIds.forEach(recipientId => {
      const notificationRef = doc(collection(db, 'notifications'));
      batch.set(notificationRef, {
        userId: recipientId,
        type: 'system',
        title: subject || 'New Message from Admin',
        message: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        read: false,
        createdAt: serverTimestamp(),
        actionUrl: `/messages/admin/${adminMessageRef.id}`,
      });
    });

    // Commit the batch
    await batch.commit();

    // Update status to sent
    await updateDoc(adminMessageRef, {
      status: 'sent' as AdminMessageStatus,
      sentAt: serverTimestamp(),
      deliveredCount: recipientIds.length,
    });

    // Log the action
    await logAdminAction({
      adminId,
      adminName,
      action: 'message_sent_bulk',
      resourceType: 'message',
      resourceId: adminMessageRef.id,
      details: {
        recipientCount: recipientIds.length,
        recipientType,
        subject,
      }
    });

    return adminMessageRef.id;
  } catch (error) {
    console.error('Error sending bulk message:', error);
    throw error;
  }
}

/**
 * Send an individual message to a specific user
 */
export async function sendIndividualMessage(
  adminId: string,
  adminName: string,
  userId: string,
  userType: 'jobhunter' | 'agency',
  content: string
): Promise<string> {
  if (!adminId || !userId || !content) {
    throw new Error('Admin ID, user ID, and content are required');
  }

  const db = getDbInstance();

  try {
    // Check if conversation exists
    const conversationsRef = collection(db, 'adminConversations');
    const q = query(
      conversationsRef,
      where('adminId', '==', adminId),
      where('userId', '==', userId),
      limit(1)
    );
    const snapshot = await getDocs(q);

    let conversationId: string;
    let conversationRef: any;

    if (snapshot.empty) {
      // Create new conversation first (not in batch to avoid permission issues)
      conversationRef = doc(conversationsRef);
      conversationId = conversationRef.id;

      const conversationData: Partial<AdminConversation> = {
        adminId,
        userId,
        userType,
        unreadCount: 1,
        unreadCount_admin: 0,
        unreadCount_user: 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await setDoc(conversationRef, conversationData);
    } else {
      // Use existing conversation
      conversationRef = snapshot.docs[0].ref;
      conversationId = snapshot.docs[0].id;
    }

    // Now create message and notification in a batch
    const batch = writeBatch(db);

    // Add message to conversation
    const messageRef = doc(collection(db, `adminConversations/${conversationId}/messages`));

    const lastMessageData = {
      id: messageRef.id,
      content,
      senderId: adminId,
      senderType: 'admin',
      createdAt: Timestamp.now(),
      read: false,
    };

    const messageData: Partial<AdminMessageThread> = {
      conversationId,
      senderId: adminId,
      senderType: 'admin',
      content,
      timestamp: Timestamp.now(),
      read: false,
    };

    batch.set(messageRef, messageData);

    // Update conversation with last message and unread count
    batch.update(conversationRef, {
      unreadCount_user: increment(1),
      lastMessage: lastMessageData,
      updatedAt: serverTimestamp(),
    });

    // Create notification for recipient
    const notificationRef = doc(collection(db, 'notifications'));
    batch.set(notificationRef, {
      userId,
      type: 'message',
      title: `New message from ${adminName}`,
      message: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
      read: false,
      createdAt: serverTimestamp(),
      actionUrl: `/messages/admin/${conversationId}`,
    });

    // Commit the batch
    await batch.commit();

    // Log the action
    await logAdminAction({
      adminId,
      adminName,
      action: 'message_sent_individual',
      resourceType: 'message',
      resourceId: conversationId,
      details: {
        recipientId: userId,
        recipientType: userType,
      }
    });

    return conversationId;
  } catch (error) {
    console.error('Error sending individual message:', error);
    throw error;
  }
}

/**
 * Get recipients based on filters
 */
export async function getFilteredRecipients(
  filters: RecipientFilters
): Promise<{ id: string; name: string; email: string; type: string }[]> {
  const db = getDbInstance();
  const recipients: { id: string; name: string; email: string; type: string }[] = [];

  try {
    // Get job hunters if needed
    if (filters.userType === 'jobhunter' || filters.userType === 'all') {
      const jobHuntersRef = collection(db, 'jobHunters');
      let q = query(jobHuntersRef);

      // Apply filters
      if (filters.location && filters.location.length > 0) {
        q = query(q, where('location', 'in', filters.location));
      }
      if (filters.skills && filters.skills.length > 0) {
        q = query(q, where('skills', 'array-contains-any', filters.skills));
      }
      if (filters.experienceMin !== undefined) {
        q = query(q, where('experience', '>=', filters.experienceMin));
      }
      if (filters.experienceMax !== undefined) {
        q = query(q, where('experience', '<=', filters.experienceMax));
      }

      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data() as JobHunter;
        recipients.push({
          id: doc.id,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          type: 'jobhunter',
        });
      });
    }

    // Get agencies if needed
    if (filters.userType === 'agency' || filters.userType === 'all') {
      const agenciesRef = collection(db, 'agencies');
      let q = query(agenciesRef);

      // Apply filters
      if (filters.verified !== undefined) {
        q = query(q, where('verified', '==', filters.verified));
      }
      if (filters.specializations && filters.specializations.length > 0) {
        q = query(q, where('specializations', 'array-contains-any', filters.specializations));
      }

      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data() as Agency;
        recipients.push({
          id: doc.id,
          name: data.companyName,
          email: data.email,
          type: 'agency',
        });
      });
    }

    // Apply activity status filter if needed
    if (filters.activityStatus && filters.activityStatus !== 'all') {
      // This would require checking user activity logs
      // For now, we'll return all users
      // TODO: Implement activity status filtering
    }

    // Apply registration date filters if needed
    if (filters.registrationDateFrom || filters.registrationDateTo) {
      // Filter by creation date
      // TODO: Implement date filtering
    }

    return recipients;
  } catch (error) {
    console.error('Error getting filtered recipients:', error);
    throw error;
  }
}

/**
 * Get admin conversations
 */
export async function getAdminConversations(
  adminId: string,
  limitCount: number = 20,
  lastDoc?: any
): Promise<{ conversations: AdminConversation[]; lastDoc: any }> {
  const db = getDbInstance();
  const conversationsRef = collection(db, 'adminConversations');

  let q = query(
    conversationsRef,
    where('adminId', '==', adminId),
    orderBy('updatedAt', 'desc'),
    limit(limitCount)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const conversations: AdminConversation[] = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();

    // Get user details
    const userCollection = data.userType === 'jobhunter' ? 'jobHunters' : 'agencies';
    const userDoc = await getDoc(doc(db, userCollection, data.userId));
    const userData = userDoc.data();

    conversations.push({
      id: docSnap.id,
      ...data,
      userName: data.userType === 'jobhunter'
        ? `${userData?.firstName} ${userData?.lastName}`
        : userData?.companyName,
    } as AdminConversation);
  }

  return {
    conversations,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
}

/**
 * Get messages in an admin conversation
 */
export async function getAdminConversationMessages(
  conversationId: string,
  limitCount: number = 50,
  lastDoc?: any
): Promise<{ messages: AdminMessageThread[]; lastDoc: any }> {
  const db = getDbInstance();
  const messagesRef = collection(db, `adminConversations/${conversationId}/messages`);

  let q = query(
    messagesRef,
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const messages: AdminMessageThread[] = [];

  snapshot.docs.forEach((doc) => {
    messages.push({
      id: doc.id,
      ...doc.data(),
    } as AdminMessageThread);
  });

  return {
    messages: messages.reverse(), // Reverse to show oldest first
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
}

/**
 * Mark messages as read in an admin conversation
 */
export async function markAdminMessagesAsRead(
  conversationId: string,
  userId: string,
  isAdmin: boolean
): Promise<void> {
  const db = getDbInstance();
  const batch = writeBatch(db);

  try {
    // Update conversation unread count
    const conversationRef = doc(db, 'adminConversations', conversationId);
    const unreadField = isAdmin ? 'unreadCount_admin' : 'unreadCount_user';

    batch.update(conversationRef, {
      [unreadField]: 0,
    });

    // Mark messages as read
    const messagesRef = collection(db, `adminConversations/${conversationId}/messages`);
    const q = query(
      messagesRef,
      where('senderType', '==', isAdmin ? 'user' : 'admin'),
      where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        read: true,
        readAt: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}

/**
 * Subscribe to admin conversations with real-time updates
 */
export function subscribeToAdminConversations(
  adminId: string,
  callback: (conversations: AdminConversation[]) => void
): () => void {
  const db = getDbInstance();
  const conversationsRef = collection(db, 'adminConversations');

  const q = query(
    conversationsRef,
    where('adminId', '==', adminId),
    orderBy('updatedAt', 'desc'),
    limit(50)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const conversations: AdminConversation[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // Get user details
      const userCollection = data.userType === 'jobhunter' ? 'jobHunters' : 'agencies';
      const userDoc = await getDoc(doc(db, userCollection, data.userId));
      const userData = userDoc.data();

      conversations.push({
        id: docSnap.id,
        ...data,
        userName: data.userType === 'jobhunter'
          ? `${userData?.firstName} ${userData?.lastName}`
          : userData?.companyName,
      } as AdminConversation);
    }

    callback(conversations);
  });

  return unsubscribe;
}

/**
 * Subscribe to messages in an admin conversation with real-time updates
 */
export function subscribeToAdminMessages(
  conversationId: string,
  callback: (messages: AdminMessageThread[]) => void
): () => void {
  const db = getDbInstance();
  const messagesRef = collection(db, `adminConversations/${conversationId}/messages`);

  const q = query(
    messagesRef,
    orderBy('timestamp', 'asc'),
    limit(100)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages: AdminMessageThread[] = [];

    snapshot.docs.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      } as AdminMessageThread);
    });

    callback(messages);
  });

  return unsubscribe;
}

/**
 * Get bulk messages sent by admin
 */
export async function getAdminBulkMessages(
  adminId: string,
  limitCount: number = 20,
  lastDoc?: any
): Promise<{ messages: AdminMessage[]; lastDoc: any }> {
  const db = getDbInstance();
  const messagesRef = collection(db, 'adminMessages');

  let q = query(
    messagesRef,
    where('adminId', '==', adminId),
    where('messageType', '==', 'bulk'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const messages: AdminMessage[] = [];

  snapshot.docs.forEach((doc) => {
    messages.push({
      id: doc.id,
      ...doc.data(),
    } as AdminMessage);
  });

  return {
    messages,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
}

/**
 * Mark a bulk message as read by a user
 */
export async function markBulkMessageAsRead(
  messageId: string,
  userId: string
): Promise<void> {
  const db = getDbInstance();
  const messageRef = doc(db, 'adminMessages', messageId);

  try {
    await updateDoc(messageRef, {
      [`readBy.${userId}`]: serverTimestamp(),
      readCount: increment(1),
    });
  } catch (error) {
    console.error('Error marking bulk message as read:', error);
    throw error;
  }
}

/**
 * Get statistics for admin messaging
 */
export async function getAdminMessageStats(adminId: string): Promise<{
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalConversations: number;
}> {
  const db = getDbInstance();

  try {
    // Get bulk message stats
    const bulkMessagesRef = collection(db, 'adminMessages');
    const bulkQ = query(
      bulkMessagesRef,
      where('adminId', '==', adminId),
      where('messageType', '==', 'bulk')
    );
    const bulkSnapshot = await getDocs(bulkQ);

    let totalSent = 0;
    let totalDelivered = 0;
    let totalRead = 0;

    bulkSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      totalSent += data.recipientIds?.length || 0;
      totalDelivered += data.deliveredCount || 0;
      totalRead += data.readCount || 0;
    });

    // Get conversation count
    const conversationsRef = collection(db, 'adminConversations');
    const convQ = query(conversationsRef, where('adminId', '==', adminId));
    const convSnapshot = await getDocs(convQ);

    return {
      totalSent,
      totalDelivered,
      totalRead,
      totalConversations: convSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting admin message stats:', error);
    throw error;
  }
}