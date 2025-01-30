'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import toast from 'react-hot-toast';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface CardProps {
  id: string;
  imageSrc: string;
  title: string;
  price: number;
  oldPrice?: number;
  badgeText?: string;
  badgeColor?: string;
}

export default function CardFeatured({
  id,
  imageSrc,
  title,
  price,
  oldPrice,
  badgeText,
  badgeColor = "bg-status-success",
}: CardProps): JSX.Element {
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();
  const isInWishlist = wishlistItems.some(item => item._id === id);

  const formatPrice = (value: number): string => {
    return (value || 0).toFixed(2);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id,
      title,
      price,
      quantity: 1,
      image: imageSrc
    });
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(id);
      toast.success('Removed from wishlist!');
    } else {
      addToWishlist({
        _id: id,
        title,
        price,
        image: imageSrc,
        status: badgeText,
        description: '',
        inventory: 0,
        oldPrice: oldPrice
      });
      toast.success('Added to wishlist!');
    }
  };

  const handleClick = () => {
    router.push(`/single-product?id=${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex w-full cursor-pointer font-poppins font-regular flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      {badgeText && (
        <div 
          className={`absolute left-4 top-4 z-10 rounded-full ${badgeColor} px-2 py-1 text-sm font-semibold text-white`}
        >
          {badgeText}
        </div>
      )}
      
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-lg font-medium font-inter text-gray-900 line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-auto flex font-sale-price items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-900">
              ${formatPrice(price)}
            </span>
            {oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${formatPrice(oldPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlistToggle}
              className={`w-10 h-10 rounded-lg flex items-center justify-center shadow transition-all ${
                isInWishlist 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                  : 'bg-gray-50 text-gray-600 hover:text-red-500 hover:bg-red-50'
              }`}
              aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isInWishlist ? (
                <HeartIconSolid className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center cursor-pointer shadow hover:bg-gray-50 transition-colors"
              aria-label="Add to Cart"
            >
              <ShoppingCartIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}