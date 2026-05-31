import { apiFetch } from '@/lib/api';
import type { GamificationProfileDto, GamificationLeaderboardDto } from './api-types';

export const gamificationApi = {
  getMyProfile: () => apiFetch<GamificationProfileDto>('/api/gamification/me'),
  getLeaderboard: (top: number = 10) => 
    apiFetch<GamificationLeaderboardDto[]>('/api/gamification/leaderboard', { params: { top } }),
};
