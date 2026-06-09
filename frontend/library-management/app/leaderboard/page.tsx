'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import { gamificationApi } from '@/lib/gamification-api';
import { resolveAssetUrl } from '@/lib/api';
import type { GamificationLeaderboardDto } from '@/lib/api-types';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/toast_notification';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<GamificationLeaderboardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toastConfig, showToast, hideToast } = useToast();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await gamificationApi.getLeaderboard(20);
        setLeaderboard(data);
      } catch (error) {
        showToast('Error', 'Failed to load leaderboard', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="relative min-h-screen bg-background font-body text-on-surface z-0">
      {/* Decorative top background curved */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] md:h-[45vh] bg-surface rounded-br-[4rem] md:rounded-br-[8rem] -z-10 pointer-events-none shadow-sm" />
      
      <Header />

      <main className="app-shell-main app-shell-content page-shell mx-auto w-full max-w-4xl flex-grow px-5 pt-28 pb-24 md:px-8 md:pt-32 lg:px-10">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight font-headline">
            Top Readers <i className="fa-solid fa-crown text-catalog-warm-accent ml-2"></i>
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Check out our most active readers and earn points by borrowing books, writing reviews, and maintaining reading streaks!
          </p>
        </div>

        <div className="glass-effect rounded-[2rem] p-6 md:p-10 shadow-soft-card border border-outline-variant relative overflow-hidden">
          {/* subtle decorative blur behind the list */}
          <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary-container rounded-full blur-[80px] opacity-60 -z-10 pointer-events-none"></div>

          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 bg-surface-variant rounded-2xl w-full"></div>
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant font-medium">
              No leaderboard data available yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {leaderboard.map((user, index) => {
                const avatarUrl = resolveAssetUrl(user.avatarUrl);

                return (
                <div 
                  key={user.userId} 
                  className={`flex items-center gap-4 p-4 md:p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-md
                    ${index === 0 ? 'bg-gradient-to-r from-catalog-warm-accent/30 to-transparent border border-catalog-warm-accent/50' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-300/30 to-transparent border border-gray-300/50' :
                      index === 2 ? 'bg-gradient-to-r from-amber-700/20 to-transparent border border-amber-700/30' :
                      'bg-white/60 border border-outline-variant'}
                  `}
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-surface shadow-sm font-bold text-lg text-primary">
                    #{user.rank}
                  </div>

                  <div className="flex-shrink-0">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={`${user.userName}'s avatar`}
                        width={64}
                        height={64}
                        unoptimized
                        className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm md:h-16 md:w-16"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-primary-container text-xl font-bold text-primary shadow-sm md:h-16 md:w-16">
                        {user.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                   
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
                      {user.userName}
                      {index === 0 && <i className="fa-solid fa-trophy text-yellow-500 text-sm"></i>}
                      {index === 1 && <i className="fa-solid fa-medal text-gray-400 text-sm"></i>}
                      {index === 2 && <i className="fa-solid fa-medal text-amber-600 text-sm"></i>}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-primary">
                      {user.totalPoints}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      Points
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
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
