'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { UserProfile, UpdateProfileInput } from '../types';

interface UpdateProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSubmit: (payload: UpdateProfileInput) => Promise<void>;
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ isOpen, profile, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState(profile.name);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      setFullName(profile.name);
      setAvatar(null);
      setError(null);
      setIsSubmitting(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isOpen, profile.name]);

  const previewUrl = useMemo(() => {
    if (!avatar) return profile.avatar;
    return URL.createObjectURL(avatar);
  }, [avatar, profile.avatar]);

  useEffect(() => {
    return () => {
      if (avatar) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [avatar, previewUrl]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ fullName, avatar });
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update profile.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-950/55" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-outline-variant bg-[var(--catalog-panel)] shadow-[0_32px_120px_-24px_rgba(72,58,34,0.34)]">
        <div className="relative overflow-hidden border-b border-outline-variant/60 bg-surface-variant px-6 py-6 sm:px-8">
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary/70">Profile Studio</p>
              <h2 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface">Update your identity</h2>
              <p className="mt-2 max-w-lg text-sm text-on-surface-variant">Refresh your display name and portrait so your reader profile stays current across the library.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant bg-white/80 text-on-surface-variant transition hover:bg-primary-container hover:text-primary"
              aria-label="Close update profile modal"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 px-6 py-6 sm:px-8 sm:py-8 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-outline-variant/70 bg-surface p-4 shadow-[0_20px_45px_-24px_rgba(148,163,184,0.45)]">
              <div className="relative mx-auto w-fit">
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="h-36 w-36 rounded-[1.5rem] object-cover ring-4 ring-primary-container"
                />
                <div className="absolute -bottom-3 -right-3 flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-[var(--catalog-panel)] bg-primary text-on-primary shadow-lg">
                  <i className="fa-solid fa-camera text-sm"></i>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-dashed border-primary/30 bg-white/80 px-4 py-4 text-center">
                <label className="cursor-pointer text-sm font-bold text-primary">
                  Choose avatar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                  />
                </label>
                <p className="mt-2 text-xs text-on-surface-variant">PNG, JPG, or WEBP. Leave empty to keep your current avatar.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-error-container bg-error-container px-4 py-3 text-sm font-medium text-on-error-container">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
              </div>
            )}

            <div className="rounded-[1.75rem] border border-outline-variant/70 bg-white/80 p-5 shadow-[0_12px_40px_-28px_rgba(72,58,34,0.24)]">
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-outline-variant/70 bg-surface px-4 py-4 text-base font-semibold text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Enter your full name"
                required
              />
              <p className="mt-3 text-sm text-on-surface-variant">This name is shown on your public library profile and account overview.</p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border-2 border-outline-variant px-5 py-3 text-sm font-bold text-on-surface-variant transition hover:bg-surface-variant hover:text-primary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#274c42] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving changes...' : 'Save profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
