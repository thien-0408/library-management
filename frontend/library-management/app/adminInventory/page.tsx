'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import Toast from '@/components/toast_notification';
import ConfirmModal from '@/components/confirm_modal';
import { CardGridSkeleton } from '@/components/skeleton_loader';
import { useToast } from '@/hooks/useToast';
import { useAdminInventory } from '@/app/adminInventory/hooks/useAdminInventory';
import { AddBookPayload, InventoryBook, PendingRequest } from '@/app/adminInventory/types';

// Import extracted components
import InventoryTable from '@/app/adminInventory/components/inventoryTable';
import RoomStateViewer from '@/app/adminInventory/components/roomStateViewer';
import RequestQueue from '@/app/adminInventory/components/requestQueue';
import AddBookModal from '@/app/adminInventory/components/addBookModal';

export default function AdminInventoryPage() {
  const {
    inventory,
    requests,
    rooms,
    timeSlots,
    selectedTimeSlotId,
    setSelectedTimeSlotId,
    stats,
    isLoading,
    error,
    handleApproveRequest,
    handleRejectRequest,
    handleAddBook,
    handleUpdateBook,
    handleDeleteBook
  } = useAdminInventory();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<InventoryBook | null>(null);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);
  const { toastConfig, showToast, hideToast } = useToast();
  const addNotification = (title: string, description: string, type: 'success' | 'error' | 'info') => {
    showToast(title, description, type);
  };

  const onApprove = async (req: PendingRequest) => {
    const success = await handleApproveRequest(req);
    if (success) {
      addNotification('Request Approved', `You approved ${req.userName}'s request for "${req.bookTitle}".`, 'success');
    }
  };

  const onReject = async (req: PendingRequest) => {
    const success = await handleRejectRequest(req);
    if (success) {
      addNotification('Request Rejected', `You rejected ${req.userName}'s request.`, 'error');
    }
  };

  const openAddModal = () => {
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const openEditModal = (book: InventoryBook) => {
    setEditingBook(book);
    setIsBookModalOpen(true);
  };

  const closeBookModal = () => {
    setEditingBook(null);
    setIsBookModalOpen(false);
  };

  const onSaveBook = async (payload: AddBookPayload) => {
    const success = editingBook
      ? await handleUpdateBook(editingBook.isbn, payload)
      : await handleAddBook(payload);

    if (success) {
      closeBookModal();
      addNotification(
        editingBook ? 'Book Updated' : 'Book Added',
        editingBook ? 'Book details have been updated.' : 'New book has been successfully added to the inventory.',
        'success'
      );
    } else {
      addNotification('Save Failed', 'Could not save the book. Please check the form and try again.', 'error');
    }
  };

  const onDeleteBook = async () => {
    if (!bookToDelete) return;

    const success = await handleDeleteBook(bookToDelete);
    if (success) {
      setBookToDelete(null);
      addNotification('Book Removed', 'The book has been deleted from inventory.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] font-body text-on-surface">
      <Header />

      <main className="app-shell-main app-shell-content page-shell mx-auto max-w-[1600px] px-5 pb-16 md:px-8 xl:px-10">
        <div className="relative mb-10 overflow-hidden rounded-[2.25rem] border border-outline-variant bg-white px-6 py-8 shadow-soft-card sm:px-8 lg:px-10">
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-primary-container px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-on-primary-container">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Admin command
              </div>
              <h1 className="mt-5 font-headline text-5xl font-black leading-[0.95] tracking-[-0.055em] text-on-surface">Catalog Management</h1>
              <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-on-surface-variant">
                Manage the library physical collection, approve borrow requests, and monitor study room capacity in real time.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2.5 rounded-full bg-primary px-6 py-3.5 font-black text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-[#274c42] active:scale-95"
            >
              <i className="fa-solid fa-plus text-lg"></i>
              <span>New Book</span>
            </button>
          </div>
        </div>

        {error && (
            <div className="mb-8 rounded-[1.5rem] border border-error-container bg-error-container px-6 py-5 text-center font-bold text-on-error-container shadow-sm">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
            </div>
        )}

        {isLoading ? (
            <CardGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* LEFT COLUMN */}
            <div className="col-span-12 space-y-8 lg:col-span-8">
              <InventoryTable inventory={inventory} onEditBook={openEditModal} onDeleteBook={setBookToDelete} />
              <RoomStateViewer
                rooms={rooms}
                timeSlots={timeSlots}
                selectedTimeSlotId={selectedTimeSlotId}
                onTimeSlotChange={setSelectedTimeSlotId}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-12 space-y-8 lg:col-span-4">
              <RequestQueue requests={requests} onApprove={onApprove} onReject={onReject} />

              {/* Dashboard Stats */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] bg-white p-6 shadow-sm border border-outline-variant">
                  <p className="text-sm font-bold text-on-surface-variant">Active Users</p>
                  <p className="mt-2 text-3xl font-black text-on-surface">{stats?.activeUsers || 0}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-6 shadow-sm border border-outline-variant">
                  <p className="text-sm font-bold text-on-surface-variant">Total Books</p>
                  <p className="mt-2 text-3xl font-black text-on-surface">{stats?.totalBooks || 0}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-6 shadow-sm border border-outline-variant">
                  <p className="text-sm font-bold text-on-surface-variant">Borrowed Books</p>
                  <p className="mt-2 text-3xl font-black text-on-surface">{stats?.borrowedBooks || 0}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white p-6 shadow-sm border border-outline-variant">
                  <p className="text-sm font-bold text-on-surface-variant">Total Reviews</p>
                  <p className="mt-2 text-3xl font-black text-on-surface">{stats?.totalBookReviews || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AddBookModal
        isOpen={isBookModalOpen}
        book={editingBook}
        onClose={closeBookModal}
        onSaveBook={onSaveBook}
      />

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />

      <ConfirmModal
        isOpen={Boolean(bookToDelete)}
        title="Delete this book?"
        description="This will remove the book from inventory. This action cannot be undone."
        confirmLabel="Delete book"
        variant="danger"
        onCancel={() => setBookToDelete(null)}
        onConfirm={() => void onDeleteBook()}
      />
    </div>
  );
}
