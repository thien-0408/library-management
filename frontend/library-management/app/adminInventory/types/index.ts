import type { BookCategory } from '@/lib/book-category';

export interface InventoryBook {
  id: string;
  title: string;
  isbn: string;
  author: string;
  quantity: number;
  category: BookCategory;
  yearOfPublication: number;
  documentType: 'BOOK' | 'DOCUMENT';
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
  coverImage: string;
  bookOnlineUrl?: string | null;
  documentFileUrl?: string | null;
}

export interface RoomState {
  id: string;
  name: string;
  occupied: number;
  capacity: number;
  status: 'Light' | 'Moderate' | 'Busy';
}

export { type TimeSlotResponseDto as TimeSlot } from '@/lib/room-booking-types';

export interface PendingRequest {
  id: string;
  userName: string;
  bookTitle: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  avatar: string;
}

export interface AddBookPayload {
  title: string;
  author: string;
  isbn: string;
  category: BookCategory;
  yearOfPublication: number;
  quantity: number;
  documentType: 'BOOK' | 'DOCUMENT';
  image?: File | null;
  bookOnlineUrl?: string;
  documentFile?: File | null;
}
