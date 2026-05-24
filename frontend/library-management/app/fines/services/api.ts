import { apiFetch } from '@/lib/api';
import type { FineItem, FineStatus } from '../types';

export const finesService = {
  getMyFines: () => apiFetch<FineItem[]>('/api/fines/me'),

  getAllFines: () => apiFetch<FineItem[]>('/api/fines'),

  generateOverdueFines: () =>
    apiFetch<void>('/api/fines/generate-overdue', {
      method: 'POST',
    }),

  updateFineStatus: (id: string, status: FineStatus) =>
    apiFetch<FineItem>(`/api/fines/${id}/status`, {
      method: 'PATCH',
      body: { status },
    }),
};
