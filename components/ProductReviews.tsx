import { useReviews } from '../app/contexts/ReviewsContext';

export default function ProductReviews({ productId }: { productId: string }) {
  const { reviews, addReview } = useReviews(productId);
  
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review._id} className="border-b pb-4">
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 