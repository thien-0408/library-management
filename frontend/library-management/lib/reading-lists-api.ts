import { apiFetch } from '@/lib/api';
import type { ReadingListResponseDto, CreateReadingListDto } from './api-types';

export const readingListsApi = {
  getMyLists: () => 
    apiFetch<ReadingListResponseDto[]>('/api/reading-lists/me'),

  getListDetails: (id: string) => 
    apiFetch<ReadingListResponseDto>(`/api/reading-lists/${id}`),

  createList: (payload: CreateReadingListDto) =>
    apiFetch<ReadingListResponseDto>('/api/reading-lists', {
      method: 'POST',
      body: payload,
    }),

  updateList: (id: string, payload: { name: string; description?: string }) =>
    apiFetch<ReadingListResponseDto>(`/api/reading-lists/${id}`, {
      method: 'PUT',
      body: payload,
    }),

  deleteList: (id: string) =>
    apiFetch<void>(`/api/reading-lists/${id}`, {
      method: 'DELETE',
    }),

  addBookToList: (listId: string, payload: { bookIsbn: string; notes?: string }) =>
    apiFetch<void>(`/api/reading-lists/${listId}/items`, {
      method: 'POST',
      body: payload,
    }),

  removeBookFromList: (listId: string, itemId: string) =>
    apiFetch<void>(`/api/reading-lists/${listId}/items/${itemId}`, {
      method: 'DELETE',
    }),
};
