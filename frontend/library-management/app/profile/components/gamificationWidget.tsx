'use client';

import React, { useEffect, useState } from 'react';
import { gamificationApi } from '@/lib/gamification-api';
import type { GamificationProfileDto } from '@/lib/api-types';

export default function GamificationWidget() {
  const [profile, setProfile] = useState<GamificationProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGamification = async () => {
      try {
        const data = await gamificationApi.getMyProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to load gamification profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGamification();
  }, []);

  if (isLoading) {
    return (
      <div className="glass-effect rounded-[2rem] p-6 shadow-soft-card border border-outline-variant animate-pulse h-48 w-full">
        <div className="h-6 bg-surface-variant rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-surface-variant rounded-xl"></div>
          <div className="h-20 bg-surface-variant rounded-xl"></div>
          <div className="h-20 bg-surface-variant rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="glass-effect rounded-[2rem] p-6 shadow-soft-card border border-outline-variant relative overflow-hidden mb-8">
      {/* Decorative background element */}
      <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-catalog-warm-accent rounded-full blur-[60px] opacity-40 -z-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-extrabold text-primary font-headline flex items-center gap-2">
          <i className="fa-solid fa-star text-catalog-warm-accent"></i>
          Reading Achievements
        </h3>
        <a href="/leaderboard" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
          Leaderboard <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/60 rounded-2xl p-4 flex flex-col items-center justify-center border border-outline-variant hover:shadow-md transition-shadow">
          <span className="text-3xl font-black text-primary mb-1">{profile.totalPoints}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Points</span>
        </div>
        <div className="bg-white/60 rounded-2xl p-4 flex flex-col items-center justify-center border border-outline-variant hover:shadow-md transition-shadow">
          <span className="text-3xl font-black text-catalog-accent mb-1 flex items-center gap-2">
            {profile.currentStreak} <i className="fa-solid fa-fire text-orange-500 text-lg"></i>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Day Streak</span>
        </div>
        <div className="bg-white/60 rounded-2xl p-4 flex flex-col items-center justify-center border border-outline-variant hover:shadow-md transition-shadow">
          <span className="text-3xl font-black text-primary mb-1">{profile.booksBorrowed}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Books Read</span>
        </div>
        <div className="bg-white/60 rounded-2xl p-4 flex flex-col items-center justify-center border border-outline-variant hover:shadow-md transition-shadow">
          <span className="text-3xl font-black text-primary mb-1">{profile.reviewsWritten}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Reviews</span>
        </div>
      </div>

      {profile.badges && profile.badges.length > 0 && (
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3">Badges Earned</h4>
          <div className="flex flex-wrap gap-3">
            {profile.badges.map(badge => (
              <div 
                key={badge.id} 
                className="flex items-center gap-2 bg-primary-container text-on-primary-container px-3 py-1.5 rounded-full text-sm font-bold border border-primary/20"
                title={badge.description}
              >
                {badge.imageUrl ? (
                  <img src={badge.imageUrl} alt={badge.name} className="w-5 h-5 rounded-full" />
                ) : (
                  <i className="fa-solid fa-medal text-primary"></i>
                )}
                {badge.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
