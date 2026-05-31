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

import UserOverview from '@/app/profile/components/userOverview';
import BorrowedBooksList from '@/app/profile/components/borrowedBooksList';
import ReservationsList from '@/app/profile/components/reservationsList';
import PendingRequestsList from '@/app/profile/components/pendingRequestsList';
import UpdateProfileModal from '@/app/profile/components/updateProfileModal';
import ChangePasswordModal from '@/app/profile/components/changePasswordModal';
import GamificationWidget from '@/app/profile/components/gamificationWidget';

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
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
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

  const handleChangePassword = async (payload: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsChangingPassword(true);

    try {
      const response = await profileService.changePassword(payload);
      setIsChangePasswordOpen(false);
      showToast(
        'Password updated',
        response.message || 'Your password was changed successfully.',
        'success',
      );
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to change password.');
      showToast('Password change failed', message, 'error');
      throw err;
    } finally {
      setIsChangingPassword(false);
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
    <div className="relative min-h-screen bg-white font-body text-on-surface z-0">
      {/* Decorative top background curved */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] md:h-[45vh] bg-[#f4f0e8] rounded-br-[4rem] md:rounded-br-[8rem] -z-10 pointer-events-none" />
      
      <Header />

      <main className="app-shell-main app-shell-content page-shell mx-auto w-full max-w-7xl flex-grow px-5 pt-28 pb-24 md:px-8 md:pt-32 lg:px-10">
        {error && (
            <div className="mb-8 rounded-[1.5rem] border border-error-container bg-error-container px-6 py-5 text-center font-bold text-on-error-container shadow-sm">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
                <button onClick={refreshData} className="ml-4 text-sm font-black underline">Retry</button>
            </div>
        )}

        {isLoading ? (
            <ProfileSkeleton />
        ) : (
            <>
                <UserOverview
                  profile={profile}
                  onEdit={() => setIsEditModalOpen(true)}
                  onOpenSecurity={() => setIsChangePasswordOpen(true)}
                />

                <div className="mx-auto w-full max-w-4xl flex flex-col gap-10">
                    <GamificationWidget />
                    
                    {/* Reading Lists Shortcut */}
                    <div className="rounded-[1.5rem] bg-[var(--catalog-panel)] p-6 shadow-sm border border-[var(--catalog-border)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--catalog-panel-muted)] text-[var(--catalog-accent)]">
                            <i className="fa-solid fa-bookmark text-xl"></i>
                          </div>
                          <div>
                            <h2 className="font-headline text-xl font-black text-[var(--catalog-text)]">Reading Lists</h2>
                            <p className="text-sm text-[var(--catalog-text-muted)]">Manage your saved books and custom collections</p>
                          </div>
                        </div>
                        <a 
                          href="/reading-lists" 
                          className="catalog-outline-button px-5 py-2.5 rounded-xl font-bold text-sm"
                        >
                          View Lists
                        </a>
                      </div>
                    </div>

                    <BorrowedBooksList books={borrowedBooks} returningBookId={returningBookId} onReturnBook={setBookToReturn} />
                    
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <ReservationsList reservations={reservations} />
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

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        isSubmitting={isChangingPassword}
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePassword}
      />

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

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-outline-variant bg-white/95 shadow-[0_-12px_40px_-30px_rgba(72,58,34,0.34)] md:hidden">
        <a href="/catalog" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant">
          <i className="fa-solid fa-box-archive"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Catalog</span>
        </a>
        <a href="/reading-lists" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant">
          <i className="fa-solid fa-bookmark"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Saved</span>
        </a>
        <a href="/notifications" className="flex flex-col items-center justify-center gap-1 text-on-surface-variant">
          <i className="fa-solid fa-bell"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
        </a>
        <a href="/profile" className="flex flex-col items-center justify-center gap-1 text-primary">
          <i className="fa-solid fa-gear"></i>
          <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
        </a>
      </nav>
    </div>
  );
}
