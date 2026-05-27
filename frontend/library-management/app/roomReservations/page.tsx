'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/header';
import Toast from '@/components/toast_notification';
import { CardGridSkeleton, SkeletonBlock } from '@/components/skeleton_loader';
import { useToast } from '@/hooks/useToast';
import { roomBookingApi } from '@/lib/room-booking-api';
import type {
  RoomAvailabilityResponseDto as RoomAvailability,
  TimeSlotResponseDto as TimeSlot,
  UpcomingReservationResponseDto as UpcomingReservation,
} from '@/lib/room-booking-types';

const todayString = () => new Date().toISOString().slice(0, 10);

const isToday = (date: string) => date === todayString();

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

const isExpiredSlot = (date: string, slot: TimeSlot) => {
  if (!isToday(date)) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return toMinutes(slot.startTime) <= currentMinutes;
};

const canCancelUpcoming = (reservation: UpcomingReservation) => {
  const bookingDate = new Date(`${reservation.bookingDate}T00:00:00`);
  const now = new Date();
  if (bookingDate < new Date(`${todayString()}T00:00:00`)) return false;

  if (!isToday(reservation.bookingDate)) return true;
  return now.getTime() < new Date(`${reservation.bookingDate}T${reservation.startTime}`).getTime();
};

const canConfirmUpcoming = (reservation: UpcomingReservation) => {
  if (!isToday(reservation.bookingDate)) return false;

  const now = new Date();
  const start = new Date(`${reservation.bookingDate}T${reservation.startTime}`);
  const end = new Date(start.getTime() + 10 * 60 * 1000);
  return now >= start && now <= end;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object') {
    const maybeError = error as { data?: { message?: string }; message?: string };
    return maybeError.data?.message || maybeError.message || fallback;
  }

  return fallback;
};

