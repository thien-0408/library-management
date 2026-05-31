'use client';

import React, { useState, useEffect } from 'react';
import { reviewsApi } from '@/lib/reviews-api';
import type { ReviewResponseDto, ReviewSummaryDto } from '@/lib/api-types';
import { getAuthSession } from '@/lib/api';
import ReviewFormModal from './ReviewFormModal';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/toast_notification';

interface ReviewsSectionProps {
  bookId: string;
  bookIsbn: string;
}

export default function ReviewsSection({ bookId, bookIsbn }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [summary, setSummary] = useState<ReviewSummaryDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewResponseDto | null>(null);
  const { toastConfig, showToast, hideToast } = useToast();

  const session = getAuthSession();
  const userId = session?.userId;
  const isLoggedIn = !!session;

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const [reviewsData, summaryData] = await Promise.all([
        reviewsApi.getBookReviews(bookId),
        reviewsApi.getBookReviewSummary(bookId).catch(() => null)
      ]);
      setReviews(reviewsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const handleEdit = (review: ReviewResponseDto) => {
    setEditingReview(review);
    setIsFormOpen(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await reviewsApi.deleteReview(reviewId);
      showToast('Review Deleted', 'Your review has been removed.', 'success');
      fetchReviews();
    } catch (error) {
      showToast('Error', 'Failed to delete review', 'error');
    }
  };

  const handleFormSubmit = () => {
    setIsFormOpen(false);
    setEditingReview(null);
    fetchReviews();
  };

  const myReview = reviews.find(r => r.userId === userId);

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h3 className="font-headline text-2xl font-black text-slate-950">Reviews</h3>
          {summary && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <i className="fa-solid fa-star text-lg"></i>
                <span className="ml-1 font-black text-slate-800 text-lg">{summary.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm font-medium text-slate-500">
                ({summary.totalReviews} {summary.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        {isLoggedIn && !myReview && (
          <button
            onClick={() => {
              setEditingReview(null);
              setIsFormOpen(true);
            }}
            className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Write a Review
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-slate-500">
          <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
          <p className="font-medium text-slate-500">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <div key={review.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 font-bold">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{review.userName}</p>
                    <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa-solid fa-star text-sm ${i < review.rating ? 'opacity-100' : 'opacity-20 text-slate-300'}`}></i>
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-slate-700 leading-relaxed">{review.comment}</p>
              )}
              {review.userId === userId && (
                <div className="mt-4 flex gap-3 border-t border-slate-100 pt-3">
                  <button onClick={() => handleEdit(review)} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="text-sm font-bold text-red-500 hover:text-red-700 transition">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <ReviewFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          bookIsbn={bookIsbn}
          existingReview={editingReview}
          onSubmitSuccess={handleFormSubmit}
        />
      )}
      
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
