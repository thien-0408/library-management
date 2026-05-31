import React from 'react';
import { RoomReservation } from '../types';

interface ReservationsListProps {
  reservations: RoomReservation[];
}

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations }) => {
  if (reservations.length === 0) return null;

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-3 border-b border-outline-variant pb-3 font-headline text-2xl font-black text-on-surface">
        <span className="grid h-8 w-8 place-items-center rounded bg-primary-container text-sm text-primary"><i className="fa-solid fa-door-open"></i></span> 
        Upcoming Reservations
      </h2>

      <div className="grid gap-5">
        {reservations.map((room) => (
          <div key={room.id} className="rounded-xl border border-outline-variant bg-[var(--catalog-panel)] p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex h-28 w-full shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-on-primary shadow-inner md:w-28">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Room</p>
                <p className="mt-1 px-2 text-center font-headline text-xl font-black">{room.roomName}</p>
              </div>

              <div className="flex-1 w-full text-center md:text-left">
                <div>
                  <h3 className="text-base font-black text-on-surface">Room Booking</h3>
                  <p className="mt-1 text-xs font-medium text-on-surface-variant">{room.roomDescription || 'Study room reservation'}</p>
                </div>

                <div className="mt-4 inline-flex items-center gap-3 rounded border border-outline-variant bg-surface-variant/50 px-4 py-2 text-sm">
                  <i className="fa-regular fa-clock text-primary"></i>
                  <span className="font-bold text-on-surface">{room.startTime} - {room.endTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationsList;
