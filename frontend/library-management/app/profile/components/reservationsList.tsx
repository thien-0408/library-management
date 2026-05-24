import React from 'react';
import { RoomReservation } from '../types';

interface ReservationsListProps {
  reservations: RoomReservation[];
}

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations }) => {
  if (reservations.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline flex items-center gap-3 mb-6">
        <i className="fa-solid fa-door-open text-primary"></i> Upcoming Reservations
      </h2>

      {reservations.map((room) => (
        <div key={room.id} className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0 w-full md:w-32 h-32 vibrant-gradient-bg rounded-xl flex flex-col items-center justify-center text-white shadow-inner">
              <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-90">Room</p>
              <p className="text-2xl font-black font-headline mt-1 text-center px-3">{room.roomName}</p>
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <div>
                <h3 className="text-lg font-bold text-on-surface">Upcoming booking</h3>
                <p className="text-on-surface-variant text-sm mt-1">{room.roomDescription || 'Study room reservation'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-surface-variant/30 p-4 rounded-xl">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.1em]">Date</p>
                  <p className="font-bold text-on-surface mt-1">{room.bookingDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.1em]">Time</p>
                  <p className="font-bold text-on-surface mt-1">{room.startTime} - {room.endTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationsList;
