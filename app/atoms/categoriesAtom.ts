import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { Category } from '../../types';
import { getCategories } from '../../lib/api';

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

// Create base atoms for categories state
const categoriesAtom = atom<CategoriesState>({
  categories: [],
  loading: true,
  error: null
});

// Create derived atoms for operations
const fetchCategoriesAtom = atom(
  null,
  async (get, set) => {
    set(categoriesAtom, { ...get(categoriesAtom), loading: true, error: null });
    try {
      const [data, fetchError] = await getCategories();
      
      if (fetchError) throw fetchError;
      if (data) {
        set(categoriesAtom, {
          categories: data,
          loading: false,
          error: null
        });
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      set(categoriesAtom, {
        ...get(categoriesAtom),
        loading: false,
        error: 'Failed to load categories. Please try again later.'
      });
    }
  }
);

/**
 * Custom hook to use categories functionality
 * @returns Categories state and operations
 */
export function useCategories() {
  const [categoriesState] = useAtom(categoriesAtom);
  const [, fetchCategories] = useAtom(fetchCategoriesAtom);

  // Initialize categories on first load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    ...categoriesState,
    refreshCategories: fetchCategories
  };
}