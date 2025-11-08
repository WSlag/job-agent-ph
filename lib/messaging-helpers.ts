import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, getCollectionPath } from './collections';
import { Conversation, Message, UserType } from '@/types';

/**
 * Create or get existing conversation between job hunter and agency for a specific job
 * Uses deterministic document ID to prevent race condition duplicates
 */
export async function getOrCreateConversation(
  jobId: string,
  jobHunterId: string,
  agencyId: string
): Promise<string> {
  try {
    // Use composite key as document ID to ensure uniqueness
    const conversationKey = `${jobId}_${jobHunterId}_${agencyId}`;
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationKey);

    // Check if conversation already exists
    const conversationDoc = await getDoc(conversationRef);

    if (conversationDoc.exists()) {
      return conversationDoc.id;
    }

    // Create new conversation with setDoc for idempotency
    const newConversation = {
      jobId,
      jobHunterId,
      agencyId,
      unreadCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(conversationRef, newConversation);
    return conversationRef.id;
  } catch (error) {
    console.error('Error getting or creating conversation:', error);
    throw error;
  }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderType: UserType,
  content: string,
  attachments?: string[]
): Promise<string> {
  try {
    // Validate message content
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      throw new Error('Message content cannot be empty');
    }
    if (trimmedContent.length > 2000) {
      throw new Error('Message content cannot exceed 2000 characters');
    }

    // Sanitize content (basic sanitization)
    const sanitizedContent = trimmedContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .substring(0, 2000); // Ensure max length

    const messagesRef = collection(
      db,
      getCollectionPath.messages(conversationId)
    );

    const timestamp = serverTimestamp();
    const newMessage = {
      conversationId, // Added for consistency with Message type
      senderId,
      senderType, // Added senderType to message document
      content: sanitizedContent,
      timestamp,
      read: false,
    };

    const docRef = await addDoc(messagesRef, newMessage);

    // Get current conversation to calculate unreadCount
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    const conversationSnap = await getDoc(conversationRef);
    const conversationData = conversationSnap.data();

    // Increment unreadCount for the recipient
    const currentUnreadCount = conversationData?.unreadCount || 0;

    // Update conversation's lastMessage, unreadCount, and updatedAt
    await updateDoc(conversationRef, {
      lastMessage: {
        id: docRef.id,
        senderId,
        senderType,
        content: sanitizedContent.substring(0, 100), // Store preview in lastMessage
        createdAt: new Date(), // Use Date for immediate display (serverTimestamp would be null)
        read: false,
      },
      unreadCount: currentUnreadCount + 1, // Increment unread count
      updatedAt: timestamp,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Mark messages as read and reset unreadCount
 */
export async function markMessagesAsRead(
  conversationId: string,
  messageIds: string[]
): Promise<void> {
  try {
    if (messageIds.length === 0) return;

    const messagesRef = collection(
      db,
      getCollectionPath.messages(conversationId)
    );

    const updatePromises = messageIds.map((messageId) => {
      const messageRef = doc(messagesRef, messageId);
      return updateDoc(messageRef, { read: true });
    });

    await Promise.all(updatePromises);

    // Reset unreadCount in conversation
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(conversationRef, {
      unreadCount: 0,
    });

    // Update lastMessage read status if the last message was read
    const conversationSnap = await getDoc(conversationRef);
    const conversationData = conversationSnap.data();
    if (conversationData?.lastMessage && messageIds.includes(conversationData.lastMessage.id)) {
      await updateDoc(conversationRef, {
        'lastMessage.read': true,
      });
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}

/**
 * Get user's conversations (real-time listener)
 */
export function subscribeToConversations(
  userId: string,
  userType: UserType,
  onUpdate: (conversations: Conversation[]) => void,
  limitCount: number = 20 // Default pagination limit
): () => void {
  const conversationsRef = collection(db, COLLECTIONS.CONVERSATIONS);
  const field = userType === 'jobhunter' ? 'jobHunterId' : 'agencyId';

  const q = query(
    conversationsRef,
    where(field, '==', userId),
    orderBy('updatedAt', 'desc'),
    limit(limitCount) // Add pagination limit
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const conversations = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Conversation;
      });
      onUpdate(conversations);
    },
    (error) => {
      console.error('Error subscribing to conversations:', error);
    }
  );

  return unsubscribe;
}

/**
 * Get messages in a conversation (real-time listener)
 */
export function subscribeToMessages(
  conversationId: string,
  onUpdate: (messages: Message[]) => void,
  limitCount: number = 100 // Default limit for initial message load
): () => void {
  const messagesRef = collection(
    db,
    getCollectionPath.messages(conversationId)
  );

  // Get most recent messages first, then reverse for display
  const q = query(
    messagesRef,
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          conversationId,
          createdAt: data.timestamp?.toDate() || new Date(),
        } as Message;
      }).reverse(); // Reverse to show oldest first

      onUpdate(messages);
    },
    (error) => {
      console.error('Error subscribing to messages:', error);
    }
  );

  return unsubscribe;
}

