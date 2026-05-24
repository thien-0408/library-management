import type { RoomRequestDto, RoomResponseDto } from '@/lib/room-booking-types';

export type Room = RoomResponseDto;
export type AddRoomPayload = RoomRequestDto;
export type OperatingHours = {
  openTime: string;
  closeTime: string;
};
