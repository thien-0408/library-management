export type NotificationType =
  | 'BORROW_REQUEST'
  | 'DUE_DATE'
  | 'OVERDUE'
  | 'ROOM_RESERVATION'
  | 'BOOK_AVAILABLE'
  | 'FINE'
  | 'OFFLINE_BORROW_CODE'
  | 'ONLINE_ACCESS'
  | 'ROOM_ACCESS_CODE'
  | string;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}
