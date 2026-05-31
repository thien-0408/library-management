"use client";

import React from "react";
import Header from "@/components/header";
import Toast from "@/components/toast_notification";
import { useToast } from "@/hooks/useToast";
import { resolveAssetUrl } from "@/lib/api";
import { ListSkeleton } from "@/components/skeleton_loader";
import { useNotifications } from "./hooks/useNotifications";

const formatDateTime = (value: string) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const urlPattern = /(https?:\/\/\S+|\/[\w./%?=&-]+)/g;

const renderMessage = (message: string, type: string) => {
  if (type === "ROOM_ACCESS_CODE") return message;

  const parts = message.split(urlPattern);

  return parts.map((part, index) => {
    if (!urlPattern.test(part))
      return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;

    const href = resolveAssetUrl(part) || part;

    return (
      <a
        key={`${part}-${index}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-black text-primary underline underline-offset-4 hover:text-[#274c42]"
      >
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
      showToast(
        "Notification updated",
        "The notification was marked as read.",
        "success",
      );
    } else {
      showToast(
        "Update failed",
        "The notification could not be marked as read.",
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] font-body text-on-surface">
      <Header />
      <main className="app-shell-main app-shell-content page-shell mx-auto max-w-7xl px-5 pb-16 md:px-8 xl:px-10">
        {error && (
          <div className="mb-8 rounded-[1.5rem] border border-error-container bg-error-container px-6 py-5 text-center font-bold text-on-error-container shadow-sm">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {error}
            <button
              onClick={refreshData}
              className="ml-4 text-sm font-black underline"
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <ListSkeleton count={5} />
        ) : notifications.length === 0 ? (
          <div className="rounded-[2rem] border border-outline-variant bg-white p-10 text-center shadow-soft-card">
            <h2 className="font-headline text-2xl font-black text-on-surface">
              No notifications found
            </h2>
            <p className="mt-3 text-on-surface-variant">
              {unreadOnly
                ? "There are no unread notifications right now."
                : "You have no notifications yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`rounded-[1.75rem] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft-card ${
                  notification.isRead
                    ? "border-outline-variant bg-white"
                    : "border-primary/30 bg-primary-container/70"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-wider text-on-surface-variant ring-1 ring-outline-variant">
                        {notification.type}
                      </span>
                      <span
                        className={`text-xs font-black uppercase tracking-wider ${notification.isRead ? "text-on-surface-variant/70" : "text-primary"}`}
                      >
                        {notification.isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-headline text-2xl font-black text-on-surface">
                        {notification.title}
                      </h2>
                      <p className="mt-2 leading-relaxed text-on-surface-variant">
                        {renderMessage(notification.message, notification.type)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-on-surface-variant/70">
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => void handleMarkAsRead(notification.id)}
                      className="rounded-full bg-primary px-4 py-2.5 text-sm font-black text-on-primary shadow-lg shadow-primary/20 hover:bg-[#274c42] disabled:cursor-not-allowed disabled:opacity-50"
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
