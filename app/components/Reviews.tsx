'use client';

import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { useUser } from '../contexts/UserContext';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsProps {
  productId: string;
  initialReviews?: Review[];
}

export default function Reviews({ productId, initialReviews = [] }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useUser();

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // In a real application, this would be an API call
    const newReview = {
      id: Date.now().toString(),
      userId: user._id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
    toast.success('Review submitted successfully!');
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="w-full py-8 font-inter">
      <h2 className="text-2xl font-semibold text-gray-scales-black mb-6">Customer Reviews</h2>
      
      {/* Average Rating Display */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-6 h-6 ${
                star <= Number(getAverageRating())
                  ? 'text-yellow-400'
                  : 'text-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold text-gray-scales-black">
          {getAverageRating()} out of 5
        </span>
        <span className="text-gray-scales-dark-gray">
          ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
        </span>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmitReview} className="mb-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                {star <= (hoveredRating || rating) ? (
                  <StarIcon className="w-6 h-6 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="w-6 h-6 text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-scales-dark-gray mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 rounded-3xs bg-gray-scales-white border border-gray-scales-light-gray focus:outline-none focus:ring-2 focus:ring-accents-accents/20 focus:border-accents-accents"
            rows={4}
            placeholder="Write your review here..."
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors"
        >
          Submit Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-scales-light-gray pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-scales-black">{review.userName}</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-scales-dark-gray">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-scales-dark-gray">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 