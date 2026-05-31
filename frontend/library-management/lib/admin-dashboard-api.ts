import { apiFetch } from '@/lib/api';
import type { DashboardStatsResponseDto } from './api-types';

export const adminDashboardApi = {
  getStats: () => apiFetch<DashboardStatsResponseDto>('/api/admin/dashboard/stats'),
};
