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
  selectedDate: string;
  selectedTimeSlotId: string;
  onDateChange: (date: string) => void;
  onTimeSlotChange: (timeSlotId: string) => void;
}

const getRoomColor = (status: RoomState['status']) => {
  if (status === 'Light') return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', num: 'text-emerald-600', dot: 'bg-emerald-500' };
  if (status === 'Moderate') return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', num: 'text-amber-600', dot: 'bg-amber-400' };
  return { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-900', num: 'text-rose-600', dot: 'bg-rose-500' };
};

const RoomStateViewer: React.FC<RoomStateViewerProps> = ({ rooms, timeSlots, selectedDate, selectedTimeSlotId, onDateChange, onTimeSlotChange }) => {
  return (
    <div className="bg-white border border-outline-variant rounded-2xl p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="font-headline font-bold text-xl">Room State Viewer</h3>
          <p className="text-sm font-medium text-on-surface-variant mt-1">Real-time study room occupancy monitoring</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="date" value={selectedDate} onChange={(e) => onDateChange(e.target.value)} className="rounded-xl border border-outline-variant px-3 py-2 text-sm font-semibold" />
          <select value={selectedTimeSlotId} onChange={(e) => onTimeSlotChange(e.target.value)} className="rounded-xl border border-outline-variant px-3 py-2 text-sm font-semibold">
            {timeSlots.map(slot => (
              <option key={slot.id} value={slot.id}>{slot.startTime} - {slot.endTime}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
