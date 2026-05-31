import { normalizeBookCategory } from '@/lib/book-category';
import { apiFetch, resolveAssetUrl } from '@/lib/api';
import { InventoryBook, RoomState, PendingRequest, AddBookPayload, TimeSlot } from '../types';

const mapInventoryBook = (book: any): InventoryBook => ({
  id: book.id,
  title: book.title,
  isbn: book.isbn,
  author: book.author || 'Unknown',
  quantity: book.availableCopies ?? 0,
  category: normalizeBookCategory(book.category),
  yearOfPublication: book.yearOfPublication || 0,
  documentType: book.documentType || 'BOOK',
  status: book.status || 'AVAILABLE',
  coverImage: resolveAssetUrl(book.imageUrl) || 'https://via.placeholder.com/200x300?text=No+Cover',
  bookOnlineUrl: book.bookOnlineUrl || null,
  documentFileUrl: book.documentFileUrl || null,
});

const roomStatus = (occupied: number, capacity: number): RoomState['status'] => {
  const ratio = capacity > 0 ? occupied / capacity : 0;
  if (ratio > 0.8) return 'Busy';
  if (ratio > 0.4) return 'Moderate';
  return 'Light';
};

const getCollection = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.Items)) return data.Items;
  return [];
};

export const adminInventoryService = {
  getInventory: async (): Promise<InventoryBook[]> => {
    const data = await apiFetch<any>('/api/books');
    return getCollection<any>(data).map(mapInventoryBook);
  },

  addBook: async (payload: AddBookPayload): Promise<InventoryBook> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('author', payload.author);
    formData.append('isbn', payload.isbn);
    formData.append('yearOfPublication', payload.yearOfPublication.toString());
    formData.append('category', payload.category);
    formData.append('availableCopies', payload.quantity.toString());
    formData.append('documentType', payload.documentType);
    if (payload.image) {
      formData.append('image', payload.image);
    }
    if (payload.bookOnlineUrl) {
      formData.append('bookOnlineUrl', payload.bookOnlineUrl);
    }
    if (payload.documentFile) {
      formData.append('documentFile', payload.documentFile);
    }

    const data = await apiFetch<any>('/api/books', {
      method: 'POST',
      body: formData,
    });

    return mapInventoryBook(data);
  },

  updateBook: async (isbn: string, payload: AddBookPayload): Promise<InventoryBook> => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('author', payload.author);
    formData.append('yearOfPublication', payload.yearOfPublication.toString());
    formData.append('category', payload.category);
    formData.append('availableCopies', payload.quantity.toString());
    formData.append('documentType', payload.documentType);
    if (payload.image) {
      formData.append('image', payload.image);
    }
    if (payload.bookOnlineUrl) {
      formData.append('bookOnlineUrl', payload.bookOnlineUrl);
    }
    if (payload.documentFile) {
      formData.append('documentFile', payload.documentFile);
    }

    const data = await apiFetch<any>(`/api/books/${isbn}`, {
      method: 'PUT',
      body: formData,
    });

    return mapInventoryBook(data);
  },

  deleteBook: async (isbn: string): Promise<void> => {
    await apiFetch(`/api/books/${isbn}`, { method: 'DELETE' });
  },

  getTimeSlots: async (): Promise<TimeSlot[]> => {
    const data = await apiFetch<any>('/api/time-slots');
    return Array.isArray(data) ? data : data.items || [];
  },

  getRooms: async (timeSlotId?: string): Promise<RoomState[]> => {
    if (timeSlotId) {
      const data = await apiFetch<any>('/api/rooms/occupancy-rooms', {
        params: { timeSlotId }
      });

      return getCollection<any>(data).map((room: any) => ({
        id: room.roomId,
        name: room.roomName,
        occupied: room.bookedCount ?? 0,
        capacity: room.capacity ?? 0,
        status: roomStatus(room.bookedCount ?? 0, room.capacity ?? 0),
      }));
    }

    const data = await apiFetch<any>('/api/rooms');
    return getCollection<any>(data).map((room: any) => ({
      id: room.id,
      name: room.name,
      occupied: 0,
      capacity: room.capacity,
      status: 'Light',
    }));
  },

  getRequests: async (): Promise<PendingRequest[]> => {
    const data = await apiFetch<any>('/api/books/requests', {
      params: { status: 'PENDING' }
    });
    return getCollection<any>(data).map((req: any) => ({
      id: req.id,
      userName: req.userName,
      bookTitle: req.bookTitle,
      status: req.status,
      avatar: 'https://via.placeholder.com/100?text=Avatar'
    }));
  },

  approveRequest: async (requestId: string): Promise<void> => {
    await apiFetch(`/api/books/requests/${requestId}`, { method: 'PUT', body: { status: 'APPROVED' } });
  },

  rejectRequest: async (requestId: string): Promise<void> => {
    await apiFetch(`/api/books/requests/${requestId}`, { method: 'PUT', body: { status: 'REJECTED' } });
  }
};
