import React from 'react';
import { Room } from '../types';

interface RoomGridProps {
  rooms: Room[];
  onEditRoom: (room: Room) => void;
  onDeleteRoom: (id: string, name: string) => void;
}

const RoomGrid: React.FC<RoomGridProps> = ({ rooms, onEditRoom, onDeleteRoom }) => {
  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/50 p-10 text-center text-on-surface-variant font-semibold shadow-sm">
        No rooms available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white rounded-2xl p-6 border border-outline-variant/50 transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-md"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner bg-primary/10 text-primary">
              <i className="fa-solid fa-door-open"></i>
            </div>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              Active
            </span>
          </div>

          <h3 className="font-extrabold text-xl mb-1 text-on-surface">{room.name}</h3>
          <p className="text-sm text-on-surface-variant font-medium mb-5">{room.description || 'General room'}</p>

          <div className="flex items-center gap-2 mb-6">
            <i className="fa-solid fa-chair text-on-surface-variant/50"></i>
            <span className="text-sm font-bold text-on-surface-variant">Capacity: {room.capacity} seats</span>
          </div>

          <div className="flex gap-3 mt-auto pt-4 border-t border-outline-variant/30">
            <button
              onClick={() => onEditRoom(room)}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
            >
              <i className="fa-solid fa-pen"></i>
              Edit Room
            </button>

            <button
              onClick={() => onDeleteRoom(room.id, room.name)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-variant text-on-surface-variant hover:bg-error hover:text-white transition-all"
              title="Delete Room"
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomGrid;
