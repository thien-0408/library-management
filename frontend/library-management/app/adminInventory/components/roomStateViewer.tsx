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
    <div className="rounded-[2rem] border border-red-100 bg-white p-8 shadow-[0_18px_55px_-42px_rgba(153,27,27,0.55)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="font-headline text-xl font-black text-slate-950">Room State Viewer</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">Real-time study room occupancy monitoring</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="date" value={selectedDate} onChange={(e) => onDateChange(e.target.value)} className="rounded-2xl border border-red-100 px-3 py-2 text-sm font-bold text-slate-600 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10" />
          <select value={selectedTimeSlotId} onChange={(e) => onTimeSlotChange(e.target.value)} className="rounded-2xl border border-red-100 px-3 py-2 text-sm font-bold text-slate-600 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10">
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
