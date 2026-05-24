import { apiFetch, resolveAssetUrl } from '@/lib/api';
import type { AdminUser, CreateAdminUserPayload, UpdateAdminUserPayload } from '../types';

type AdminUserResponseDto = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt?: string | null;
};

type PagedResult<T> = {
  items?: T[];
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
};

const mapAdminUser = (user: AdminUserResponseDto): AdminUser => ({
  id: user.id,
  email: user.email,
  fullName: user.fullName,
  role: user.role === 'ADMIN' ? 'ADMIN' : 'STUDENT',
  avatarUrl: resolveAssetUrl(user.avatarUrl),
  isActive: Boolean(user.isActive),
  createdAt: user.createdAt || null,
});

export const adminUsersService = {
  getUsers: async (includeInactive = false): Promise<AdminUser[]> => {
    const data = await apiFetch<PagedResult<AdminUserResponseDto>>('/api/admin/users', {
      params: { includeInactive, page: 1, pageSize: 100 },
    });
    return (Array.isArray(data?.items) ? data.items : []).map(mapAdminUser);
  },

  createUser: async (payload: CreateAdminUserPayload): Promise<AdminUser> => {
    const data = await apiFetch<AdminUserResponseDto>('/api/admin/users', {
      method: 'POST',
      body: payload,
    });
    return mapAdminUser(data);
  },

  updateUser: async (id: string, payload: UpdateAdminUserPayload): Promise<AdminUser> => {
    const data = await apiFetch<AdminUserResponseDto>(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: payload,
    });
    return mapAdminUser(data);
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiFetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
};
