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
      <a key={`${part}-${index}`} href={href} target="_blank" rel="noreferrer" className="font-black text-red-700 underline underline-offset-4 hover:text-red-800">
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
    <div className="min-h-screen bg-[#fff7f7] font-body text-slate-950">
      <Header />
      <main className="app-shell-main app-shell-content page-shell mx-auto max-w-7xl px-5 pb-16 md:px-8 xl:px-10">
        <div className="relative mb-8 overflow-hidden rounded-[2.25rem] border border-red-100 bg-white px-6 py-8 shadow-[0_24px_80px_-48px_rgba(153,27,27,0.45)] sm:px-8 lg:px-10">
          <div className="absolute right-[-5rem] top-[-6rem] h-72 w-72 rounded-full bg-red-200/55 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-red-700">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              Activity center
            </div>
            <h1 className="mt-5 font-headline text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-6xl">Notifications</h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
              Review updates from book requests, overdue activity, and fine status changes.
            </p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-full border border-red-100 bg-red-50 px-5 py-3 text-sm font-black text-red-700 shadow-sm">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(event) => setUnreadOnly(event.target.checked)}
              className="h-4 w-4"
            />
            Show unread only
          </label>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-[1.5rem] border border-red-100 bg-white px-6 py-5 text-center font-bold text-red-700 shadow-sm">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {error}
            <button onClick={refreshData} className="ml-4 text-sm font-black underline">Retry</button>
          </div>
        )}

        {isLoading ? (
          <ListSkeleton count={5} />
        ) : notifications.length === 0 ? (
          <div className="rounded-[2rem] border border-red-100 bg-white p-10 text-center shadow-sm">
            <h2 className="font-headline text-2xl font-black text-slate-950">No notifications found</h2>
            <p className="mt-3 text-slate-500">
              {unreadOnly ? 'There are no unread notifications right now.' : 'You have no notifications yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`rounded-[1.75rem] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_55px_-38px_rgba(153,27,27,0.55)] ${
                  notification.isRead ? 'border-red-100 bg-white' : 'border-red-200 bg-red-50/70'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-500 ring-1 ring-red-100">
                        {notification.type}
                      </span>
                      <span className={`text-xs font-black uppercase tracking-wider ${notification.isRead ? 'text-slate-400' : 'text-red-700'}`}>
                        {notification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-headline text-2xl font-black text-slate-950">{notification.title}</h2>
                      <p className="mt-2 leading-relaxed text-slate-600">{renderMessage(notification.message)}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-400">
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => void handleMarkAsRead(notification.id)}
                      className="rounded-full bg-red-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-red-100 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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
