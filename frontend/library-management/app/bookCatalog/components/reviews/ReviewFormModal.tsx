'use client';

import React, { useState } from 'react';
import { reviewsApi } from '@/lib/reviews-api';
import type { ReviewResponseDto } from '@/lib/api-types';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookIsbn: string;
  existingReview: ReviewResponseDto | null;
  onSubmitSuccess: () => void;
}

export default function ReviewFormModal({ isOpen, onClose, bookIsbn, existingReview, onSubmitSuccess }: ReviewFormModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (existingReview) {
        await reviewsApi.updateReview(existingReview.id, { rating, comment });
      } else {
        await reviewsApi.createReview({ bookIsbn, rating, comment });
      }
      onSubmitSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-none bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-headline text-3xl font-black text-slate-900">
            {existingReview ? 'Edit Review' : 'Write a Review'}
          </h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block font-bold text-slate-700">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-amber-500' : 'text-slate-200'}`}
                >
                  <i className="fa-solid fa-star"></i>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-700">Review (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think about this book?"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 outline-none focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100 min-h-[120px] transition-all"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl bg-slate-100 py-4 font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-slate-900 py-4 font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
