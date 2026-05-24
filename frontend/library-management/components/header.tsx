'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { logoutUser } from '@/app/login/services/auth';
import { isAdminSession } from '@/lib/api';
import { notificationsService } from '@/app/notifications/services/api';
import ConfirmModal from '@/components/confirm_modal';

interface HeaderProps {
  role?: 'admin' | 'user';
}

const normalizeRole = (role?: string | null): 'admin' | 'user' => {
  return role?.toLowerCase() === 'admin' ? 'admin' : 'user';
};

export default function Header({ role }: HeaderProps) {
  const pathname = usePathname();
  const [resolvedRole, setResolvedRole] = useState<'admin' | 'user'>(normalizeRole(role));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem('accessToken'));
    setIsLoggedIn(hasToken);
    setResolvedRole(role ? normalizeRole(role) : isAdminSession() ? 'admin' : 'user');
  }, [role]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const notifications = await notificationsService.getMyNotifications(true);
        setUnreadCount(notifications.length);
      } catch (error) {
        console.error('Fetch unread notification count error:', error);
      }
    };

    void fetchUnreadCount();
    const intervalId = window.setInterval(fetchUnreadCount, 30000);

    return () => window.clearInterval(intervalId);
  }, [isLoggedIn]);

  const links = useMemo(() => {
    const baseLinks = [
      { href: '/catalog', label: 'Catalog', icon: 'fa-book-open' },
      { href: '/roomReservations', label: 'Book Room', icon: 'fa-door-open' },
      { href: '/profile', label: 'Profile', icon: 'fa-circle-user' },
      { href: '/notifications', label: 'Notifications', icon: 'fa-bell' },
      { href: '/fines', label: 'Fines', icon: 'fa-file-invoice-dollar' },
    ];

    if (resolvedRole === 'admin') {
      baseLinks.push(
        { href: '/adminInventory', label: 'Inventory', icon: 'fa-boxes-stacked' },
        { href: '/adminUsers', label: 'Users', icon: 'fa-users' },
        { href: '/roomViewer', label: 'Rooms', icon: 'fa-building' },
        { href: '/timeSlots', label: 'Time Slots', icon: 'fa-clock' },
      );
    }

    return baseLinks;
  }, [resolvedRole]);

  const linkClassName = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
      isActive
        ? 'bg-primary text-white shadow-lg shadow-primary/25'
        : 'text-on-surface-variant hover:bg-primary/8 hover:text-primary'
    }`;
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between lg:block">
        <div>
          <Link href="/catalog" className="font-headline text-3xl font-black tracking-tight text-primary">
            OpenBook
          </Link>
          <p className="mt-2 max-w-[12rem] text-sm font-semibold leading-relaxed text-on-surface-variant">
            Library workspace for catalog, reservations, and academic circulation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="lg:hidden rounded-full border border-outline-variant px-3 py-2 text-on-surface-variant"
          aria-label="Close navigation"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={linkClassName(link.href)}>
            <span className="relative w-4 text-center">
              <i className={`fa-solid ${link.icon}`}></i>
              {link.href === '/notifications' && unreadCount > 0 && (
                <span className="absolute -right-3 -top-3 flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-black leading-none text-white ring-2 ring-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-outline-variant/80 pt-6">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-error/10 px-4 py-3 text-sm font-black text-error hover:bg-error/20"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-black text-primary hover:bg-primary/20"
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            Login
          </Link>
        )}
      </div>
    </>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-outline-variant/60 bg-white/95 px-4 py-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <Link href="/catalog" className="font-headline text-2xl font-black tracking-tight text-primary">
              OpenBook
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant/70">
              Library portal
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-outline-variant bg-white text-on-surface shadow-sm"
            aria-label="Open navigation"
          >
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)}>
          <aside
            className="sidebar-surface absolute left-0 top-0 flex h-full w-[19rem] flex-col bg-white px-5 py-6"
            onClick={(event) => event.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      <aside className="sidebar-surface fixed left-0 top-0 z-30 hidden h-screen w-[var(--sidebar-width)] flex-col border-r border-outline-variant/70 bg-white px-6 py-8 lg:flex">
        {sidebarContent}
      </aside>

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
