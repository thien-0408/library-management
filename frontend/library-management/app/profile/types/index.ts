export interface UserProfile {
  name: string;
  email: string;
  memberSince: number;
  booksRead: number;
  finesDue: number;
  avatar: string;
}

export interface UpdateProfileInput {
  fullName: string;
  avatar?: File | null;
}

export interface AuthProfileResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

export interface UpdateProfileResponse extends AuthProfileResponse {}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message?: string;
}

export interface BorrowedBook {
  id: string;
  title: string;
  author: string;
  borrowedAt?: string | null;
  dueDate: string;
  returnedAt?: string | null;
  warningMessage?: string | null;
  coverImage: string;
  documentType?: string;
  isbn?: string;
  status?: string;
  borrowMode?: 'OFFLINE' | 'ONLINE' | string;
  offlineBorrowCode?: string | null;
  onlineAccessUrl?: string | null;
  isOverdue: boolean;
}

export interface RoomReservation {
  id: string;
  roomName: string;
  roomDescription?: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  accessCode?: string | null;
}

export type { UpcomingReservationResponseDto } from '@/lib/room-booking-types';

export interface PendingRequest {
  id: string;
  title: string;
  reqId: string;
  status: 'In Processing' | 'Queue';
  queueNumber?: number;
}
