import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMemo } from 'react';

interface Review {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Base reviews atom with localStorage persistence
const reviewsAtom = atomWithStorage<Review[]>('reviews', []);

// Create derived atoms for reviews operations
const reviewsOperationsAtom = atom(
  (get) => ({
    getProductReviews: (productId: string): Review[] => {
      const reviews = get(reviewsAtom);
      return reviews
        .filter(review => review.productId === productId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    getAverageRating: (productId: string): number => {
      const reviews = get(reviewsAtom).filter(review => review.productId === productId);
      if (reviews.length === 0) return 0;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return Number((sum / reviews.length).toFixed(1));
    },
    getTotalReviews: (productId: string): number => {
      return get(reviewsAtom).filter(review => review.productId === productId).length;
    },
    getRatingDistribution: (productId: string): Record<number, number> => {
      const reviews = get(reviewsAtom).filter(review => review.productId === productId);
      const distribution: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
      reviews.forEach(review => {
        distribution[review.rating]++;
      });
      return distribution;
    }
  }),
  (get, set, action: {
    type: 'add' | 'update' | 'delete';
    payload: any;
  }) => {
    const reviews = get(reviewsAtom);
    
    switch (action.type) {
      case 'add': {
        const reviewData: Omit<Review, '_id' | 'createdAt'> = action.payload;
        if (reviewData.rating < 1 || reviewData.rating > 5) {
          throw new Error('Rating must be between 1 and 5');
        }
        const newReview: Review = {
          _id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          ...reviewData
        };
        set(reviewsAtom, [...reviews, newReview]);
        break;
      }
      case 'update': {
        const { reviewId, updates } = action.payload;
        if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
          throw new Error('Rating must be between 1 and 5');
        }
        set(reviewsAtom, reviews.map(review =>
          review._id === reviewId ? { ...review, ...updates } : review
        ));
        break;
      }
      case 'delete': {
        const reviewId = action.payload;
        set(reviewsAtom, reviews.filter(review => review._id !== reviewId));
        break;
      }
    }
  }
);

/**
 * Custom hook to use reviews functionality for a specific product
 */
export function useReviews(productId: string) {
  const [operations] = useAtom(reviewsOperationsAtom);
  const [, dispatch] = useAtom(reviewsOperationsAtom);

  return useMemo(() => ({
    reviews: operations.getProductReviews(productId),
    averageRating: operations.getAverageRating(productId),
    totalReviews: operations.getTotalReviews(productId),
    ratingDistribution: operations.getRatingDistribution(productId),
    addReview: (reviewData: Omit<Review, '_id' | 'createdAt' | 'productId'>) => 
      dispatch({ type: 'add', payload: { ...reviewData, productId } }),
    updateReview: (reviewId: string, updates: Partial<Review>) => 
      dispatch({ type: 'update', payload: { reviewId, updates } }),
    deleteReview: (reviewId: string) => 
      dispatch({ type: 'delete', payload: reviewId }),
  }), [productId, operations, dispatch]);
}