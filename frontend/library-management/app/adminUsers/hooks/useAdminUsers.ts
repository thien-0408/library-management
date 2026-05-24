import { useCallback, useEffect, useMemo, useState } from 'react';
import { isAdminSession } from '@/lib/api';
import { adminUsersService } from '../services/api';
import type { AdminUser, CreateAdminUserPayload, UpdateAdminUserPayload } from '../types';

const sortUsers = (users: AdminUser[]) =>
  [...users].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return a.fullName.localeCompare(b.fullName);
  });

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isAdminSession()) {
      setError('Please log in as an admin to manage users.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await adminUsersService.getUsers(includeInactive);
      setUsers(sortUsers(data));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return users;

    return users.filter((user) =>
      user.fullName.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.role.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm, users]);

  const activeCount = useMemo(() => users.filter((user) => user.isActive).length, [users]);
  const inactiveCount = useMemo(() => users.filter((user) => !user.isActive).length, [users]);
  const adminCount = useMemo(() => users.filter((user) => user.role === 'ADMIN').length, [users]);

  const handleAddUser = async (payload: CreateAdminUserPayload): Promise<boolean> => {
    try {
      setError(null);
      const newUser = await adminUsersService.createUser(payload);
      if (includeInactive || newUser.isActive) {
        setUsers((prev) => sortUsers([...prev, newUser]));
      }
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create user');
      return false;
    }
  };

  const handleUpdateUser = async (id: string, payload: UpdateAdminUserPayload): Promise<boolean> => {
    try {
      setError(null);
      const updatedUser = await adminUsersService.updateUser(id, payload);
      setUsers((prev) => {
        const nextUsers = prev.map((user) => (user.id === id ? updatedUser : user));
        return sortUsers(includeInactive ? nextUsers : nextUsers.filter((user) => user.isActive));
      });
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update user');
      return false;
    }
  };

  const handleDeleteUser = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await adminUsersService.deleteUser(id);
      setUsers((prev) => {
        if (!includeInactive) return prev.filter((user) => user.id !== id);
        return sortUsers(prev.map((user) => (user.id === id ? { ...user, isActive: false } : user)));
      });
      return true;
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to deactivate user');
      return false;
    }
  };

  const handleReactivateUser = (id: string): Promise<boolean> => {
    return handleUpdateUser(id, { isActive: true });
  };

  return {
    users: filteredUsers,
    includeInactive,
    setIncludeInactive,
    searchTerm,
    setSearchTerm,
    isLoading,
    error,
    activeCount,
    inactiveCount,
    adminCount,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleReactivateUser,
    refreshData,
  };
};
