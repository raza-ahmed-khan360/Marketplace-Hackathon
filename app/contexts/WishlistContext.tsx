'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../../types';

/**
 * Interface for wishlist context value
 * Provides methods for managing wishlist items
 */
interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// Create wishlist context with initial undefined value
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

/**
 * WishlistProvider Component
 * Manages wishlist state and provides wishlist operations through context
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  // Initialize wishlist state from localStorage if available
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const savedWishlist = localStorage.getItem('wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    }
    return [];
  });

  // Persist wishlist items to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  /**
   * Adds a product to the wishlist
   * Prevents duplicate items
   * 
   * @param {Product} product - Product to add to wishlist
   */
  const addToWishlist = (product: Product) => {
    setWishlistItems(prevItems => {
      if (!prevItems.some(item => item._id === product._id)) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  /**
   * Removes a product from the wishlist
   * 
   * @param {string} productId - ID of product to remove
   */
  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item._id !== productId)
    );
  };

  /**
   * Checks if a product is in the wishlist
   * 
   * @param {string} productId - ID of product to check
   * @returns {boolean} True if product is in wishlist
   */
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item._id === productId);
  };

  /**
   * Clears all items from the wishlist
   */
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

/**
 * Custom hook to use wishlist context
 * Throws error if used outside of WishlistProvider
 * 
 * @returns {WishlistContextType} Wishlist context value
 */
export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
} 