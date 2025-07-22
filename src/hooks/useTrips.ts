import { useState, useEffect, useCallback } from 'react';
import { Trip, TripStatus, FilterOptions } from '@/types/trip';
import { mockTrips } from '@/data/mockData';

export interface UseTripsReturn {
  trips: Trip[];
  filteredTrips: Trip[];
  isLoading: boolean;
  error: string | null;
  refreshTrips: () => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  activeStatus: TripStatus | 'all';
  setActiveStatus: (status: TripStatus | 'all') => void;
}

// Simulated API call function
const fetchTripsFromAPI = async (): Promise<Trip[]> => {
  // Get zone from localStorage
  const zone = localStorage.getItem('zone') || '4';
  
  // In a real implementation, this would be an actual API call
  // const response = await fetch('/api/trips', {
  //   headers: {
  //     'zone': zone,
  //     'Content-Type': 'application/json',
  //   }
  // });
  // return response.json();
  
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`API call with zone: ${zone}`);
      resolve(mockTrips);
    }, 500);
  });
};

export const useTrips = (): UseTripsReturn => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    line: '',
    route: '',
    consortium: '',
  });
  const [activeStatus, setActiveStatus] = useState<TripStatus | 'all'>('all');

  const refreshTrips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedTrips = await fetchTripsFromAPI();
      setTrips(fetchedTrips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trips');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter trips based on current filters and active status
  const filteredTrips = trips.filter(trip => {
    // Status filter
    if (activeStatus !== 'all' && trip.status !== activeStatus) {
      return false;
    }

    // Line filter
    if (filters.line && trip.line !== filters.line) {
      return false;
    }

    // Route filter
    if (filters.route && trip.route !== filters.route) {
      return false;
    }

    // Consortium filter
    if (filters.consortium && trip.consortium !== filters.consortium) {
      return false;
    }

    return true;
  });

  // Initial load
  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  // Auto refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTrips();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [refreshTrips]);

  return {
    trips,
    filteredTrips,
    isLoading,
    error,
    refreshTrips,
    filters,
    setFilters,
    activeStatus,
    setActiveStatus,
  };
};