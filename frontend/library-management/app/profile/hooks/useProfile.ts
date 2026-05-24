import { useState, useEffect, useCallback } from 'react';
import { UserProfile, BorrowedBook, RoomReservation, PendingRequest } from '../types';
import { profileService } from '../services/api';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [reservations, setReservations] = useState<RoomReservation[]>([]);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileService.getProfileData();
      setProfile(data.profile);
      setBorrowedBooks(data.borrowedBooks);
      setReservations(data.reservations);
      setRequests(data.requests);
    } catch (err: any) {
      console.error('Fetch profile data error:', err);
      setError(err.message || 'Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    profile,
    borrowedBooks,
    reservations,
    requests,
    isLoading,
    error,
    refreshData: fetchProfileData
  };
};
