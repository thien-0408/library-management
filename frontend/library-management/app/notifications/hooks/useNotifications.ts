import { useCallback, useEffect, useState } from 'react';
import type { NotificationItem } from '../types';
import { notificationsService } from '../services/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notificationsService.getMyNotifications(unreadOnly);
      setNotifications(data || []);
    } catch (err: unknown) {
      console.error('Fetch notifications error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [unreadOnly]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void fetchNotifications();
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      await notificationsService.markAsRead(id);
      await fetchNotifications();
      return true;
    } catch (err: unknown) {
      console.error('Mark notification as read error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update notification.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    notifications,
    unreadOnly,
    setUnreadOnly,
    isLoading,
    isUpdating,
    error,
    markAsRead,
    refreshData: fetchNotifications,
  };
};
