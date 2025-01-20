'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { Product } from "../../types";
import { getProducts } from "../../lib/api";
import toast from 'react-hot-toast';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

/**
 * Card Component
 * Individual product card displaying product details and add to cart functionality
 * 
 * @param {Object} props - Component props
 * @param {Product} props.product - Product data to display
 * @returns {JSX.Element} Product card with interactive elements
 */
export const Card = ({ product }: { product: Product }): JSX.Element => {
  const router = useRouter();
  const { addItem } = useCart();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  /**
   * Formats price value to display with two decimal places
   * Handles both string and number inputs
   * 
   * @param {number | string} value - Price value to format
   * @returns {string} Formatted price string
   */
  const formatPrice = (value: number | string): string => {
    const numericPrice = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  /**
   * Handles adding product to cart
   * Prevents event propagation to avoid triggering card click
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    addItem({
      id: product._id,
      title: product.title,
      price: numericPrice,
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
   * Handles adding or removing product from wishlist
   * Prevents event propagation to avoid triggering card click
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  /**
   * Navigates to product detail page
   */
  const handleClick = () => {
    router.push(`/single-product?id=${product._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col p-4 bg-gray-scales-white rounded-3xs cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Product Image Section */}
      <div className="w-full relative">
        <Image
          src={product.image}
          alt={product.title}
          className="rounded-3xs transition-transform duration-200 hover:scale-105 object-cover w-full"
          width={312}
          height={312}
        />
        {/* Product Status Badge */}
        {product.status && (
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-gray-scales-white text-sm font-medium ${
              product.status === "New" ? "bg-status-success" : "bg-status-warning"
            }`}
          >
            {product.status}
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-scales-black capitalize">{product.title}</h3>
          {/* Price Display */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-scales-black">${formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm line-through text-gray-scales-gray">
                ${formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`w-12 h-12 rounded-3xs flex items-center justify-center shadow transition-all ${
              isInWishlist 
                ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                : 'bg-gray-scales-off-white text-gray-scales-dark-gray hover:text-red-500 hover:bg-red-50'
            }`}
            aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isInWishlist ? (
              <HeartIconSolid className="w-6 h-6" />
            ) : (
              <HeartIcon className="w-6 h-6" />
            )}
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-12 h-12 bg-gray-scales-off-white rounded-3xs flex items-center justify-center cursor-pointer shadow hover:bg-gray-100 transition-colors z-10"
            aria-label="Add to Cart"
          >
            <ShoppingCartIcon className="w-6 h-6 text-gray-scales-dark-gray" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * CardGrid Component
 * Displays a grid of product cards with loading and error states
 * 
 * @returns {JSX.Element} Grid of product cards
 */
export default function CardGrid(): JSX.Element {
  // State management for products, loading, and error states
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const [data, fetchError] = await getProducts();
        if (fetchError) throw fetchError;
        if (data) {
          setProducts(data.slice(0, 6)); // Show only first 6 products
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Loading state display
  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  // Error state display
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  // Render product grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product._id} product={product} />
      ))}
    </div>
  );
}
