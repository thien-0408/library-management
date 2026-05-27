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
    return `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition-all ${
      isActive
        ? 'bg-red-600 text-white shadow-lg shadow-red-200'
        : 'text-slate-500 hover:bg-red-50 hover:text-red-700'
    }`;
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between lg:block">
        <div>
          <Link href="/catalog" className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-100">
              <i className="fa-solid fa-book-open text-lg"></i>
            </span>
            <span>
              <span className="block font-headline text-2xl font-black tracking-tight text-slate-950">
                OpenBook
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.26em] text-red-600">
                Library portal
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-[13rem] text-sm font-bold leading-relaxed text-slate-500">
            Redefined workspace for catalog, reservations, and academic circulation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-full border border-red-100 bg-white px-3 py-2 text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-700 lg:hidden"
          aria-label="Close navigation"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={linkClassName(link.href)}>
            <span className={`relative grid h-9 w-9 place-items-center rounded-xl text-center transition ${pathname === link.href ? 'bg-white/15 text-white' : 'bg-red-50 text-red-600 group-hover:bg-white'}`}>
              <i className={`fa-solid ${link.icon}`}></i>
              {link.href === '/notifications' && unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center rounded-full bg-slate-950 px-1.5 py-0.5 text-[10px] font-black leading-none text-white ring-2 ring-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-red-100 pt-6">
        {isLoggedIn ? (
          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-700 transition hover:bg-red-100"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:bg-red-700"
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
      <header className="fixed inset-x-0 top-0 z-40 border-b border-red-100 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/catalog" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-100">
              <i className="fa-solid fa-book-open"></i>
            </span>
            <span>
              <span className="block font-headline text-2xl font-black tracking-tight text-slate-950">OpenBook</span>
              <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-red-600">Library portal</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-700 shadow-sm transition hover:bg-red-100"
            aria-label="Open navigation"
          >
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)}>
          <aside
            className="absolute left-0 top-0 flex h-full w-[20rem] flex-col border-r border-red-100 bg-white px-5 py-6 shadow-2xl shadow-red-950/10"
            onClick={(event) => event.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[var(--sidebar-width)] flex-col border-r border-red-100 bg-white px-6 py-8 shadow-[18px_0_70px_-52px_rgba(153,27,27,0.65)] lg:flex">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-red-50 to-transparent" />
        <div className="relative flex min-h-0 flex-1 flex-col">
          {sidebarContent}
        </div>
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
