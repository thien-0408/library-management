'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import Toast from '@/components/toast_notification';
import ConfirmModal from '@/components/confirm_modal';
import { ProfileSkeleton } from '@/components/skeleton_loader';
import { useToast } from '@/hooks/useToast';
import { useProfile } from '@/app/profile/hooks/useProfile';
import { profileService } from '@/app/profile/services/api';
import type { BorrowedBook } from '@/app/profile/types';

// Import extracted components
import UserOverview from '@/app/profile/components/userOverview';
import BorrowedBooksList from '@/app/profile/components/borrowedBooksList';
import ReservationsList from '@/app/profile/components/reservationsList';
import PendingRequestsList from '@/app/profile/components/pendingRequestsList';
import UpdateProfileModal from '@/app/profile/components/updateProfileModal';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object') {
    const maybeError = error as { data?: { message?: string }; message?: string };
    return maybeError.data?.message || maybeError.message || fallback;
  }

  return fallback;
};

export default function ProfilePage() {
  const {
    profile,
    borrowedBooks,
    reservations,
    requests,
    isLoading,
    error,
    refreshData
  } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [returningBookId, setReturningBookId] = useState<string | null>(null);
  const [bookToReturn, setBookToReturn] = useState<BorrowedBook | null>(null);
  const { toastConfig, showToast, hideToast } = useToast();

  const handleUpdateProfile = async (payload: { fullName: string; avatar?: File | null }) => {
    try {
      await profileService.updateProfile(payload);
      setIsEditModalOpen(false);
      await refreshData();
      showToast('Profile updated', 'Your profile details were saved successfully.', 'success');
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to update profile.');
      showToast('Profile update failed', message, 'error');
      throw err;
    }
  };

  const handleReturnBook = async () => {
    if (!bookToReturn) return;

    setReturningBookId(bookToReturn.id);

    try {
      await profileService.returnBook(bookToReturn.id);
      await refreshData();
      showToast('Book returned', `${bookToReturn.title} was returned successfully.`, 'success');
      setBookToReturn(null);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to return book.');
      showToast('Return failed', message, 'error');
    } finally {
      setReturningBookId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f7] font-body text-slate-950">
      <Header />

      <main className="app-shell-main app-shell-content page-shell mx-auto w-full max-w-7xl flex-grow px-5 pb-24 md:px-8 lg:px-10">
        {error && (
            <div className="mb-8 rounded-[1.5rem] border border-red-100 bg-white px-6 py-5 text-center font-bold text-red-700 shadow-sm">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
                <button onClick={refreshData} className="ml-4 text-sm font-black underline">Retry</button>
            </div>
        )}

        {isLoading ? (
            <ProfileSkeleton />
        ) : (
            <>
                <UserOverview profile={profile} onEdit={() => setIsEditModalOpen(true)} />

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* LEFT COLUMN: BOOKS & ROOMS */}
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <BorrowedBooksList books={borrowedBooks} returningBookId={returningBookId} onReturnBook={setBookToReturn} />
                        <ReservationsList reservations={reservations} />
                    </div>

                    {/* RIGHT COLUMN: PENDING REQUESTS */}
                    <div className="lg:col-span-1">
                        <PendingRequestsList requests={requests} />
                    </div>
                </div>
            </>
        )}
      </main>

      {profile && (
        <UpdateProfileModal
          isOpen={isEditModalOpen}
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateProfile}
        />
      )}

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />

      <ConfirmModal
        isOpen={Boolean(bookToReturn)}
        title="Return this book?"
        description={bookToReturn ? `Confirm that you want to return ${bookToReturn.title}. This will close the active offline borrow.` : ''}
        confirmLabel="Return book"
        isLoading={Boolean(returningBookId)}
        onCancel={() => setBookToReturn(null)}
        onConfirm={() => void handleReturnBook()}
      />

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-red-100 bg-white/95 shadow-[0_-12px_40px_-30px_rgba(153,27,27,0.55)] backdrop-blur md:hidden">
        <a href="/catalog" className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <i className="fa-solid fa-box-archive"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Catalog</span>
        </a>
        <a href="/requests" className="flex flex-col items-center justify-center gap-1 text-slate-500">
          <i className="fa-solid fa-clipboard-list"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Requests</span>
        </a>
        <a href="/profile" className="flex flex-col items-center justify-center gap-1 text-red-700">
          <i className="fa-solid fa-circle-user"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </a>
      </nav>
    </div>
  );
}
