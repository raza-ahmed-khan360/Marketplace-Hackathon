'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category } from '../../types';
import { getCategories } from '../../lib/api';

/**
 * Interface for categories context value
 * Provides category data and loading states
 */
interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
}

// Create categories context with initial undefined value
const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

/**
 * CategoriesProvider Component
 * Manages categories state and provides category data through context
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function CategoriesProvider({ children }: { children: ReactNode }) {
  // State management for categories data
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches categories from the API
   * Updates state with results or error
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, fetchError] = await getCategories();
      
      if (fetchError) throw fetchError;
      if (data) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Manually refresh categories data
   * Useful for forcing a refresh after updates
   */
  const refreshCategories = async () => {
    await fetchCategories();
  };

  const value = {
    categories,
    loading,
    error,
    refreshCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

/**
 * Custom hook to use categories context
 * Throws error if used outside of CategoriesProvider
 * 
 * @returns {CategoriesContextType} Categories context value
 */
export function useCategories(): CategoriesContextType {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
} 