/**
 * Get conversation details (including job and agency/hunter info)
 */
export async function getConversationDetails(conversationId: string) {
  try {
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    const conversationSnap = await getDoc(conversationRef);

    if (!conversationSnap.exists()) {
      throw new Error('Conversation not found');
    }

    const conversationData = conversationSnap.data();

    // Fetch job details
    const jobRef = doc(db, COLLECTIONS.JOBS, conversationData.jobId);
    const jobSnap = await getDoc(jobRef);

    // Fetch agency details
    const agencyRef = doc(db, COLLECTIONS.AGENCIES, conversationData.agencyId);
    const agencySnap = await getDoc(agencyRef);

    // Fetch job hunter details
    const jobHunterRef = doc(
      db,
      COLLECTIONS.JOB_HUNTERS,
      conversationData.jobHunterId
    );
    const jobHunterSnap = await getDoc(jobHunterRef);

    return {
      conversation: {
        id: conversationSnap.id,
        ...conversationData,
      },
      job: jobSnap.exists() ? { id: jobSnap.id, ...jobSnap.data() } : null,
      agency: agencySnap.exists()
        ? { id: agencySnap.id, ...agencySnap.data() }
        : null,
      jobHunter: jobHunterSnap.exists()
        ? { id: jobHunterSnap.id, ...jobHunterSnap.data() }
        : null,
    };
  } catch (error) {
    console.error('Error getting conversation details:', error);
    throw error;
  }
}

/**
 * Get total unread messages count for a user
 * Optimized to use conversation's unreadCount field instead of querying all messages
 */
export async function getUnreadMessagesCount(
  userId: string,
  userType: UserType
): Promise<number> {
  try {
    const conversationsRef = collection(db, COLLECTIONS.CONVERSATIONS);
    const field = userType === 'jobhunter' ? 'jobHunterId' : 'agencyId';

    const q = query(conversationsRef, where(field, '==', userId));

    const snapshot = await getDocs(q);

    let totalUnread = 0;

    // Sum up unreadCount from all conversations
    snapshot.docs.forEach((doc) => {
      const conversationData = doc.data();
      // Only count unread messages sent by the other party
      if (conversationData.lastMessage &&
          conversationData.lastMessage.senderId !== userId &&
          !conversationData.lastMessage.read) {
        totalUnread += conversationData.unreadCount || 0;
      }
    });

    return totalUnread;
  } catch (error) {
    console.error('Error getting unread messages count:', error);
    return 0;
  }
}

/**
 * Template messages for job hunters
 */
export const messageTemplates = {
  jobhunter: [
    "Hi! I'm interested in this position. Could you provide more details?",
    "Hello! I would like to apply for this position. What are the next steps?",
    "Hi! I have relevant experience for this role. When can we discuss further?",
    "Good day! I'm very interested in this opportunity. May I know more about the requirements?",
  ],
  agency: [
    "Thank you for your interest! We'd like to know more about your experience.",
    "Hello! We've reviewed your profile and would like to schedule an interview.",
    "Thank you for reaching out. Could you please share your updated resume?",
    "Hi! We're impressed with your profile. Let's discuss the opportunity further.",
  ],
};
