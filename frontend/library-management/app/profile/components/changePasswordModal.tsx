import React, { useEffect, useState } from 'react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

const INITIAL_FORM = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function ChangePasswordModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => {
        setForm(INITIAL_FORM);
        setError(null);
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Please complete all password fields.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <div className="w-full max-w-lg rounded-[2rem] border border-outline-variant bg-[var(--catalog-panel)] p-6 shadow-soft-card sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-primary-container px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-on-primary-container">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Security settings
            </div>
            <h2 className="mt-5 font-headline text-3xl font-black tracking-[-0.04em] text-on-surface">
              Change password
            </h2>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              Update your password to keep your library account secure.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-outline-variant px-3 py-2 text-on-surface-variant transition hover:bg-primary-container hover:text-primary"
            aria-label="Close change password modal"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form className="mt-8 space-y-5" onSubmit={(event) => void handleSubmit(event)}>
          <label className="block space-y-2">
            <span className="text-sm font-black text-on-surface">Current password</span>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(event) => handleChange('currentPassword', event.target.value)}
              className="w-full rounded-2xl border border-outline-variant bg-white/80 px-4 py-3 text-sm font-medium text-on-surface outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15"
              autoComplete="current-password"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-black text-on-surface">New password</span>
            <input
              type="password"
              value={form.newPassword}
              onChange={(event) => handleChange('newPassword', event.target.value)}
              className="w-full rounded-2xl border border-outline-variant bg-white/80 px-4 py-3 text-sm font-medium text-on-surface outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15"
              autoComplete="new-password"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-black text-on-surface">Confirm new password</span>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(event) => handleChange('confirmPassword', event.target.value)}
              className="w-full rounded-2xl border border-outline-variant bg-white/80 px-4 py-3 text-sm font-medium text-on-surface outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/15"
              autoComplete="new-password"
            />
          </label>

          {error && (
            <div className="rounded-2xl border border-error-container bg-error-container px-4 py-3 text-sm font-bold text-on-error-container">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-outline-variant px-5 py-3 text-sm font-black text-on-surface-variant transition hover:bg-primary-container hover:text-on-primary-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-primary px-5 py-3 text-sm font-black text-on-primary shadow-lg shadow-primary/20 transition hover:bg-[#274c42] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Updating...' : 'Change password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
