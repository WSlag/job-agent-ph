export type NotificationType =
  | 'job_match'
  | 'message'
  | 'application_update'
  | 'interview'
  | 'document'
  | 'system';

export interface Notification {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  actionUrl?: string;
  updatedAt?: FirebaseFirestore.Timestamp;
}

export interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
}

export interface EmailNotificationData extends NotificationData {
  recipientEmail: string;
  recipientName: string;
}
