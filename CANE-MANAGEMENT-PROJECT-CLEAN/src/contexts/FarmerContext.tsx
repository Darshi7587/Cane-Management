/**
 * ============================================
 * FARMER CONTEXT - Global State Management
 * ============================================
 * 
 * Provides global state for farmers list and registration status
 * Enables automatic sidebar updates after registration
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Farmer {
  _id: string;
  digitalFarmerId: string;
  name: string;
  email: string;
  mobileNumber: string;
  areaInAcres: number;
  landLocation: string;
  blockchainWalletAddress?: string;
  blockchainTransactionHash?: string;
  blockchainVerified: boolean;
  createdAt: string;
}

interface FarmerContextType {
  farmers: Farmer[];
  loading: boolean;
  error: string | null;
  hasRegisteredFarmers: boolean;
  fetchFarmers: () => Promise<void>;
  addFarmer: (farmer: Farmer) => void;
  refreshFarmers: () => void;
}

const FarmerContext = createContext<FarmerContextType | undefined>(undefined);

export const useFarmers = () => {
  const context = useContext(FarmerContext);
  if (!context) {
    throw new Error('useFarmers must be used within a FarmerProvider');
  }
  return context;
};

interface FarmerProviderProps {
  children: ReactNode;
}

export const FarmerProvider: React.FC<FarmerProviderProps> = ({ children }) => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  /**
   * Fetch all farmers from backend
   */
  const fetchFarmers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/farmers`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch farmers');
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.farmers)) {
        setFarmers(data.farmers);
      } else {
        setFarmers([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load farmers';
      setError(errorMessage);
      console.error('Error fetching farmers:', err);
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new farmer to the list (used after registration)
   */
  const addFarmer = (farmer: Farmer) => {
    setFarmers(prev => [farmer, ...prev]);
  };

  /**
   * Refresh farmers list
   */
  const refreshFarmers = () => {
    fetchFarmers();
  };

  /**
   * Check if any farmers are registered
   */
  const hasRegisteredFarmers = farmers.length > 0;

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchFarmers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: FarmerContextType = {
    farmers,
    loading,
    error,
    hasRegisteredFarmers,
    fetchFarmers,
    addFarmer,
    refreshFarmers,
  };

  return (
    <FarmerContext.Provider value={value}>
      {children}
    </FarmerContext.Provider>
  );
};
