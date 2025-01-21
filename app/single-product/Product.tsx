'use client';

import Image from "next/image";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from '../contexts/WishlistContext';
import { Product as ProductType } from "../../types";
import toast from 'react-hot-toast';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Reviews from '../components/Reviews';
import SocialShare from '../components/SocialShare';

/**
 * Interface for Product component props
 * @property {ProductType} product - The product data to display
 */
interface ProductProps {
  product: ProductType;
}

/**
 * Product Component
 * Displays detailed information about a single product including image, title, price, and description
 * Provides functionality to add the product to cart
 * 
 * @param {ProductProps} props - Component props
 * @returns {JSX.Element} A detailed product view with add to cart functionality
 */
const Product: React.FC<ProductProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  /**
   * Handles adding the product to cart
   * Creates a cart item from the product data and adds it to the cart context
   */
  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    toast.success('Added to cart!', {
      style: {
        border: '1px solid #4CAF50',
        padding: '16px',
        color: '#1a1a1a',
      },
      iconTheme: {
        primary: '#4CAF50',
        secondary: '#FFFFFF',
      },
    });
  };

  /**
   * Handles toggling the product in wishlist
   */
  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist!', {
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#1a1a1a',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#FFFFFF',
        },
      });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!', {
        style: {
          border: '1px solid #4CAF50',
          padding: '16px',
          color: '#1a1a1a',
        },
        iconTheme: {
          primary: '#4CAF50',
          secondary: '#FFFFFF',
        },
      });
    }
  };

  return (
    <div className="w-auto px-4 lg:px-20 py-8 text-left text-xl text-gray-scales-white font-inter">
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Product Image Section */}
        <div className="flex-1 flex justify-center items-center">
          <Image
            className="rounded-lg object-cover w-full h-auto max-w-[675px] max-h-[607px]"
            width={675}
            height={607}
            alt={product.title}
            src={product.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Product Details Section */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Product Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-scales-black capitalize">
            {product.title}
          </h1>

          {/* Product Price */}
          <div className="flex items-center gap-4">
            <div className="text-lg max-w-max lg:text-xl font-semibold text-center bg-accents-accents rounded-full py-4 px-8 text-white">
              ${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)} USD
            </div>
            {product.oldPrice && (
              <div className="text-lg text-gray-500 line-through">
                ${typeof product.oldPrice === 'number' ? product.oldPrice.toFixed(2) : parseFloat(product.oldPrice).toFixed(2)} USD
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-[1px] mx-auto bg-gainsboro"/>

          {/* Product Description */}
          <p className="text-base lg:text-lg text-gray-scales-black opacity-60 leading-relaxed">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex items-center text-[20px] cursor-pointer justify-center gap-3 bg-accents-accents text-white font-semibold px-6 py-3 rounded-lg w-max hover:opacity-90 transition-opacity"
              aria-label="Add to cart"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              Add to Cart
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`flex items-center text-[20px] cursor-pointer justify-center gap-3 font-semibold px-6 py-3 rounded-lg transition-colors ${
                isInWishlist 
                  ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                  : 'bg-gray-50 text-gray-700 hover:text-gray-50 hover:bg-gray-200'
              }`}
              aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isInWishlist ? (
                <>
                  <HeartIconSolid className="w-6 h-6" />
                  Remove from Wishlist
                </>
              ) : (
                <>
                  <HeartIcon className="w-6 h-6" />
                  Add to Wishlist
                </>
              )}
            </button>
          </div>

          {/* Social Share */}
          <div className="mt-8">
            <SocialShare 
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={product.title}
            />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Reviews productId={product._id} />
      </div>
    </div>
  );
};

export default Product;
