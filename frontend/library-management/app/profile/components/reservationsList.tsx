import React from 'react';
import { RoomReservation } from '../types';

interface ReservationsListProps {
  reservations: RoomReservation[];
}

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations }) => {
  if (reservations.length === 0) return null;

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-3 font-headline text-2xl font-black text-slate-950">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600"><i className="fa-solid fa-door-open"></i></span> Upcoming Reservations
      </h2>

      {reservations.map((room) => (
        <div key={room.id} className="rounded-[1.75rem] border border-red-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_18px_55px_-38px_rgba(153,27,27,0.55)]">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex h-32 w-full flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-red-600 text-white shadow-inner md:w-32">
              <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-90">Room</p>
              <p className="text-2xl font-black font-headline mt-1 text-center px-3">{room.roomName}</p>
            </div>

            <div className="flex-1 w-full text-center md:text-left">
              <div>
                <h3 className="text-lg font-black text-slate-950">Upcoming booking</h3>
                <p className="mt-1 text-sm text-slate-500">{room.roomDescription || 'Study room reservation'}</p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 rounded-2xl bg-red-50/70 p-4 md:grid-cols-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Date</p>
                  <p className="mt-1 font-black text-slate-950">{room.bookingDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Time</p>
                  <p className="mt-1 font-black text-slate-950">{room.startTime} - {room.endTime}</p>
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
