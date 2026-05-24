import React, { useEffect, useState } from 'react';
import { AddRoomPayload, Room } from '../types';

interface AddRoomModalProps {
  isOpen: boolean;
  room?: Room | null;
  onClose: () => void;
  onSaveRoom: (payload: AddRoomPayload) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, room, onClose, onSaveRoom }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(4);
  const isEditMode = Boolean(room);

  useEffect(() => {
    if (!isOpen) return;

    setName(room?.name || '');
    setDescription(room?.description || '');
    setCapacity(room?.capacity ?? 4);
  }, [isOpen, room]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRoom({ name, description, capacity });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline font-bold text-2xl">{isEditMode ? 'Edit Room' : 'Add New Room'}</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-error/10 hover:text-error rounded-full transition-colors text-slate-400">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Room Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" placeholder="e.g. Quiet Room 1" type="text" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" placeholder="e.g. Silent study space" type="text" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Capacity</label>
            <input required value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" type="number" min="0" />
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-outline-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-variant transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-4 vibrant-gradient-bg text-white rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-md">
              {isEditMode ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
