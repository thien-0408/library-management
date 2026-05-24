export type AdminUserRole = 'ADMIN' | 'STUDENT';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminUserRole;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string | null;
}

export interface CreateAdminUserPayload {
  email: string;
  fullName: string;
  password: string;
  role: AdminUserRole;
}

export interface UpdateAdminUserPayload {
  email?: string;
  fullName?: string;
  role?: AdminUserRole;
  isActive?: boolean;
}
