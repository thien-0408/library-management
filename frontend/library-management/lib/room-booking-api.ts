import { apiFetch } from '@/lib/api';
import type {
  CreateRoomReservationRequestDto,
  RoomAvailabilityResponseDto,
  RoomOccupancyResponseDto,
  RoomRequestDto,
  RoomReservationResponseDto,
  RoomResponseDto,
  TimeSlotRequestDto,
  TimeSlotResponseDto,
  UpcomingReservationResponseDto,
  UpdateRoomReservationRequestDto,
} from '@/lib/room-booking-types';

const normalizeTimeSlotRequest = (payload: TimeSlotRequestDto): TimeSlotRequestDto => {
  const normalizeTime = (value: string) => (value.length === 5 ? `${value}:00` : value);

  return {
    startTime: normalizeTime(payload.startTime),
    endTime: normalizeTime(payload.endTime),
  };
};

export const roomBookingApi = {
  getTimeSlots: () => apiFetch<TimeSlotResponseDto[]>('/api/time-slots'),

  createTimeSlot: (payload: TimeSlotRequestDto) =>
    apiFetch<TimeSlotResponseDto>('/api/time-slots', {
      method: 'POST',
      body: normalizeTimeSlotRequest(payload),
    }),

  updateTimeSlot: (id: string, payload: TimeSlotRequestDto) =>
    apiFetch<TimeSlotResponseDto>(`/api/time-slots/${id}`, {
      method: 'PATCH',
      body: normalizeTimeSlotRequest(payload),
    }),

  deleteTimeSlot: (id: string) =>
    apiFetch<void>(`/api/time-slots/${id}`, {
      method: 'DELETE',
    }),

  getRooms: () => apiFetch<RoomResponseDto[]>('/api/rooms'),

  createRoom: (payload: RoomRequestDto) =>
    apiFetch<RoomResponseDto>('/api/rooms', {
      method: 'POST',
      body: payload,
    }),

  updateRoom: (id: string, payload: RoomRequestDto) =>
    apiFetch<RoomResponseDto>(`/api/rooms/${id}`, {
      method: 'PATCH',
      body: payload,
    }),

  deleteRoom: (id: string) =>
    apiFetch<void>(`/api/rooms/${id}`, {
      method: 'DELETE',
    }),

  getRoomAvailability: (date: string, timeSlotId: string) =>
    apiFetch<RoomAvailabilityResponseDto[]>('/api/rooms/availability-room', {
      params: { date, timeSlotId },
    }),

  getRoomOccupancy: (date: string, timeSlotId: string) =>
    apiFetch<RoomOccupancyResponseDto[]>('/api/rooms/occupancy-rooms', {
      params: { date, timeSlotId },
    }),

  createReservation: (payload: CreateRoomReservationRequestDto) =>
    apiFetch<RoomReservationResponseDto>('/api/room-reservations', {
      method: 'POST',
      body: payload,
    }),

  updateReservation: (id: string, payload: UpdateRoomReservationRequestDto) =>
    apiFetch<RoomReservationResponseDto>(`/api/room-reservations/${id}`, {
      method: 'PUT',
      body: payload,
    }),

  getUpcomingReservation: () =>
    apiFetch<UpcomingReservationResponseDto | null>('/api/room-reservations/upcoming'),

  confirmReservation: (id: string) =>
    apiFetch<void>(`/api/room-reservations/${id}/confirm`, {
      method: 'PATCH',
    }),

  cancelReservation: (id: string) =>
    apiFetch<void>(`/api/room-reservations/${id}/cancel`, {
      method: 'PATCH',
    }),

  getReservations: () => apiFetch<RoomReservationResponseDto[]>('/api/room-reservations'),

  deleteReservation: (id: string) =>
    apiFetch<void>(`/api/room-reservations/${id}`, {
      method: 'DELETE',
    }),
};
