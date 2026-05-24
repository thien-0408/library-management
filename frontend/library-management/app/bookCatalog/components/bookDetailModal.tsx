'use client';

import React, { useState } from 'react';
import { getBookCategoryLabel } from '@/lib/book-category';
import { IBook } from '@/app/bookCatalog/types/interfaceBook';
import Toast from '@/components/toast_notification';
import type { BorrowMode } from '@/app/bookCatalog/services/api';

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
      {/* Modal Overlay and backdrop blur effect */}
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300 "
        onClick={onClose}
      >
        {/* Modal Container */}
        <div data-aos="fade-in" data-aos-duration="300"
          className="rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hidden shadow-2xl relative"
          onClick={(e) => e.stopPropagation()} // stop event to prevent closing modal
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* ========== LEFT SECTION: BOOK COVER IMAGE ========== */}
            <div className="flex items-center justify-center bg-surface-variant rounded-xl overflow-hidden aspect-[3/4] md:aspect-auto">
              <img
                src={selectedBook.coverImage}
                alt={selectedBook.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* ========== RIGHT SECTION: BOOK DETAILS ========== */}
            <div className="flex flex-col justify-between relative py-2">
              {/* Close Button - FontAwesome icon */}
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 w-10 h-10 bg-surface-container hover:bg-error/10 hover:text-error rounded-full flex items-center justify-center text-on-surface-variant transition-colors z-10"
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>

              <div className="pr-6">
                {/* Tags: Category & Year */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30">
                    {getBookCategoryLabel(selectedBook.category)}
                  </span>
                  <span className="bg-black/20 text-white/70 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                    {selectedBook.year}
                  </span>
                </div>

                {/* Book Title */}
                <h2 className="text-4xl font-headline font-extrabold text-white mb-2 leading-tight drop-shadow-sm">
                  {selectedBook.title}
                </h2>

                {/* Author */}
                <p className="text-xl font-bold text-white/80 mb-6">
                  By {selectedBook.author}
                </p>

                {/* Availability Status - FontAwesome icons */}
                <div className="flex items-center gap-2 mb-8 p-4 bg-white/5 rounded-xl border border-white/15">
                  <i className="fa-solid fa-book text-black-500 text-lg"></i>
                  <span className="font-medium text-white/70">Status:</span>
                  {selectedBook.isAvailable ? (
                    <span className="font-bold text-green-600 flex items-center gap-1">
                      <i className="fa-solid fa-circle-check text-sm"></i>
                      Available for Request
                    </span>
                  ) : (
                    <span className="font-bold text-rose-300 flex items-center gap-1">
                      <i className="fa-solid fa-circle-xmark text-sm"></i>
                      Currently Borrowed
                    </span>
                  )}
                </div>

                {/* Book Description/Synopsis */}
                <div className="mb-8">
                  <h3 className="font-headline font-bold text-lg text-white mb-3">
                    Synopsis
                  </h3>
                  <p className="text-white/65 leading-relaxed font-body">
                    {selectedBook.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {selectedBook.isAvailable ? (
                  <button
                    onClick={() => handleAction('OFFLINE')}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all vibrant-gradient-bg text-on-primary hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-book-bookmark"></i>}
                    Borrow Offline
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction('HOLD')}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all vibrant-gradient-bg text-on-primary hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-clock"></i>}
                    Place Hold
                  </button>
                )}

                {hasOnlineAccess && (
                  <button
                    onClick={() => handleAction('ONLINE')}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-white/30 text-white hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-globe"></i>}
                    Read Online
                  </button>
                )}
              </div>
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
    </>
  );
}