export default function RoomReservationsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailability[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingReservation | null>(null);
  const [bookingDate, setBookingDate] = useState(todayString());
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { toastConfig, showToast, hideToast } = useToast();

  const visibleTimeSlots = useMemo(
    () => timeSlots.filter((slot) => !isExpiredSlot(bookingDate, slot)),
    [bookingDate, timeSlots],
  );

  const loadAvailability = async (date: string, timeSlotId: string) => {
    if (!timeSlotId) {
      setAvailableRooms([]);
      setSelectedRoomId('');
      return;
    }

    setIsLoadingAvailability(true);
    setError('');

    try {
      const rooms = await roomBookingApi.getRoomAvailability(date, timeSlotId);
      const selectableRooms = (rooms || []).filter((room) => !room.isFull);
      setAvailableRooms(rooms || []);
      setSelectedRoomId((prev) => {
        if (prev && selectableRooms.some((room) => room.id === prev)) return prev;
        return selectableRooms[0]?.id || '';
      });
    } catch (err) {
      setAvailableRooms([]);
      setSelectedRoomId('');
      setError(getErrorMessage(err, 'Failed to load room availability'));
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const syncSelectionForDate = async (date: string, slots: TimeSlot[], preferredSlotId?: string) => {
    const validSlots = slots.filter((slot) => !isExpiredSlot(date, slot));
    const nextTimeSlotId = preferredSlotId && validSlots.some((slot) => slot.id === preferredSlotId)
      ? preferredSlotId
      : validSlots[0]?.id || '';

    setSelectedTimeSlotId(nextTimeSlotId);

    if (nextTimeSlotId) {
      await loadAvailability(date, nextTimeSlotId);
    } else {
      setAvailableRooms([]);
      setSelectedRoomId('');
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [timeSlotsRes, upcomingRes] = await Promise.all([
        roomBookingApi.getTimeSlots(),
        roomBookingApi.getUpcomingReservation().catch(() => null),
      ]);

      const loadedTimeSlots = timeSlotsRes || [];
      setTimeSlots(loadedTimeSlots);
      setUpcoming(upcomingRes);
      await syncSelectionForDate(bookingDate, loadedTimeSlots, selectedTimeSlotId);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load booking data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadInitialData();
  }, []);

  const handleDateChange = async (date: string) => {
    setBookingDate(date);
    setSuccessMessage('');
    await syncSelectionForDate(date, timeSlots, selectedTimeSlotId);
  };

  const handleTimeSlotChange = async (timeSlotId: string) => {
    setSelectedTimeSlotId(timeSlotId);
    setSuccessMessage('');
    await loadAvailability(bookingDate, timeSlotId);
  };

  const hasVisibleTimeSlots = visibleTimeSlots.length > 0;

  const createReservation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRoomId || !selectedTimeSlotId) return;

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      await roomBookingApi.createReservation({
        bookingDate,
        roomId: selectedRoomId,
        timeSlotId: selectedTimeSlotId,
      });
      setSuccessMessage('Reservation created successfully.');
      showToast('Reservation created', 'Your study room booking was created successfully.', 'success');
      await loadInitialData();
      await loadAvailability(bookingDate, selectedTimeSlotId);
    } catch (err) {
      const message = getErrorMessage(err, 'Failed to create reservation');
      setError(message);
      showToast('Reservation failed', message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpcomingAction = async (action: 'confirm' | 'cancel') => {
    if (!upcoming) return;

    setError('');
    setSuccessMessage('');

    try {
      if (action === 'confirm') {
        await roomBookingApi.confirmReservation(upcoming.id);
        setSuccessMessage('Reservation confirmed successfully.');
        showToast('Reservation confirmed', 'Your reservation was confirmed successfully.', 'success');
      } else {
        await roomBookingApi.cancelReservation(upcoming.id);
        setSuccessMessage('Reservation cancelled successfully.');
        showToast('Reservation cancelled', 'Your reservation was cancelled successfully.', 'info');
      }

      await loadInitialData();
      if (selectedTimeSlotId) {
        await loadAvailability(bookingDate, selectedTimeSlotId);
      }
    } catch (err) {
      setError(getErrorMessage(err, `Failed to ${action} reservation`));
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f7] font-body text-slate-950">
      <Header />
      <main className="app-shell-main app-shell-content page-shell mx-auto max-w-7xl px-5 pb-16 md:px-8 xl:px-10">
        <div className="relative mb-8 overflow-hidden rounded-[2.25rem] border border-red-100 bg-white px-6 py-8 shadow-[0_24px_80px_-48px_rgba(153,27,27,0.45)] sm:px-8 lg:px-10">
          <div className="absolute right-[-5rem] top-[-6rem] h-72 w-72 rounded-full bg-red-200/55 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Study room booking
              </div>
              <h1 className="mt-5 max-w-3xl font-headline text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-6xl">Book a focused study room.</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
                Choose a date and time, then reserve from rooms that are actually available for your selected slot.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-red-100 bg-red-50/70 p-5 text-center">
              <p className="text-4xl font-black text-red-700">{availableRooms.filter((room) => !room.isFull).length}</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Rooms selectable</p>
            </div>
          </div>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-100 bg-white p-4 font-bold text-red-700 shadow-sm">{error}</div>}
        {successMessage && <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-700">{successMessage}</div>}

        {upcoming && (
          <div className="mb-8 rounded-[2rem] border border-red-100 bg-white p-6 shadow-[0_18px_55px_-42px_rgba(153,27,27,0.55)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="mb-2 font-headline text-xl font-black text-slate-950">Upcoming Reservation</h2>
                <p className="font-bold text-slate-600">{upcoming.roomName} on {upcoming.bookingDate}, {upcoming.startTime} - {upcoming.endTime}</p>
                {upcoming.accessCode && (
                  <p className="mt-3 inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
                    Access code: {upcoming.accessCode}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {canConfirmUpcoming(upcoming) && (
                  <button
                    onClick={() => handleUpcomingAction('confirm')}
                    className="rounded-full bg-emerald-100 px-4 py-2 font-black text-emerald-700"
                  >
                    Confirm
                  </button>
                )}
                {canCancelUpcoming(upcoming) && (
                  <button
                    onClick={() => handleUpcomingAction('cancel')}
                    className="rounded-full bg-amber-100 px-4 py-2 font-black text-amber-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={createReservation} className="mb-8 space-y-6 rounded-[2rem] border border-red-100 bg-white p-6 shadow-[0_18px_55px_-42px_rgba(153,27,27,0.55)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Date</span>
              <input
                type="date"
                value={bookingDate}
                min={todayString()}
                onChange={(e) => {
                  void handleDateChange(e.target.value);
                }}
                className="w-full rounded-2xl border border-red-100 px-4 py-3 font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Time slot</span>
              <select
                value={selectedTimeSlotId}
                onChange={(e) => {
                  void handleTimeSlotChange(e.target.value);
                }}
                className="w-full rounded-2xl border border-red-100 px-4 py-3 font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10"
                required
              >
                {!hasVisibleTimeSlots ? (
                  <option value="">No valid time slots</option>
                ) : (
                  visibleTimeSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.startTime} - {slot.endTime}
                    </option>
                  ))
                )}
              </select>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 gap-4">
              <div>
                <h2 className="font-headline text-xl font-black text-slate-950">Available Rooms</h2>
                <p className="mt-1 text-sm font-medium text-slate-500">Pick from rooms with seats left for the selected slot.</p>
              </div>
              {isLoadingAvailability && <SkeletonBlock className="h-4 w-36" />}
            </div>

            {isLoading ? (
              <CardGridSkeleton count={6} />
            ) : availableRooms.length === 0 ? (
              <div className="rounded-2xl border border-red-100 bg-red-50/60 p-8 text-center font-bold text-slate-500">
                No rooms available for this selection.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {availableRooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => !room.isFull && setSelectedRoomId(room.id)}
                      disabled={room.isFull}
                      className={`text-left rounded-2xl border p-5 transition-all ${
                        room.isFull
                          ? 'cursor-not-allowed border-red-100 bg-red-50/40 opacity-60'
                          : isSelected
                            ? 'border-red-300 bg-red-50 shadow-md shadow-red-100'
                            : 'border-red-100 bg-white hover:-translate-y-1 hover:border-red-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-950">{room.name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{room.description || 'Study room'}</p>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${room.isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {room.isFull ? 'Full' : 'Available'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Capacity</p>
                          <p className="mt-1 font-black text-slate-950">{room.capacity}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">Seats left</p>
                          <p className="mt-1 font-black text-slate-950">{room.seatsLeft}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedRoomId || !selectedTimeSlotId || isSubmitting || isLoadingAvailability}
              className="rounded-full bg-red-600 px-7 py-3 font-black text-white shadow-lg shadow-red-100 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Booking...' : 'Reserve Room'}
            </button>
          </div>
        </form>
      </main>

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />
    </div>
  );
}
