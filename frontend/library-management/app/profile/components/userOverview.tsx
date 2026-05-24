import React from 'react';
import { UserProfile } from '../types';

interface UserOverviewProps {
  profile: UserProfile | null;
  onEdit: () => void;
}

const UserOverview: React.FC<UserOverviewProps> = ({ profile, onEdit }) => {
  if (!profile) return null;

  return (
    <section className="mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 bg-white p-8 rounded-2xl border border-outline-variant shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className="relative">
        <img
          className="w-32 h-32 rounded-full object-cover ring-4 ring-primary-container"
          alt="Profile avatar"
          src={profile.avatar}
        />
        <div className="absolute bottom-1 right-1 vibrant-gradient-bg text-white w-8 h-8 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
          <i className="fa-solid fa-certificate text-xs"></i>
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-3">
          {profile.name}
        </h1>
        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-medium">
          <span className="flex items-center gap-2 text-on-surface-variant">
            <i className="fa-solid fa-id-badge text-primary text-lg"></i> User
          </span>
          <span className="flex items-center gap-2 text-on-surface-variant">
            <i className="fa-solid fa-envelope text-primary text-lg"></i> {profile.email}
          </span>
          <span className="flex items-center gap-2 text-on-surface-variant">
            <i className="fa-regular fa-calendar text-primary text-lg"></i> Member since {profile.memberSince}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
          <button
            type="button"
            onClick={onEdit}
            className="vibrant-gradient-bg text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-user-pen"></i> Edit Profile
          </button>
          <button className="border-2 border-outline-variant text-on-surface-variant px-6 py-3 rounded-xl font-bold text-sm hover:bg-surface-variant hover:text-primary transition-all">
            Security Settings
          </button>
        </div>
      </div>

      <div className="hidden lg:flex flex-col gap-8 border-l-2 border-outline-variant/50 pl-12 justify-center">
        <div className="text-center">
          <p className="text-4xl font-extrabold font-headline text-primary">{profile.booksRead}</p>
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant/70 mt-1">Books Read</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-extrabold font-headline text-primary">{profile.finesDue}</p>
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-on-surface-variant/70 mt-1">Fines Due</p>
        </div>
      </div>
    </section>
  );
};

export default UserOverview;
