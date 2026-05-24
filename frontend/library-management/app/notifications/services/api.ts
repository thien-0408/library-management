import { apiFetch } from '@/lib/api';
import type { NotificationItem } from '../types';

export const notificationsService = {
  getMyNotifications: (unreadOnly = false) =>
    apiFetch<NotificationItem[]>('/api/notifications/me', {
      params: { unreadOnly },
    }),

  markAsRead: (id: string) =>
    apiFetch<void>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    }),
};
