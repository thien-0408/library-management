'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import Toast from '@/components/toast_notification';
import ConfirmModal from '@/components/confirm_modal';
import { CardGridSkeleton } from '@/components/skeleton_loader';
import { useToast } from '@/hooks/useToast';
import { useRoomViewer } from '@/app/roomViewer/hooks/useRoomViewer';
import { AddRoomPayload, Room } from '@/app/roomViewer/types';

import RoomGrid from '@/app/roomViewer/components/roomGrid';
import AddRoomModal from '@/app/roomViewer/components/addRoomModal';

export default function AdminRoomViewerPage() {
  const {
    rooms,
    isLoading,
    error,
    handleDeleteRoom,
    handleAddRoom,
    handleUpdateRoom,
  } = useRoomViewer();

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const { toastConfig, showToast, hideToast } = useToast();

  const addNotification = (title: string, description: string, type: 'success' | 'error' | 'info') => {
    showToast(title, description, type);
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setIsRoomModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setIsRoomModalOpen(true);
  };

  const closeRoomModal = () => {
    setEditingRoom(null);
    setIsRoomModalOpen(false);
  };

  const onDeleteRoom = async () => {
    if (!roomToDelete) return;

    const success = await handleDeleteRoom(roomToDelete.id);
    if (success) {
      addNotification('Room Deleted', `${roomToDelete.name} has been removed from the system.`, 'info');
      setRoomToDelete(null);
    }
  };

  const onSaveRoom = async (payload: AddRoomPayload) => {
    const success = editingRoom
      ? await handleUpdateRoom(editingRoom.id, payload)
      : await handleAddRoom(payload);

    if (success) {
      closeRoomModal();
      addNotification(
        editingRoom ? 'Room Updated' : 'Room Added',
        editingRoom ? 'Room details have been updated.' : 'New room has been successfully created.',
        'success'
      );
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <Header />

      <main className="app-shell-main app-shell-content page-shell px-6 md:px-8 xl:px-10 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-12">
          <div>
            <h1 className="font-headline font-extrabold text-4xl tracking-tight text-on-surface">
              Room Management
            </h1>
            <p className="text-on-surface-variant mt-3 max-w-xl text-lg font-medium leading-relaxed">
              Add, update, and remove library rooms for reservation and availability tracking.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="vibrant-gradient-bg text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:brightness-110 transition-all active:scale-95"
          >
            <i className="fa-solid fa-plus text-lg"></i>
            <span>New Room</span>
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
          <RoomGrid rooms={rooms} onEditRoom={openEditModal} onDeleteRoom={(id, name) => setRoomToDelete({ id, name, description: '', capacity: 0 })} />
        )}
      </main>

      <AddRoomModal
        isOpen={isRoomModalOpen}
        room={editingRoom}
        onClose={closeRoomModal}
        onSaveRoom={onSaveRoom}
      />

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />

      <ConfirmModal
        isOpen={Boolean(roomToDelete)}
        title="Delete this room?"
        description={roomToDelete ? `${roomToDelete.name} will be removed from room management.` : ''}
        confirmLabel="Delete room"
        variant="danger"
        onCancel={() => setRoomToDelete(null)}
        onConfirm={() => void onDeleteRoom()}
      />
    </div>
  );
}
