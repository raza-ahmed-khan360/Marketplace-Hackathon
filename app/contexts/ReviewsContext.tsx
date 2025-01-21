'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

/**
 * Interface for review data structure
 */
interface Review {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

/**
 * Interface for review context value
 * Provides methods for managing product reviews
 */
interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, '_id' | 'createdAt'>) => void;
  getProductReviews: (productId: string) => Review[];
  updateReview: (reviewId: string, updates: Partial<Review>) => void;
  deleteReview: (reviewId: string) => void;
  getAverageRating: (productId: string) => number;
  getTotalReviews: (productId: string) => number;
  getRatingDistribution: (productId: string) => Record<number, number>;
}

// Create reviews context with initial undefined value
const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

/**
 * ReviewsProvider Component
 * Manages reviews state and provides review operations through context
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function ReviewsProvider({ children }: { children: ReactNode }) {
  // Initialize reviews state from localStorage if available
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== 'undefined') {
      const savedReviews = localStorage.getItem('reviews');
      return savedReviews ? JSON.parse(savedReviews) : [];
    }
    return [];
  });

  // Persist reviews to localStorage when they change
  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  /**
   * Adds a new review
   * Generates unique ID and timestamp
   * Validates rating range and required fields
   * 
   * @param {Omit<Review, '_id' | 'createdAt'>} reviewData - Review data without ID and timestamp
   * @throws {Error} If validation fails
   */
  const addReview = (reviewData: Omit<Review, '_id' | 'createdAt'>) => {
    // Validate rating range
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Validate required fields
    if (!reviewData.userName.trim() || !reviewData.comment.trim()) {
      throw new Error('Username and comment are required');
    }

    const newReview: Review = {
      _id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      ...reviewData
    };
    setReviews(prevReviews => [...prevReviews, newReview]);
  };

  /**
   * Gets all reviews for a specific product
   * Returns reviews sorted by date (newest first)
   * 
   * @param {string} productId - ID of product to get reviews for
   * @returns {Review[]} Array of reviews for the product
   */
  const getProductReviews = (productId: string): Review[] => {
    return reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  /**
   * Updates an existing review
   * Validates rating range if included in updates
   * 
   * @param {string} reviewId - ID of review to update
   * @param {Partial<Review>} updates - Partial review data to update
   * @throws {Error} If validation fails
   */
  const updateReview = (reviewId: string, updates: Partial<Review>) => {
    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    setReviews(prevReviews =>
      prevReviews.map(review =>
        review._id === reviewId
          ? { ...review, ...updates }
          : review
      )
    );
  };

  /**
   * Deletes a review
   * 
   * @param {string} reviewId - ID of review to delete
   */
  const deleteReview = (reviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
  };

  /**
   * Calculates average rating for a product
   * 
   * @param {string} productId - ID of product to calculate average for
   * @returns {number} Average rating (0-5) or 0 if no reviews
   */
  const getAverageRating = (productId: string): number => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / productReviews.length).toFixed(1));
  };

  /**
   * Gets total number of reviews for a product
   * 
   * @param {string} productId - ID of product to count reviews for
   * @returns {number} Total number of reviews
   */
  const getTotalReviews = (productId: string): number => {
    return reviews.filter(review => review.productId === productId).length;
  };

  /**
   * Gets distribution of ratings for a product
   * Returns object with count of reviews for each rating (1-5)
   * 
   * @param {string} productId - ID of product to get distribution for
   * @returns {Record<number, number>} Object with rating counts
   */
  const getRatingDistribution = (productId: string): Record<number, number> => {
    const distribution: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    const productReviews = getProductReviews(productId);
    
    productReviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    return distribution;
  };

  const value = {
    reviews,
    addReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getAverageRating,
    getTotalReviews,
    getRatingDistribution,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}

/**
 * Custom hook to use reviews context
 * Returns memoized reviews data and functions for a specific product
 * 
 * @param {string} productId - ID of product to get reviews for
 * @returns {Object} Object containing reviews data and functions
 * @throws {Error} If used outside of ReviewsProvider
 */
export function useReviews(productId: string) {
  const context = useContext(ReviewsContext);
  
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }

  // Memoize product-specific data and functions
  const value = useMemo(() => ({
    reviews: context.getProductReviews(productId),
    averageRating: context.getAverageRating(productId),
    totalReviews: context.getTotalReviews(productId),
    ratingDistribution: context.getRatingDistribution(productId),
    addReview: (reviewData: Omit<Review, '_id' | 'createdAt' | 'productId'>) => 
      context.addReview({ ...reviewData, productId }),
    updateReview: context.updateReview,
    deleteReview: context.deleteReview,
  }), [context, productId]);

  return value;
} 