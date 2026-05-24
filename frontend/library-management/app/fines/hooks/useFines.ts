import { useCallback, useEffect, useState } from 'react';
import { getAuthSession } from '@/lib/api';
import { finesService } from '../services/api';
import type { FineItem, FineStatus } from '../types';

const isAdminRole = (role?: string | null) => role?.toLowerCase() === 'admin';

export const useFines = () => {
  const [fines, setFines] = useState<FineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const session = getAuthSession();
  const isAdmin = isAdminRole(session?.role);

  const fetchFines = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = isAdmin ? await finesService.getAllFines() : await finesService.getMyFines();
      setFines(data || []);
    } catch (err: unknown) {
      console.error('Fetch fines error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load fines.');
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchFines();
  }, [fetchFines]);

  const generateOverdueFines = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      await finesService.generateOverdueFines();
      await fetchFines();
      return true;
    } catch (err: unknown) {
      console.error('Generate overdue fines error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate overdue fines.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateFineStatus = async (id: string, status: FineStatus) => {
    setIsUpdating(true);
    setError(null);

    try {
      await finesService.updateFineStatus(id, status);
      await fetchFines();
      return true;
    } catch (err: unknown) {
      console.error('Update fine status error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update fine status.');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    fines,
    isAdmin,
    isLoading,
    isUpdating,
    error,
    generateOverdueFines,
    updateFineStatus,
    refreshData: fetchFines,
  };
};
