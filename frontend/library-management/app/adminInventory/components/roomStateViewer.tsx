import React from 'react';
import { RoomState } from '../types';

interface TimeSlotOption {
  id: string;
  startTime: string;
  endTime: string;
}

interface RoomStateViewerProps {
  rooms: RoomState[];
  timeSlots: TimeSlotOption[];
  selectedTimeSlotId: string;
  onTimeSlotChange: (timeSlotId: string) => void;
}

const getRoomColor = (status: RoomState['status']) => {
  if (status === 'Light') return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', num: 'text-emerald-600', dot: 'bg-emerald-500' };
  if (status === 'Moderate') return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', num: 'text-amber-600', dot: 'bg-amber-400' };
  return { bg: 'bg-error-container', border: 'border-error-container', text: 'text-on-error-container', num: 'text-on-error-container', dot: 'bg-error' };
};

const RoomStateViewer: React.FC<RoomStateViewerProps> = ({ rooms, timeSlots, selectedTimeSlotId, onTimeSlotChange }) => {
  return (
    <div className="rounded-[2rem] border border-outline-variant bg-[var(--catalog-panel)] p-8 shadow-soft-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="font-headline text-xl font-black text-on-surface">Room State Viewer</h3>
          <p className="mt-1 text-sm font-medium text-on-surface-variant">Study room occupancy by reusable time slot</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={selectedTimeSlotId} onChange={(e) => onTimeSlotChange(e.target.value)} className="rounded-2xl border border-outline-variant bg-white/80 px-3 py-2 text-sm font-bold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/15">
            {timeSlots.map(slot => (
              <option key={slot.id} value={slot.id}>{slot.startTime} - {slot.endTime}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        {rooms.map(room => {
          const colors = getRoomColor(room.status);
          return (
            <div key={room.id} className={`p-6 rounded-2xl border flex flex-col items-center justify-center transition-all hover:shadow-md hover:-translate-y-1 ${colors.bg} ${colors.border}`}>
              <span className={`font-headline font-bold ${colors.text}`}>{room.name}</span>
              <span className={`text-4xl font-black mt-2 ${colors.num}`}>{room.occupied}/{room.capacity}</span>
              <span className={`text-[10px] uppercase font-bold tracking-[0.15em] opacity-70 mt-2 ${colors.text}`}>
                {room.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomStateViewer;
