"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import Toast from "@/components/toast_notification";
import { CardGridSkeleton, SkeletonBlock } from "@/components/skeleton_loader";
import { useToast } from "@/hooks/useToast";
import { roomBookingApi } from "@/lib/room-booking-api";
import type {
  RoomAvailabilityResponseDto as RoomAvailability,
  TimeSlotResponseDto as TimeSlot,
  UpcomingReservationResponseDto as UpcomingReservation,
  RoomReservationResponseDto,
} from "@/lib/room-booking-types";

const todayString = () => new Date().toISOString().slice(0, 10);

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const canCancelUpcoming = (reservation: UpcomingReservation) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return currentMinutes < toMinutes(reservation.startTime);
};

const canConfirmUpcoming = (reservation: UpcomingReservation) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = toMinutes(reservation.startTime);
  return currentMinutes >= startMinutes && currentMinutes <= startMinutes + 10;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const maybeError = error as {
      data?: { message?: string };
      message?: string;
    };
    return maybeError.data?.message || maybeError.message || fallback;
  }

  return fallback;
};

export default function RoomReservationsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [availableRooms, setAvailableRooms] = useState<RoomAvailability[]>([]);
  const [availabilityBySlot, setAvailabilityBySlot] = useState<
    Record<string, RoomAvailability[]>
  >({});
  const [upcoming, setUpcoming] = useState<UpcomingReservation | null>(null);
  const [myReservations, setMyReservations] = useState<RoomReservationResponseDto[]>([]);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentMinutes, setCurrentMinutes] = useState(-1);
  const { toastConfig, showToast, hideToast } = useToast();

  const loadScheduleAvailability = async (slots: TimeSlot[]) => {
    if (slots.length === 0) {
      setAvailabilityBySlot({});
      return;
    }

    setIsLoadingAvailability(true);

    try {
      const entries = await Promise.all(
        slots.map(async (slot) => {
          const rooms = await roomBookingApi.getRoomAvailability(slot.id);
          return [slot.id, rooms || []] as const;
        }),
      );
      setAvailabilityBySlot(Object.fromEntries(entries));
    } catch (err) {
      setAvailabilityBySlot({});
      setError(getErrorMessage(err, "Failed to load room schedule"));
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const loadAvailability = async (timeSlotId: string) => {
    if (!timeSlotId) {
      setAvailableRooms([]);
      setSelectedRoomId("");
      return;
    }

    setIsLoadingAvailability(true);
    setError("");

    try {
      const rooms = await roomBookingApi.getRoomAvailability(timeSlotId);
      const selectableRooms = (rooms || []).filter((room) => !room.isFull);
      setAvailableRooms(rooms || []);
      setSelectedRoomId((prev) => {
        if (prev && selectableRooms.some((room) => room.id === prev))
          return prev;
        return selectableRooms[0]?.id || "";
      });
    } catch (err) {
      setAvailableRooms([]);
      setSelectedRoomId("");
      setError(getErrorMessage(err, "Failed to load room availability"));
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const syncTimeSlotSelection = async (
    slots: TimeSlot[],
    preferredSlotId?: string,
  ) => {
    const nextTimeSlotId =
      preferredSlotId && slots.some((slot) => slot.id === preferredSlotId)
        ? preferredSlotId
        : slots[0]?.id || "";

    setSelectedTimeSlotId(nextTimeSlotId);

    if (nextTimeSlotId) {
      await loadAvailability(nextTimeSlotId);
    } else {
      setAvailableRooms([]);
      setSelectedRoomId("");
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [timeSlotsRes, upcomingRes, myReservationsRes] = await Promise.all([
        roomBookingApi.getTimeSlots(),
        roomBookingApi.getUpcomingReservation().catch(() => null),
        roomBookingApi.getMyReservations().catch(() => []),
      ]);

      const loadedTimeSlots = timeSlotsRes || [];
      setTimeSlots(loadedTimeSlots);
      setUpcoming(upcomingRes);
      setMyReservations(myReservationsRes || []);
      await syncTimeSlotSelection(loadedTimeSlots, selectedTimeSlotId);
      await loadScheduleAvailability(loadedTimeSlots);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load booking data"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadInitialData();
    }, 0);

    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    };
    
    updateCurrentTime();
    const interval = window.setInterval(updateCurrentTime, 60000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  const hasTimeSlots = timeSlots.length > 0;

  const createReservation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedRoomId || !selectedTimeSlotId) return;

    const todaysReservations = myReservations.filter(
      (res) =>
        res.bookingDate.startsWith(todayString()) &&
        res.reservationStatus !== "CANCELLED",
    );

    if (todaysReservations.length >= 3) {
      showToast(
        "Reservation limit reached",
        "You can only book up to 3 rooms per day.",
        "error",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await roomBookingApi.createReservation({
        bookingDate: todayString(),
        roomId: selectedRoomId,
        timeSlotId: selectedTimeSlotId,
      });
      setSuccessMessage("Reservation created successfully.");
      showToast(
        "Reservation created",
        "Your study room booking was created successfully.",
        "success",
      );
      await loadInitialData();
      await loadAvailability(selectedTimeSlotId);
      await loadScheduleAvailability(timeSlots);
    } catch (err) {
      const message = getErrorMessage(err, "Failed to create reservation");
      setError(message);
      showToast("Reservation failed", message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpcomingAction = async (action: "confirm" | "cancel") => {
    if (!upcoming) return;

    setError("");
    setSuccessMessage("");

    try {
      if (action === "confirm") {
        await roomBookingApi.confirmReservation(upcoming.id);
        setSuccessMessage("Reservation confirmed successfully.");
        showToast(
          "Reservation confirmed",
          "Your reservation was confirmed successfully.",
          "success",
        );
      } else {
        await roomBookingApi.cancelReservation(upcoming.id);
        setSuccessMessage("Reservation cancelled successfully.");
        showToast(
          "Reservation cancelled",
          "Your reservation was cancelled successfully.",
          "info",
        );
      }

      await loadInitialData();
      if (selectedTimeSlotId) {
        await loadAvailability(selectedTimeSlotId);
      }
      await loadScheduleAvailability(timeSlots);
    } catch (err) {
      setError(getErrorMessage(err, `Failed to ${action} reservation`));
    }
  };

  const roomsById = new Map<string, RoomAvailability>();
  Object.values(availabilityBySlot).forEach((rooms) => {
    rooms.forEach((room) => {
      if (!roomsById.has(room.id)) roomsById.set(room.id, room);
    });
  });

  const scheduleRooms = Array.from(roomsById.values());
  const selectedRoom =
    roomsById.get(selectedRoomId) ||
    availableRooms.find((room) => room.id === selectedRoomId);
  const selectedTimeSlot = timeSlots.find(
    (slot) => slot.id === selectedTimeSlotId,
  );

  const selectScheduleCell = (room: RoomAvailability, timeSlotId: string) => {
    if (room.isFull) return;
    setSelectedRoomId(room.id);
    setSelectedTimeSlotId(timeSlotId);
    setAvailableRooms(availabilityBySlot[timeSlotId] || []);
    setSuccessMessage("");
  };

  return (
    <div className="relative min-h-screen bg-white font-body text-on-surface z-0">
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-[#e3dcd1] rounded-br-[6rem] md:rounded-br-[10rem] -z-10 pointer-events-none" />
      <Header />
      <main className="app-shell-main app-shell-content mx-auto w-full max-w-[96rem] px-4 pb-12 pt-24 sm:px-6 md:px-8 lg:pt-10 xl:px-10">
        <div className="grid gap-12">
          <div className="space-y-12">
            <div>
              <h1 className="font-headline text-[3rem] font-black leading-none tracking-[-0.04em] text-black">
                Room Reservations
              </h1>
            </div>
        {error && (
          <div className="mb-6 rounded-2xl border border-error-container bg-error-container p-4 font-bold text-on-error-container shadow-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-bold text-emerald-700">
            {successMessage}
          </div>
        )}

            {upcoming && (
              <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h2 className="mb-2 font-headline text-[1.75rem] font-medium text-[#3f3a33]">
                      Upcoming Reservation
                    </h2>
                    <p className="font-bold text-[#6f695f] text-lg">
                      {upcoming.roomName}, {upcoming.startTime} - {upcoming.endTime}
                    </p>
                    {upcoming.accessCode && (
                      <p className="mt-4 inline-flex rounded-full bg-[#f4f2ec] px-5 py-2.5 text-sm font-black text-[#2a2620]">
                        Access code: {upcoming.accessCode}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {canConfirmUpcoming(upcoming) && (
                      <button
                        onClick={() => handleUpcomingAction("confirm")}
                        className="rounded-full bg-[#23493d] px-6 py-3 font-bold text-white transition hover:bg-[#1d3f34] shadow-md"
                      >
                        Confirm
                      </button>
                    )}
                    {canCancelUpcoming(upcoming) && (
                      <button
                        onClick={() => handleUpcomingAction("cancel")}
                        className="rounded-full bg-[#f4f2ec] px-6 py-3 font-bold text-[#a54f42] transition hover:bg-[#ece5d7]"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={createReservation}
              className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
            >
              <section className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between gap-4 border-b border-[#f4f2ec] px-8 py-7 bg-[#fbfaf8]">
                  <div>
                    <h2 className="font-headline text-[1.75rem] font-medium text-[#3f3a33]">
                      Room Schedule
                    </h2>
                    <p className="mt-2 text-sm font-medium text-[#8f877a]">
                      Scan rooms by time, then click an available slot to reserve.
                    </p>
                  </div>
                  {isLoadingAvailability && <SkeletonBlock className="h-4 w-36" />}
                </div>

                {isLoading ? (
                  <div className="p-8">
                    <CardGridSkeleton count={6} />
                  </div>
                ) : !hasTimeSlots || scheduleRooms.length === 0 ? (
                  <div className="m-8 rounded-[1.5rem] bg-[#f4f2ec] p-10 text-center font-bold text-[#8f877a]">
                    No room schedule available right now.
                  </div>
                ) : (
                  <div className="max-h-[42rem] overflow-auto bg-white relative">
                    <div
                      className="grid min-w-max"
                      style={{
                        gridTemplateColumns: `16rem repeat(${timeSlots.length}, minmax(11.5rem, 1fr))`,
                      }}
                    >
                      <div className="sticky left-0 top-0 z-30 bg-white/95 p-6 backdrop-blur-sm border-b border-r border-[#ece5d7]">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">
                          Rooms
                        </p>
                      </div>
                      {timeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="sticky top-0 z-20 bg-white/95 p-5 text-center backdrop-blur-sm border-b border-[#ece5d7]"
                        >
                          <p className="font-headline text-lg font-black text-[#1d1d1d]">
                            {slot.startTime}
                          </p>
                          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#8f877a]">
                            to {slot.endTime}
                          </p>
                        </div>
                      ))}

                      {scheduleRooms.map((room) => (
                        <React.Fragment key={room.id}>
                          <div className="sticky left-0 z-10 bg-white p-6 border-r border-b border-[#ece5d7] shadow-[10px_0_20px_-15px_rgba(0,0,0,0.05)]">
                            <h3 className="font-black text-[1.1rem] leading-tight text-[#1d1d1d]">
                              {room.name}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-[13px] font-medium text-[#8f877a]">
                              {room.description || "Study room"}
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#f4f2ec] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#6f695f]">
                              <i className="fa-solid fa-users"></i> {room.capacity} seats
                            </div>
                          </div>

                          {timeSlots.map((slot) => {
                            const slotRoom = availabilityBySlot[slot.id]?.find(
                              (item) => item.id === room.id,
                            );
                            const isPast = currentMinutes !== -1 && toMinutes(slot.startTime) < currentMinutes;
                            const isUnavailable = !slotRoom || slotRoom.isFull;
                            const isSelected =
                              selectedRoomId === room.id &&
                              selectedTimeSlotId === slot.id;
                            
                            const isBookedByMe = myReservations.some(
                              (res) =>
                                res.roomId === room.id &&
                                res.timeSlotId === slot.id &&
                                res.reservationStatus !== 'CANCELLED'
                            );
                            
                            const isDisabled = isUnavailable || isBookedByMe || isPast;
                            const seatsLeft = slotRoom?.seatsLeft ?? 0;

                            return (
                              <div key={`${room.id}-${slot.id}`} className="p-2 border-b border-[#ece5d7]/50 flex">
                                <button
                                  type="button"
                                  disabled={isDisabled}
                                  onClick={() =>
                                    slotRoom && selectScheduleCell(slotRoom, slot.id)
                                  }
                                  className={`flex-1 rounded-[1.25rem] px-5 py-4 text-left transition-all duration-300 ${
                                    isBookedByMe
                                      ? "bg-[#e3dcd1] text-[#6f695f] shadow-inner cursor-not-allowed"
                                      : isSelected
                                        ? "scale-[1.02] bg-[#23493d] text-white shadow-[0_10px_20px_-10px_rgba(35,73,61,0.5)]"
                                        : isPast || isUnavailable
                                          ? "cursor-not-allowed bg-[#fbfaf8] text-[#bbb3a6]"
                                          : "bg-[#f4f2ec] text-[#3f3a33] hover:-translate-y-1 hover:bg-[#e6ddcc] hover:shadow-[0_8px_16px_-8px_rgba(0,0,0,0.15)]"
                                  }`}
                                >
                                  <span
                                    className={`block text-[15px] font-black ${(isUnavailable || isPast) && !isBookedByMe ? "line-through opacity-60" : ""}`}
                                  >
                                    {isBookedByMe ? "Booked by You" : isSelected ? "Selected" : isPast ? "Passed" : isUnavailable ? "Unavailable" : "Available"}
                                  </span>
                                  <span
                                    className={`mt-1.5 block text-[11px] font-bold ${(isUnavailable || isPast) && !isBookedByMe ? "opacity-60" : isSelected ? "text-white/80" : "text-[#8f877a]"}`}
                                  >
                                    {isBookedByMe
                                      ? "Reserved"
                                      : isPast
                                        ? "Time passed"
                                        : isUnavailable
                                          ? "Fully booked"
                                          : `${seatsLeft} seats left`}
                                  </span>
                                </button>
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                </div>
              </div>
            )}
          </section>

            <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">
                  Selection
                </p>
                {selectedRoom && selectedTimeSlot ? (
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="font-headline text-[1.75rem] font-black text-[#1d1d1d]">
                        {selectedRoom.name}
                      </h3>
                      <p className="mt-2 text-[15px] font-medium text-[#8f877a]">
                        {selectedRoom.description || "Study room"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-[1.25rem] bg-[#fbfaf8] p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#bbb3a6]">
                          Time
                        </p>
                        <p className="mt-2 text-lg font-black text-[#3f3a33]">
                          {selectedTimeSlot.startTime}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] bg-[#fbfaf8] p-5">
                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#bbb3a6]">
                          Seats left
                        </p>
                        <p className="mt-2 text-lg font-black text-[#23493d]">
                          {selectedRoom.seatsLeft}
                        </p>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={
                        !selectedRoomId ||
                        !selectedTimeSlotId ||
                        isSubmitting ||
                        isLoadingAvailability
                      }
                      className="w-full rounded-full bg-[#23493d] px-8 py-4 text-lg font-black text-white shadow-lg shadow-[#23493d]/30 transition hover:bg-[#1d3f34] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Booking..." : "Reserve Room"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 rounded-[1.5rem] bg-[#fbfaf8] p-6 text-sm font-bold leading-7 text-[#8f877a]">
                    Select an available schedule cell to preview room details and
                    reserve.
                  </div>
                )}
              </div>

            </aside>
            </form>
          </div>
        </div>
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
