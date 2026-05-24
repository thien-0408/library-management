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
    } catch (err: any) {
      setAvailableRooms([]);
      setSelectedRoomId('');
      setError(err.data?.message || err.message || 'Failed to load room availability');
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
    } catch (err: any) {
      setError(err.data?.message || err.message || 'Failed to load booking data');
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
    } catch (err: any) {
      const message = err.data?.message || err.message || 'Failed to create reservation';
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
    } catch (err: any) {
      setError(err.data?.message || err.message || `Failed to ${action} reservation`);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <Header />
      <main className="app-shell-main app-shell-content page-shell px-6 md:px-8 xl:px-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="font-headline font-extrabold text-4xl tracking-tight">Book a Study Room</h1>
          <p className="text-on-surface-variant mt-3 text-lg font-medium">
            Choose a date and time first, then reserve from rooms that are actually available.
          </p>
        </div>

        {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600 font-semibold">{error}</div>}
        {successMessage && <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700 font-semibold">{successMessage}</div>}

        {upcoming && (
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="font-headline font-bold text-xl mb-2">Upcoming Reservation</h2>
                <p className="font-semibold">{upcoming.roomName} on {upcoming.bookingDate}, {upcoming.startTime} - {upcoming.endTime}</p>
                {upcoming.accessCode && (
                  <p className="mt-2 inline-flex rounded-lg bg-white px-3 py-2 text-sm font-bold text-primary">
                    Access code: {upcoming.accessCode}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {canConfirmUpcoming(upcoming) && (
                  <button
                    onClick={() => handleUpcomingAction('confirm')}
                    className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-bold"
                  >
                    Confirm
                  </button>
                )}
                {canCancelUpcoming(upcoming) && (
                  <button
                    onClick={() => handleUpcomingAction('cancel')}
                    className="px-4 py-2 rounded-lg bg-amber-100 text-amber-700 font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={createReservation} className="bg-white border border-outline-variant rounded-2xl p-6 shadow-sm mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date</span>
              <input
                type="date"
                value={bookingDate}
                min={todayString()}
                onChange={(e) => {
                  void handleDateChange(e.target.value);
                }}
                className="w-full rounded-xl border-outline-variant px-4 py-3"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Time slot</span>
              <select
                value={selectedTimeSlotId}
                onChange={(e) => {
                  void handleTimeSlotChange(e.target.value);
                }}
                className="w-full rounded-xl border-outline-variant px-4 py-3"
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
                <h2 className="font-headline font-bold text-xl">Available Rooms</h2>
                <p className="text-sm text-on-surface-variant mt-1">Pick from rooms with seats left for the selected slot.</p>
              </div>
              {isLoadingAvailability && <SkeletonBlock className="h-4 w-36" />}
            </div>

            {isLoading ? (
              <CardGridSkeleton count={6} />
            ) : availableRooms.length === 0 ? (
              <div className="rounded-2xl border border-outline-variant bg-surface-variant/20 p-8 text-center text-on-surface-variant font-semibold">
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
                          ? 'border-outline-variant/40 bg-surface-variant/20 opacity-60 cursor-not-allowed'
                          : isSelected
                            ? 'border-primary bg-primary/5 shadow-md'
                            : 'border-outline-variant hover:border-primary/40 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-on-surface">{room.name}</h3>
                          <p className="text-sm text-on-surface-variant mt-1">{room.description || 'Study room'}</p>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider ${room.isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {room.isFull ? 'Full' : 'Available'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.1em]">Capacity</p>
                          <p className="font-bold text-on-surface mt-1">{room.capacity}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-[0.1em]">Seats left</p>
                          <p className="font-bold text-on-surface mt-1">{room.seatsLeft}</p>
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
              className="vibrant-gradient-bg text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
