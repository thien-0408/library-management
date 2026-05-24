export type RoomResponseDto = {
  id: string;
  name: string;
  description?: string | null;
  capacity: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type RoomRequestDto = {
  name: string;
  description?: string | null;
  capacity: number;
};

export type RoomAvailabilityResponseDto = {
  id: string;
  name: string;
  description?: string | null;
  capacity: number;
  seatsLeft: number;
  isFull: boolean;
};

export type RoomOccupancyResponseDto = {
  roomId: string;
  roomName: string;
  capacity: number;
  bookedCount: number;
};

export type TimeSlotRequestDto = {
  startTime: string;
  endTime: string;
};

export type TimeSlotResponseDto = {
  id: string;
  startTime: string;
  endTime: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CreateRoomReservationRequestDto = {
  bookingDate: string;
  roomId: string;
  timeSlotId: string;
};

export type UpdateRoomReservationRequestDto = {
  bookingDate: string;
  roomId: string;
  timeSlotId: string;
};

export type RoomReservationResponseDto = {
  id: string;
  roomId?: string | null;
  userId?: string | null;
  timeSlotId?: string | null;
  bookingDate: string;
  reservationStatus: 'SCHEDULING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  accessCode?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type UpcomingReservationResponseDto = {
  id: string;
  roomId?: string | null;
  roomName: string;
  timeSlotId?: string | null;
  startTime: string;
  endTime: string;
  bookingDate: string;
  accessCode?: string | null;
};
