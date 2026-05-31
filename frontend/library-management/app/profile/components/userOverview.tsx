import React from 'react';
import { UserProfile } from '../types';

interface UserOverviewProps {
  profile: UserProfile | null;
  onEdit: () => void;
  onOpenSecurity: () => void;
}

const UserOverview: React.FC<UserOverviewProps> = ({ profile, onEdit, onOpenSecurity }) => {
  if (!profile) return null;

  return (
    <section className="relative mb-8 flex flex-col gap-8 overflow-hidden rounded-xl border border-outline-variant bg-[var(--catalog-panel)] p-8 shadow-sm md:flex-row md:items-start">
      <div className="relative shrink-0">
        <img
          className="h-32 w-32 rounded-lg object-cover ring-1 ring-outline shadow-sm"
          alt="Profile avatar"
          src={profile.avatar}
        />
        <div className="absolute -bottom-2 -right-2 flex h-6 items-center justify-center rounded border border-[var(--catalog-panel)] bg-primary-container px-2 text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
          <i className="fa-solid fa-certificate mr-1"></i> Verified
        </div>
      </div>

      <div className="relative flex-1">
        <div className="mb-4 inline-flex items-center gap-2 border-b border-outline-variant pb-2 text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
          Reader Profile
        </div>
        <h1 className="mb-3 font-headline text-4xl font-black tracking-tight text-on-surface">
          {profile.name}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-on-surface-variant">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-id-badge text-primary"></i> User
          </span>
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-envelope text-primary"></i> {profile.email}
          </span>
          <span className="flex items-center gap-2">
            <i className="fa-regular fa-calendar text-primary"></i> Member since {profile.memberSince}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-black text-on-primary shadow-sm transition-all hover:bg-[#274c42]"
          >
            <i className="fa-solid fa-user-pen"></i> Edit Profile
          </button>
          <button
            type="button"
            onClick={onOpenSecurity}
            className="rounded-md border border-outline-variant bg-white px-6 py-2.5 text-sm font-black text-on-surface transition-all hover:bg-surface-variant"
          >
            Security Settings
          </button>
        </div>
      </div>

      <div className="relative hidden shrink-0 flex-col gap-6 border-l border-outline-variant pl-8 lg:flex">
        <div>
          <p className="font-headline text-3xl font-black text-on-surface">{profile.booksRead}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant">Books Read</p>
        </div>
        <div>
          <p className="font-headline text-3xl font-black text-on-surface">{profile.finesDue}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-on-surface-variant">Fines Due</p>
        </div>
      </div>
    </section>
  );
};

export default UserOverview;
