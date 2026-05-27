import React from 'react';
import { UserProfile } from '../types';

interface UserOverviewProps {
  profile: UserProfile | null;
  onEdit: () => void;
}

const UserOverview: React.FC<UserOverviewProps> = ({ profile, onEdit }) => {
  if (!profile) return null;

  return (
    <section className="relative mb-8 flex flex-col items-center gap-8 overflow-hidden rounded-[2.25rem] border border-red-100 bg-white p-8 shadow-[0_24px_80px_-48px_rgba(153,27,27,0.45)] md:flex-row md:items-start">
      <div className="absolute right-[-5rem] top-[-6rem] h-72 w-72 rounded-full bg-red-200/55 blur-3xl" />
      <div className="relative">
        <img
          className="h-32 w-32 rounded-full object-cover ring-4 ring-red-100"
          alt="Profile avatar"
          src={profile.avatar}
        />
        <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-600 text-white shadow-sm">
          <i className="fa-solid fa-certificate text-xs"></i>
        </div>
      </div>

      <div className="relative flex-1 text-center md:text-left">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-red-700">
          <span className="h-2 w-2 rounded-full bg-red-600" />
          Reader profile
        </div>
        <h1 className="mb-3 font-headline text-5xl font-black tracking-[-0.055em] text-slate-950">
          {profile.name}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-bold md:justify-start">
          <span className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-slate-600">
            <i className="fa-solid fa-id-badge text-lg text-red-600"></i> User
          </span>
          <span className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-slate-600">
            <i className="fa-solid fa-envelope text-lg text-red-600"></i> {profile.email}
          </span>
          <span className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-slate-600">
            <i className="fa-regular fa-calendar text-lg text-red-600"></i> Member since {profile.memberSince}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5 hover:bg-red-700"
          >
            <i className="fa-solid fa-user-pen"></i> Edit Profile
          </button>
          <button className="rounded-full border border-red-100 bg-white px-6 py-3 text-sm font-black text-slate-500 transition-all hover:bg-red-50 hover:text-red-700">
            Security Settings
          </button>
        </div>
      </div>

      <div className="relative hidden flex-col justify-center gap-4 border-l border-red-100 pl-8 lg:flex">
        <div className="text-center">
          <p className="font-headline text-4xl font-black text-red-700">{profile.booksRead}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Books Read</p>
        </div>
        <div className="text-center">
          <p className="font-headline text-4xl font-black text-red-700">{profile.finesDue}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Fines Due</p>
        </div>
      </div>
    </section>
  );
};

export default UserOverview;
