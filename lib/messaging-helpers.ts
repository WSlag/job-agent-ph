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
 */
export async function getOrCreateConversation(
  jobId: string,
  jobHunterId: string,
  agencyId: string
): Promise<string> {
  try {
    // Check if conversation already exists
    const conversationsRef = collection(db, COLLECTIONS.CONVERSATIONS);
    const q = query(
      conversationsRef,
      where('jobId', '==', jobId),
      where('jobHunterId', '==', jobHunterId),
      where('agencyId', '==', agencyId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Conversation exists, return its ID
      return querySnapshot.docs[0].id;
    }

    // Create new conversation
    const newConversation = {
      jobId,
      jobHunterId,
      agencyId,
      unreadCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(conversationsRef, newConversation);
    return docRef.id;
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
    const messagesRef = collection(
      db,
      getCollectionPath.messages(conversationId)
    );

    const newMessage = {
      conversationId,
      senderId,
      senderType,
      content,
      attachments: attachments || [],
      read: false,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(messagesRef, newMessage);

    // Update conversation's lastMessage and updatedAt
    const conversationRef = doc(db, COLLECTIONS.CONVERSATIONS, conversationId);
    await updateDoc(conversationRef, {
      lastMessage: {
        id: docRef.id,
        ...newMessage,
        createdAt: new Date(), // Use Date for lastMessage preview
      },
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  conversationId: string,
  messageIds: string[]
): Promise<void> {
  try {
    const messagesRef = collection(
      db,
      getCollectionPath.messages(conversationId)
    );

    const updatePromises = messageIds.map((messageId) => {
      const messageRef = doc(messagesRef, messageId);
      return updateDoc(messageRef, { read: true });
    });

    await Promise.all(updatePromises);
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
  onUpdate: (conversations: Conversation[]) => void
): () => void {
  const conversationsRef = collection(db, COLLECTIONS.CONVERSATIONS);
  const field = userType === 'jobhunter' ? 'jobHunterId' : 'agencyId';

  const q = query(
    conversationsRef,
    where(field, '==', userId),
    orderBy('updatedAt', 'desc')
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
  onUpdate: (messages: Message[]) => void
): () => void {
  const messagesRef = collection(
    db,
    getCollectionPath.messages(conversationId)
  );

  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as Message;
      });
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

    for (const doc of snapshot.docs) {
      const conversationData = doc.data();
      const messagesRef = collection(
        db,
        getCollectionPath.messages(doc.id)
      );

      // Count unread messages from the other party
      const otherPartyField = userType === 'jobhunter' ? 'agencyId' : 'jobHunterId';
      const unreadQuery = query(
        messagesRef,
        where('read', '==', false),
        where('senderId', '==', conversationData[otherPartyField])
      );

      const unreadSnapshot = await getDocs(unreadQuery);
      totalUnread += unreadSnapshot.size;
    }

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
