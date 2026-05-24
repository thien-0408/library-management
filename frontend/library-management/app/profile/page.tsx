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
    } catch (err: any) {
      const message = err?.data?.message || err?.message || 'Failed to update profile.';
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
    } catch (err: any) {
      const message = err?.data?.message || err?.message || 'Failed to return book.';
      showToast('Return failed', message, 'error');
    } finally {
      setReturningBookId(null);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <Header />

      <main className="app-shell-main app-shell-content page-shell px-6 md:px-10 lg:px-14 max-w-7xl mx-auto flex-grow w-full">
        {error && (
            <div className="text-center py-5 bg-red-50 text-red-600 rounded-2xl mb-8 border border-red-200">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
                <button onClick={refreshData} className="ml-4 underline text-sm">Retry</button>
            </div>
        )}

        {isLoading ? (
            <ProfileSkeleton />
        ) : (
            <>
                <UserOverview profile={profile} onEdit={() => setIsEditModalOpen(true)} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: BOOKS & ROOMS */}
                    <div className="lg:col-span-2 flex flex-col gap-10">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-outline-variant flex justify-around items-center h-16 z-50">
        <a href="/catalog" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant">
          <i className="fa-solid fa-box-archive"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Catalog</span>
        </a>
        <a href="/requests" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant">
          <i className="fa-solid fa-clipboard-list"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Requests</span>
        </a>
        <a href="/profile" className="flex flex-col items-center justify-center gap-1 text-primary">
          <i className="fa-solid fa-circle-user"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </a>
      </nav>
    </div>
  );
}
