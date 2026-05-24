import { roomBookingApi } from '@/lib/room-booking-api';
import type { AddRoomPayload, Room } from '../types';

export const roomViewerService = {
  getRooms: async (): Promise<Room[]> => {
    return roomBookingApi.getRooms();
  },

  addRoom: async (payload: AddRoomPayload): Promise<Room> => {
    return roomBookingApi.createRoom(payload);
  },

  updateRoom: async (id: string, payload: AddRoomPayload): Promise<Room> => {
    return roomBookingApi.updateRoom(id, payload);
  },

  deleteRoom: async (id: string): Promise<void> => {
    await roomBookingApi.deleteRoom(id);
  },
};
