import { useState, useEffect, useCallback } from 'react';
import { InventoryBook, RoomState, PendingRequest, AddBookPayload, TimeSlot } from '../types';
import { isAdminSession } from '@/lib/api';
import { adminInventoryService } from '../services/api';

export const useAdminInventory = () => {
  const [inventory, setInventory] = useState<InventoryBook[]>([]);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [rooms, setRooms] = useState<RoomState[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isAdminSession()) {
      setError('Please log in as an admin to view this dashboard.');
      setIsLoading(false);
      return;
    }

    try {
      const [invData, reqData, slotsData] = await Promise.all([
        adminInventoryService.getInventory(),
        adminInventoryService.getRequests(),
        adminInventoryService.getTimeSlots()
      ]);

      const activeTimeSlotId = selectedTimeSlotId || slotsData[0]?.id || '';

      setInventory(invData);
      setRequests(reqData);
      setTimeSlots(slotsData);
      setSelectedTimeSlotId(activeTimeSlotId);

      try {
        const roomData = activeTimeSlotId
          ? await adminInventoryService.getRooms(selectedDate, activeTimeSlotId)
          : await adminInventoryService.getRooms();
        setRooms(roomData);
      } catch (roomError: any) {
        console.error('fetchDashboardData room occupancy error:', roomError);
        const fallbackRooms = await adminInventoryService.getRooms();
        setRooms(fallbackRooms);
      }
    } catch (err: any) {
      console.error('fetchDashboardData error:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedTimeSlotId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleApproveRequest = async (req: PendingRequest): Promise<boolean> => {
    try {
      await adminInventoryService.approveRequest(req.id);
      setRequests(prev => prev.filter(r => r.id !== req.id));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleRejectRequest = async (req: PendingRequest): Promise<boolean> => {
    try {
      await adminInventoryService.rejectRequest(req.id);
      setRequests(prev => prev.filter(r => r.id !== req.id));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleAddBook = async (payload: AddBookPayload): Promise<boolean> => {
    try {
      const newBook = await adminInventoryService.addBook(payload);
      setInventory(prev => [...prev, newBook]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleUpdateBook = async (isbn: string, payload: AddBookPayload): Promise<boolean> => {
    try {
      const updatedBook = await adminInventoryService.updateBook(isbn, payload);
      setInventory(prev => prev.map(book => book.isbn === isbn ? updatedBook : book));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleDeleteBook = async (isbn: string): Promise<boolean> => {
    try {
      await adminInventoryService.deleteBook(isbn);
      setInventory(prev => prev.filter(b => b.isbn !== isbn));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return {
    inventory,
    requests,
    rooms,
    timeSlots,
    selectedDate,
    selectedTimeSlotId,
    setSelectedDate,
    setSelectedTimeSlotId,
    isLoading,
    error,
    handleApproveRequest,
    handleRejectRequest,
    handleAddBook,
    handleUpdateBook,
    handleDeleteBook,
    refreshData: fetchDashboardData
  };
};
