import { apiFetch } from '@/lib/api';
import type { ReviewResponseDto, ReviewSummaryDto, CreateReviewRequestDto } from './api-types';

export const reviewsApi = {
  getBookReviews: (bookId: string) => 
    apiFetch<ReviewResponseDto[]>(`/api/books/reviews/book/${bookId}`),
  
  getBookReviewSummary: (bookId: string) => 
    apiFetch<ReviewSummaryDto>(`/api/books/reviews/book/${bookId}/summary`),

  getMyReviews: () => 
    apiFetch<ReviewResponseDto[]>('/api/books/reviews/me'),

  createReview: (payload: CreateReviewRequestDto) =>
    apiFetch<ReviewResponseDto>('/api/books/reviews', {
      method: 'POST',
      body: payload,
    }),

  updateReview: (id: string, payload: { rating: number; comment?: string }) =>
    apiFetch<ReviewResponseDto>(`/api/books/reviews/${id}`, {
      method: 'PUT',
      body: payload,
    }),

  deleteReview: (id: string) =>
    apiFetch<void>(`/api/books/reviews/${id}`, {
      method: 'DELETE',
    }),
};
