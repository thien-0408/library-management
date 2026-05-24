import { useState, useEffect, useCallback } from 'react';
import { Room, AddRoomPayload } from '../types';
import { roomViewerService } from '../services/api';

const sortRoomsByName = (rooms: Room[]) =>
  [...rooms].sort((a, b) => a.name.localeCompare(b.name));

export const useRoomViewer = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const roomsData = await roomViewerService.getRooms();
      setRooms(sortRoomsByName(roomsData));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load rooms data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleAddRoom = async (payload: AddRoomPayload): Promise<boolean> => {
    try {
      setError(null);
      const newRoom = await roomViewerService.addRoom(payload);
      setRooms((prev) => sortRoomsByName([...prev, newRoom]));
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to add room');
      return false;
    }
  };

  const handleUpdateRoom = async (id: string, payload: AddRoomPayload): Promise<boolean> => {
    try {
      setError(null);
      const updatedRoom = await roomViewerService.updateRoom(id, payload);
      setRooms((prev) => sortRoomsByName(prev.map((room) => (room.id === id ? updatedRoom : room))));
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update room');
      return false;
    }
  };

  const handleDeleteRoom = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await roomViewerService.deleteRoom(id);
      setRooms((prev) => prev.filter((room) => room.id !== id));
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete room');
      return false;
    }
  };

  return {
    rooms,
    isLoading,
    error,
    handleAddRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    refreshData,
  };
};
