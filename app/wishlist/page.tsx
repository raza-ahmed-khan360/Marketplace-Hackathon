'use client';

import { useWishlist } from '../contexts/WishlistContext';
import CardFeatured from '../components/CardFeatured';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <section className="w-auto py-12 font-inter">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-4xl lg:text-[32px] font-semibold text-gray-scales-black mb-12">
          My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-gray-scales-dark-gray">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item._id} className="relative">
                <CardFeatured
                  id={item._id}
                  imageSrc={item.image}
                  title={item.title}
                  price={item.price}
                  oldPrice={item.oldPrice}
                  badgeText={item.status}
                />
                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="absolute top-3 right-3 p-2 bg-status-error rounded-3xs hover:bg-red-600 transition-colors shadow-md"
                  aria-label="Remove from wishlist"
                >
                  <TrashIcon className="w-5 h-5 text-gray-scales-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 