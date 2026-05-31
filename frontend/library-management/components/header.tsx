"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/app/login/services/auth";
import { getAuthSession, isAdminSession, resolveAssetUrl } from "@/lib/api";
import { notificationsService } from "@/app/notifications/services/api";
import type { NotificationItem } from "@/app/notifications/types";
import ConfirmModal from "@/components/confirm_modal";

interface HeaderProps {
  role?: "admin" | "user";
}

const normalizeRole = (role?: string | null): "admin" | "user" => {
  return role?.toLowerCase() === "admin" ? "admin" : "user";
};

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
    if (!urlPattern.test(part)) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    const href = resolveAssetUrl(part) || part;

    return (
      <a
        key={`${part}-${index}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-[#23493d] underline underline-offset-4"
      >
        Your access link here
      </a>
    );
  });
};

export default function Header({ role }: HeaderProps) {
  const pathname = usePathname();
  const [resolvedRole, setResolvedRole] = useState<"admin" | "user">(
    normalizeRole(role),
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [sessionName, setSessionName] = useState("Reader");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [isNotificationUpdating, setIsNotificationUpdating] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(
    null,
  );
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    const hasToken = Boolean(session?.accessToken);
    setIsLoggedIn(hasToken);
    setResolvedRole(
      role ? normalizeRole(role) : isAdminSession() ? "admin" : "user",
    );
    setSessionName(session?.username || session?.email || "Reader");
  }, [role]);

  useEffect(() => {
    setIsOpen(false);
    setIsNotificationOpen(false);
  }, [pathname]);

  const fetchUnreadCount = async () => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    try {
      const unreadNotifications =
        await notificationsService.getMyNotifications(true);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Fetch unread notification count error:", error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    void fetchUnreadCount();
    const intervalId = window.setInterval(fetchUnreadCount, 30000);

    return () => window.clearInterval(intervalId);
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    if (!isLoggedIn) {
      setNotifications([]);
      return;
    }

    setIsNotificationLoading(true);
    setNotificationError(null);

    try {
      const data = await notificationsService.getMyNotifications(false);
      setNotifications(data || []);
    } catch (error) {
      console.error("Fetch notifications error:", error);
      setNotificationError(
        error instanceof Error
          ? error.message
          : "Failed to load notifications.",
      );
    } finally {
      setIsNotificationLoading(false);
    }
  };

  useEffect(() => {
    if (!isNotificationOpen) return;
    void fetchNotifications();
  }, [isNotificationOpen]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!popupRef.current?.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isNotificationOpen]);

  const handleMarkAsRead = async (id: string) => {
    setIsNotificationUpdating(true);
    setNotificationError(null);

    try {
      await notificationsService.markAsRead(id);
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    } catch (error) {
      console.error("Mark notification as read error:", error);
      setNotificationError(
        error instanceof Error
          ? error.message
          : "Failed to update notification.",
      );
    } finally {
      setIsNotificationUpdating(false);
    }
  };

  const links = useMemo(() => {
    const baseLinks = [
      { href: "/catalog", label: "Discover", icon: "fa-house" },
      { href: "/roomReservations", label: "Rooms", icon: "fa-door-open" },
      { href: "/reading-lists", label: "Reading Lists", icon: "fa-list" },
      { href: "/leaderboard", label: "Leaderboard", icon: "fa-trophy" },
      { href: "/notifications", label: "Notifications", icon: "fa-bell" },
      { href: "/fines", label: "Fines", icon: "fa-file-invoice-dollar" },
    ];

    if (resolvedRole === "admin") {
      baseLinks.push(
        {
          href: "/adminInventory",
          label: "Inventory",
          icon: "fa-boxes-stacked",
        },
        { href: "/adminUsers", label: "Users", icon: "fa-users" },
        { href: "/roomViewer", label: "Room Viewer", icon: "fa-building" },
        { href: "/timeSlots", label: "Time Slots", icon: "fa-clock" },
      );
    }

    return baseLinks;
  }, [resolvedRole]);

  const sessionInitials = useMemo(() => {
    const source = sessionName || "Reader";
    const parts = source
      .replace(/[@._-]+/g, " ")
      .split(" ")
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2);

    return parts.map((part) => part[0]?.toUpperCase()).join("") || "R";
  }, [sessionName]);

  const linkClassName = (href: string) => {
    const isActive = pathname === href;
    return `group flex items-center gap-4 rounded-[1.25rem] px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-[#fff7ef] text-[#1f2b24]"
        : "text-[#7f7a70] hover:bg-[#faf7f1] hover:text-[#1f2b24]"
    }`;
  };

  const sidebarContent = (
    <>
      <div className="flex items-start justify-between lg:block">
        <div>
          <Link href="/catalog" className="block">
            <span className="block text-[1.7rem] font-black uppercase tracking-[0.08em] text-[#151515]">
              THE BOOKS
            </span>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-full border border-[#ece7db] bg-white px-3 py-2 text-[#7f7a70] transition hover:bg-[#faf7f1] hover:text-[#1f2b24] lg:hidden"
          aria-label="Close navigation"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="mt-8">
        <p className="px-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#bbb3a6]">
          Menu
        </p>
        <nav className="mt-3 flex flex-col gap-1.5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClassName(link.href)}
            >
              <span
                className={`relative grid h-10 w-10 place-items-center rounded-full text-center transition ${
                  pathname === link.href
                    ? "bg-[#ff7d57] text-white"
                    : "bg-[#f6f6f6] text-[#8b8579] group-hover:bg-[#f1ede4] group-hover:text-[#1f2b24]"
                }`}
              >
                <i className={`fa-solid ${link.icon}`}></i>
                {link.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-[#1f2b24] px-1 py-0.5 text-[9px] font-black leading-none text-white ring-2 ring-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-6">
        <div className="border-t border-[#efeadf] pt-6">
          <nav className="flex flex-col gap-1.5 text-sm font-semibold text-[#7f7a70]">
            <Link
              href="/profile"
              className="flex items-center gap-4 rounded-[1.25rem] px-3.5 py-2.5 text-left transition hover:bg-[#faf7f1] hover:text-[#1f2b24]"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f6f6f6] text-[#8b8579]">
                <i className="fa-solid fa-user"></i>
              </span>
              <span>Profile</span>
            </Link>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="flex items-center gap-4 rounded-[1.25rem] px-3.5 py-2.5 text-left transition hover:bg-[#faf7f1] hover:text-[#1f2b24]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f6f6f6] text-[#8b8579]">
                  <i className="fa-solid fa-right-from-bracket"></i>
                </span>
                <span>Log out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-4 rounded-[1.25rem] px-3.5 py-3 text-left transition hover:bg-[#faf7f1] hover:text-[#1f2b24]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f6f6f6] text-[#8b8579]">
                  <i className="fa-solid fa-right-to-bracket"></i>
                </span>
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#efeadf] bg-white px-4 py-4 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link
            href="/catalog"
            className="block text-xl font-black uppercase tracking-[0.08em] text-[#151515]"
          >
            THE BOOKS
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ece7db] bg-white text-[#1f2b24] transition hover:bg-[#faf7f1]"
            aria-label="Open navigation"
          >
            <i className="fa-solid fa-bars text-base"></i>
          </button>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.12)] lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 flex h-full w-[20rem] flex-col rounded-r-[2rem] border-r border-[#efeadf] bg-white px-5 py-6"
            onClick={(event) => event.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[var(--sidebar-width)] flex-col overflow-y-auto rounded-r-[2rem] border-r border-[#efeadf] bg-white px-6 py-8 lg:flex">
        <div className="relative flex min-h-0 flex-1 flex-col">
          {sidebarContent}
        </div>
      </aside>

      {pathname === "/catalog" && (
        <div
          ref={popupRef}
          className="pointer-events-none absolute right-10 top-7 z-40 hidden xl:block"
        >
          <div className="pointer-events-auto relative">
            <div className="flex items-center gap-4 rounded-[1.5rem] bg-[#ebe6d6] px-6 py-5">
              <button
                type="button"
                onClick={() => setIsNotificationOpen((current) => !current)}
                className="flex items-center gap-3 rounded-full bg-[#f7f1df] px-3 py-2 text-sm font-medium text-[#2a2620]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f0d369] text-sm font-black text-[#2a2620]">
                  {sessionInitials}
                </span>
                <span>{sessionName || "Reader"}</span>
                <i className="fa-solid fa-angle-down text-xs text-[#7e7668]"></i>
              </button>
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setIsNotificationOpen((current) => !current)}
                className="relative text-[#1d1d1d]"
              >
                <i className="fa-solid fa-bell text-lg"></i>
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1 h-2.5 w-2.5 rounded-full bg-[#ff7d57]"></span>
                )}
              </button>
            </div>

            {isNotificationOpen && (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[24rem] overflow-hidden rounded-[1.4rem] border border-[#ece5d7] bg-white shadow-[0_30px_50px_-34px_rgba(0,0,0,0.28)]">
                <div className="flex items-center justify-between border-b border-[#f0eadf] px-5 py-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#aaa08f]">
                      Activity center
                    </p>
                    <h3 className="mt-1 text-lg font-black text-[#1d1d1d]">
                      Notifications
                    </h3>
                  </div>
                  <Link
                    href="/notifications"
                    className="text-sm font-semibold text-[#23493d]"
                  >
                    View all
                  </Link>
                </div>

                {notificationError && (
                  <div className="border-b border-[#f5e5df] bg-[#fff8f6] px-5 py-3 text-sm font-medium text-[#a54f42]">
                    {notificationError}
                  </div>
                )}

                <div className="max-h-[26rem] overflow-y-auto">
                  {isNotificationLoading ? (
                    <div className="px-5 py-8 text-sm text-[#8b8579]">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-5 py-8 text-sm text-[#8b8579]">
                      No notifications yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f4eee2]">
                      {notifications.slice(0, 6).map((notification) => (
                        <article
                          key={notification.id}
                          className={`px-5 py-4 ${notification.isRead ? "bg-white" : "bg-[#fffaf2]"}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-[#f7f3ea] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#8b8579]">
                                  {notification.type}
                                </span>
                                <span
                                  className={`text-[10px] font-black uppercase tracking-[0.14em] ${notification.isRead ? "text-[#bbb3a6]" : "text-[#d86856]"}`}
                                >
                                  {notification.isRead ? "Read" : "Unread"}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-[#1d1d1d]">
                                  {notification.title}
                                </h4>
                                <p className="mt-1 text-sm leading-6 text-[#6f695f]">
                                  {renderMessage(
                                    notification.message,
                                    notification.type,
                                  )}
                                </p>
                              </div>
                              <p className="text-xs font-medium text-[#b2aa9c]">
                                {formatDateTime(notification.createdAt)}
                              </p>
                            </div>

                            {!notification.isRead && (
                              <button
                                type="button"
                                disabled={isNotificationUpdating}
                                onClick={() =>
                                  void handleMarkAsRead(notification.id)
                                }
                                className="rounded-full bg-[#23493d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        title="Log out?"
        description="You will need to sign in again to access your library account."
        confirmLabel="Log out"
        variant="danger"
        onCancel={() => setIsLogoutConfirmOpen(false)}
        onConfirm={logoutUser}
      />
    </>
  );
}
