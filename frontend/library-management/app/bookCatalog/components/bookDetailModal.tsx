'use client';

'use client';

import React, { useState } from 'react';
import { getBookCategoryLabel } from '@/lib/book-category';
import { IBook } from '@/app/bookCatalog/types/interfaceBook';
import Toast from '@/components/toast_notification';
import type { BorrowMode } from '@/app/bookCatalog/services/api';
import ReviewsSection from './reviews/ReviewsSection';
import AddToListModal from '@/app/reading-lists/components/addToListModal';

interface BookDetailModalProps {
  isOpen: boolean;
  selectedBook: IBook | null;
  onClose: () => void;
  onRequestBook: (book: IBook, borrowMode: BorrowMode) => void | Promise<void>;
  onPlaceHold: (book: IBook) => void | Promise<void>;
}

export default function BookDetailModal({
  isOpen,
  selectedBook,
  onClose,
  onRequestBook,
  onPlaceHold,
}: BookDetailModalProps) {
  // ========== STATE MANAGEMENT ==========
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  if (!isOpen || !selectedBook) return null;

  // ========== API HANDLER ==========
  /**
   * Xử lý khi người dùng nhấn nút "Request Book"
   * - Gửi request đến API với bookId
   * - Quản lý loading state
   * - Hiển thị toast thông báo thành công/lỗi
   */
  const handleAction = async (action: 'OFFLINE' | 'ONLINE' | 'HOLD') => {
    setIsSubmitting(true);

    try {
      if (action === 'HOLD') {
        await onPlaceHold(selectedBook);
      } else {
        await onRequestBook(selectedBook, action);
      }

      const isOnline = action === 'ONLINE';
      const isHold = action === 'HOLD';
      setToastConfig({
        isVisible: true,
        title: isHold ? 'Hold Placed Successfully' : 'Book Requested Successfully',
        description: isOnline
          ? 'Your online access is ready in your borrow history.'
          : isHold
            ? "You'll be notified when a copy is available."
            : "You'll receive an offline borrow code for pickup.",
        type: 'success',
      });
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request book. Please try again.';

      setToastConfig({
        isVisible: true,
        title: 'Request Failed',
        description: errorMessage,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasOnlineAccess = Boolean(selectedBook.bookOnlineUrl || selectedBook.documentFileUrl);

  // ========== RENDER ==========
  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 transition-opacity duration-300"
        onClick={onClose}
      >
        <div data-aos="fade-in" data-aos-duration="300"
          className="scrollbar-hidden relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-none border border-[var(--catalog-border)] bg-[var(--catalog-panel)] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-[28rem] items-center justify-center overflow-hidden bg-[var(--catalog-panel-muted)] p-5">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                className="relative h-full max-h-[34rem] w-full rounded-[1.5rem] object-cover shadow-2xl shadow-amber-950/10"
              />
            </div>

            <div className="relative flex flex-col justify-between px-6 py-7 sm:px-8">
              <button
                onClick={onClose}
                className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--catalog-border)] bg-[var(--catalog-panel)] text-[var(--catalog-text-muted)] shadow-sm transition-colors hover:bg-[var(--catalog-panel-muted)] hover:text-[var(--catalog-accent)]"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>

              <div className="pr-8">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-[var(--catalog-border)] bg-[var(--catalog-panel-muted)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[var(--catalog-accent)]">
                    {getBookCategoryLabel(selectedBook.category)}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    {selectedBook.year}
                  </span>
                </div>

                <h2 className="mb-2 font-headline text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950">
                  {selectedBook.title}
                </h2>

                <p className="mb-6 text-xl font-black text-[var(--catalog-accent)]">
                  By {selectedBook.author}
                </p>

                <div className="mb-8 flex items-center gap-2 rounded-2xl border border-[var(--catalog-border)] bg-[var(--catalog-panel-muted)] p-4">
                  <i className="fa-solid fa-book text-lg text-[var(--catalog-accent)]"></i>
                  <span className="font-bold text-slate-500">Status:</span>
                  {selectedBook.isAvailable ? (
                    <span className="flex items-center gap-1 font-black text-emerald-600">
                      <i className="fa-solid fa-circle-check text-sm"></i>
                      Available for Request
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 font-black text-[var(--catalog-accent)]">
                      <i className="fa-solid fa-circle-xmark text-sm"></i>
                      Currently Borrowed
                    </span>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="mb-3 font-headline text-lg font-black text-slate-950">
                    Synopsis
                  </h3>
                  <p className="font-body leading-relaxed text-slate-600">
                    {selectedBook.description}
                  </p>
                </div>
              </div>

                <div className="grid grid-cols-2 gap-3">
                  {selectedBook.isAvailable ? (
                    <button
                      onClick={() => handleAction('OFFLINE')}
                      disabled={isSubmitting}
                      className="catalog-accent-button col-span-2 flex items-center justify-center gap-2 rounded-2xl py-4 font-black transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-book-bookmark"></i>}
                      Borrow Offline
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction('HOLD')}
                      disabled={isSubmitting}
                      className="catalog-accent-button col-span-2 flex items-center justify-center gap-2 rounded-2xl py-4 font-black transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-clock"></i>}
                      Place Hold
                    </button>
                  )}

                  <button
                    onClick={() => setIsAddToListModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--catalog-border)] bg-[var(--catalog-panel-muted)] py-4 font-black text-[var(--catalog-text-muted)] transition-all hover:bg-[var(--catalog-panel)] hover:text-[var(--catalog-accent)] active:scale-[0.98]"
                  >
                    <i className="fa-solid fa-bookmark text-amber-500"></i>
                    Save to List
                  </button>

                  {hasOnlineAccess && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/reader?url=${encodeURIComponent(selectedBook.documentFileUrl || selectedBook.bookOnlineUrl || '')}`;
                      }}
                      className="catalog-outline-button flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-black transition-all active:scale-[0.98]"
                    >
                      <i className="fa-solid fa-globe"></i>
                      Read Online
                    </button>
                  )}
                </div>

              {/* Reviews Section */}
              <ReviewsSection bookId={String(selectedBook.id)} bookIsbn={selectedBook.isbn} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification Component */}
      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={() =>
          setToastConfig((prev) => ({ ...prev, isVisible: false }))
        }
      />

      <AddToListModal
        isOpen={isAddToListModalOpen}
        onClose={() => setIsAddToListModalOpen(false)}
        bookIsbn={selectedBook.isbn}
      />
    </>
  );
}
