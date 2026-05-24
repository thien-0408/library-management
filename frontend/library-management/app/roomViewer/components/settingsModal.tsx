import React, { useState, useEffect } from 'react';
import { OperatingHours } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHours: OperatingHours;
  onSave: (payload: OperatingHours) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialHours, onSave }) => {
  const [openTime, setOpenTime] = useState(initialHours.openTime);
  const [closeTime, setCloseTime] = useState(initialHours.closeTime);

  // Cập nhật local state nếu initialHours thay đổi từ outside
  useEffect(() => {
    setOpenTime(initialHours.openTime);
    setCloseTime(initialHours.closeTime);
  }, [initialHours]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ openTime, closeTime });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline font-bold text-xl">Operating Hours</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center hover:bg-error/10 hover:text-error rounded-full transition-colors text-slate-400">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <p className="text-sm text-on-surface-variant mb-4">
            Set the global operating hours for all rooms. Users will only be able to book within this timeframe.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Opening Time</label>
              <input required value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3 px-4" type="time" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Closing Time</label>
              <input required value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3 px-4" type="time" />
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" className="w-full py-4 vibrant-gradient-bg text-white rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-md">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
