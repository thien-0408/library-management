'use client';

import React from 'react';
import Header from '@/components/header';
import Toast from '@/components/toast_notification';
import { useToast } from '@/hooks/useToast';
import { resolveAssetUrl } from '@/lib/api';
import { ListSkeleton } from '@/components/skeleton_loader';
import { useNotifications } from './hooks/useNotifications';

const formatDateTime = (value: string) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const urlPattern = /(https?:\/\/\S+|\/[\w./%?=&-]+)/g;

const renderMessage = (message: string) => {
  const parts = message.split(urlPattern);

  return parts.map((part, index) => {
    if (!urlPattern.test(part)) return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;

    const href = resolveAssetUrl(part) || part;

    return (
      <a key={`${part}-${index}`} href={href} target="_blank" rel="noreferrer" className="font-bold text-primary underline underline-offset-4 hover:brightness-110">
        Your access link here
      </a>
    );
  });
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadOnly,
    setUnreadOnly,
    isLoading,
    isUpdating,
    error,
    markAsRead,
    refreshData,
  } = useNotifications();
  const { toastConfig, showToast, hideToast } = useToast();

  const handleMarkAsRead = async (id: string) => {
    const success = await markAsRead(id);
    if (success) {
      showToast('Notification updated', 'The notification was marked as read.', 'success');
    } else {
      showToast('Update failed', 'The notification could not be marked as read.', 'error');
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <Header />
      <main className="app-shell-main app-shell-content page-shell px-6 md:px-8 xl:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight">Notifications</h1>
            <p className="mt-3 text-on-surface-variant text-lg">
              Review updates from book requests, overdue activity, and fine status changes.
            </p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm font-semibold shadow-sm">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(event) => setUnreadOnly(event.target.checked)}
              className="h-4 w-4"
            />
            Show unread only
          </label>
        </div>

        {error && (
          <div className="text-center py-5 bg-red-50 text-red-600 rounded-2xl mb-8 border border-red-200">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {error}
            <button onClick={refreshData} className="ml-4 underline text-sm">Retry</button>
          </div>
        )}

        {isLoading ? (
          <ListSkeleton count={5} />
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant bg-white p-10 text-center shadow-sm">
            <h2 className="font-headline text-2xl font-bold">No notifications found</h2>
            <p className="mt-3 text-on-surface-variant">
              {unreadOnly ? 'There are no unread notifications right now.' : 'You have no notifications yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`rounded-2xl border bg-white p-6 shadow-sm ${
                  notification.isRead ? 'border-outline-variant' : 'border-primary/40 bg-primary/5'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-surface-variant px-3 py-1 text-xs font-black uppercase tracking-wider text-on-surface-variant">
                        {notification.type}
                      </span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${notification.isRead ? 'text-on-surface-variant' : 'text-primary'}`}>
                        {notification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-headline text-2xl font-bold">{notification.title}</h2>
                      <p className="mt-2 text-on-surface-variant leading-relaxed">{renderMessage(notification.message)}</p>
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium">
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => void handleMarkAsRead(notification.id)}
                      className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />
    </div>
  );
}
