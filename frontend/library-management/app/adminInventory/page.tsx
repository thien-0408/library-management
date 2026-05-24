'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import Toast from '@/components/toast_notification';
import ConfirmModal from '@/components/confirm_modal';
import { CardGridSkeleton } from '@/components/skeleton_loader';
import { useToast } from '@/hooks/useToast';
import { useAdminInventory } from '@/app/adminInventory/hooks/useAdminInventory';
import { AddBookPayload, InventoryBook } from '@/app/adminInventory/types';

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
    selectedDate,
    selectedTimeSlotId,
    setSelectedDate,
    setSelectedTimeSlotId,
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

  const onApprove = async (req: any) => {
    const success = await handleApproveRequest(req);
    if (success) {
      addNotification('Request Approved', `You approved ${req.userName}'s request for "${req.bookTitle}".`, 'success');
    }
  };

  const onReject = async (req: any) => {
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
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <Header />

      <main className="app-shell-main app-shell-content page-shell px-6 md:px-8 xl:px-10 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-14">
          <div>
            <h1 className="font-headline font-extrabold text-4xl tracking-tight text-on-surface">Catalog Management</h1>
            <p className="text-on-surface-variant mt-3 max-w-xl text-lg font-medium leading-relaxed">
              Manage the library's physical collection, approve borrow requests, and monitor study room capacity in real-time.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="vibrant-gradient-bg text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:brightness-110 transition-all active:scale-95"
          >
            <i className="fa-solid fa-plus text-lg"></i>
            <span>New Book</span>
          </button>
        </div>

        {error && (
            <div className="text-center py-5 bg-red-50 text-red-600 rounded-2xl mb-8 border border-red-200">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
            </div>
        )}

        {isLoading ? (
            <CardGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT COLUMN */}
            <div className="col-span-12 lg:col-span-8 space-y-10">
              <InventoryTable inventory={inventory} onEditBook={openEditModal} onDeleteBook={setBookToDelete} />
              <RoomStateViewer
                rooms={rooms}
                timeSlots={timeSlots}
                selectedDate={selectedDate}
                selectedTimeSlotId={selectedTimeSlotId}
                onDateChange={setSelectedDate}
                onTimeSlotChange={setSelectedTimeSlotId}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-span-12 lg:col-span-4 space-y-10">
              <RequestQueue requests={requests} onApprove={onApprove} onReject={onReject} />
              
              {/* Traffic Chart */}
              <div className="vibrant-gradient-bg rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                  <div className="relative z-10">
                      <h4 className="font-headline font-bold text-xl">Today's Traffic</h4>
                      <p className="text-white/80 text-sm mt-1 font-medium">Peak hours expected at 4:00 PM</p>
                      <div className="flex items-end gap-3 h-28 mt-8">
                          <div className="w-full bg-white/20 rounded-t-md h-[40%] group-hover:h-[60%] transition-all duration-500"></div>
                          <div className="w-full bg-white/30 rounded-t-md h-[70%] group-hover:h-[80%] transition-all duration-500 delay-75"></div>
                          <div className="w-full bg-white/40 rounded-t-md h-[30%] group-hover:h-[45%] transition-all duration-500 delay-100"></div>
                          <div className="w-full bg-white rounded-t-md h-[95%] group-hover:h-full transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                          <div className="w-full bg-white/60 rounded-t-md h-[60%] group-hover:h-[75%] transition-all duration-500 delay-200"></div>
                          <div className="w-full bg-white/30 rounded-t-md h-[45%] group-hover:h-[55%] transition-all duration-500 delay-300"></div>
                      </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
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
