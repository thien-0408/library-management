import { apiFetch, resolveAssetUrl } from '@/lib/api';
import { roomBookingApi } from '@/lib/room-booking-api';
import { UserProfile, BorrowedBook, RoomReservation, PendingRequest, UpdateProfileInput, UpdateProfileResponse, AuthProfileResponse, ChangePasswordInput, ChangePasswordResponse } from '../types';

const getCollection = <T>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.Items)) return data.Items;
  return [];
};

export const profileService = {
  returnBook: async (borrowRequestId: string) => {
    return apiFetch(`/api/books/requests/${borrowRequestId}/return`, {
      method: 'PUT',
    });
  },

  updateProfile: async ({ fullName, avatar }: UpdateProfileInput) => {
    const formData = new FormData();

    if (fullName.trim()) {
      formData.append('FullName', fullName.trim());
    }

    if (avatar) {
      formData.append('Avatar', avatar);
    }

    const response = await apiFetch<UpdateProfileResponse>('/api/auth/profile', {
      method: 'PUT',
      body: formData,
    });

    if (typeof window !== 'undefined') {
      if (response.fullName) {
        localStorage.setItem('username', response.fullName);
      }
      if (response.email) {
        localStorage.setItem('email', response.email);
      }
      if (response.avatarUrl) {
        localStorage.setItem('avatarUrl', response.avatarUrl);
      }
    }

    return response;
  },

  changePassword: async ({ currentPassword, newPassword, confirmPassword }: ChangePasswordInput) => {
    return apiFetch<ChangePasswordResponse>('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    });
  },

  getProfileData: async () => {
    try {
      const [profileRes, upcomingReservation, requestsRes, roomsRes] = await Promise.all([
        apiFetch<AuthProfileResponse>('/api/auth/profile'),
        roomBookingApi.getUpcomingReservation().catch(() => null),
        apiFetch<any[]>('/api/books/requests/me').catch(() => []),
        apiFetch<any[]>('/api/rooms').catch(() => [])
      ]);

      const rooms = getCollection<any>(roomsRes);
      const roomsMap = rooms.reduce((acc: any, room: any) => {
        acc[room.id] = room;
        return acc;
      }, {});

      const reservations: RoomReservation[] = upcomingReservation
        ? [{
            id: upcomingReservation.id,
            roomName: upcomingReservation.roomName || roomsMap[upcomingReservation.roomId || '']?.name || 'Unknown Room',
            roomDescription: roomsMap[upcomingReservation.roomId || '']?.description || undefined,
            bookingDate: upcomingReservation.bookingDate,
            startTime: upcomingReservation.startTime,
            endTime: upcomingReservation.endTime,
            accessCode: upcomingReservation.accessCode ?? null,
          }]
        : [];
      
      const allRequests = getCollection<any>(requestsRes);
      
      const requests: PendingRequest[] = allRequests.filter((req: any) => req.status === 'PENDING').map((req: any) => ({
          id: req.id,
          title: req.bookTitle,
          reqId: req.id.substring(0, 8), // Generate short ID
          status: 'Queue',
          queueNumber: Math.floor(Math.random() * 5) + 1 // Mock queue
      }));
      
      // Borrowed Books: show only active approved loans in this section
      const borrowedBooks = allRequests
          .filter((req: any) => req.status === 'APPROVED' && !req.returnedAt)
          .map((req: any) => ({
               id: req.id,
               title: req.bookTitle,
               author: req.documentType || 'Unknown',
               borrowedAt: req.borrowedAt ?? null,
               dueDate: req.dueDate ? new Date(req.dueDate).toLocaleDateString() : 'N/A',
               returnedAt: req.returnedAt ?? null,
               warningMessage: req.warningMessage ?? null,
               coverImage: resolveAssetUrl(req.urlImage) || 'https://via.placeholder.com/200x300?text=No+Cover',
               documentType: req.documentType,
                isbn: req.bookIsbn,
                status: req.status,
                borrowMode: req.borrowMode,
                offlineBorrowCode: req.offlineBorrowCode ?? null,
                onlineAccessUrl: req.onlineAccessUrl ?? null,
                isOverdue: Boolean(req.isOverdue)
          }));

      if (typeof window !== 'undefined') {
        localStorage.setItem('username', profileRes.fullName);
        localStorage.setItem('email', profileRes.email);
        if (profileRes.avatarUrl) {
          localStorage.setItem('avatarUrl', profileRes.avatarUrl);
        } else {
          localStorage.removeItem('avatarUrl');
        }
      }

      return {
        profile: {
          name: profileRes.fullName || localStorage.getItem('username') || "Test User",
          email: profileRes.email || localStorage.getItem('email') || "test@example.com",
          memberSince: 2024,
          booksRead: borrowedBooks.length,
          finesDue: 0,
          avatar: resolveAssetUrl(profileRes.avatarUrl) || resolveAssetUrl(localStorage.getItem('avatarUrl')) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
        } as UserProfile,
        borrowedBooks,
        reservations,
        requests
      };
    } catch (error) {
      console.error("Error fetching profile data:", error);
      // Fallback in case of total failure
      return {
        profile: {
          name: localStorage.getItem('username') || "Test User",
          email: localStorage.getItem('email') || "test@example.com",
          memberSince: 2024,
          booksRead: 0,
          finesDue: 0,
          avatar: resolveAssetUrl(localStorage.getItem('avatarUrl')) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
        } as UserProfile,
        borrowedBooks: [],
        reservations: [],
        requests: []
      };
    }
  }
};
