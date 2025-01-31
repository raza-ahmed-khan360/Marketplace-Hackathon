'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '../../types';
import CardFeatured from '../components/CardFeatured';
import { client } from '../../lib/sanity';

/**
 * Interface for ProductCarousel component props
 * @property {string} currentProductId - ID of the currently displayed product to exclude from suggestions
 */
interface ProductCarouselProps {
  currentProductId: string;
}

/**
 * ProductCarousel Component
 * Displays a carousel of related/featured products, excluding the currently viewed product
 * Includes a header with a link to view all products
 * 
 * @param {ProductCarouselProps} props - Component props
 * @returns {JSX.Element} A grid of suggested products with header
 */
const ProductCarousel = ({ currentProductId }: ProductCarouselProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches related products from Sanity
     * Excludes the current product and limits to 5 random products
     */
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const query = `*[_type == "products" && _id != "${currentProductId}"] {
          _id,
          title,
          price,
          "oldPrice": priceWithoutDiscount,
          "image": image.asset->url,
          description,
          "status": badge,
          inventory
        }[0...5]`;
        
        const products = await client.fetch(query);
        
        if (!products || products.length === 0) {
          setRelatedProducts([]);
          return;
        }
        
        setRelatedProducts(products);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setError('Failed to load product suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId]);

  // Loading state display
  if (loading) {
    return (
      <div className="px-4 lg:px-20 py-8">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Loading suggestions...</div>
          <div className="text-sm text-gray-400">Please wait while we find related products</div>
        </div>
      </div>
    );
  }

  // Error state display
  if (error) {
    return (
      <div className="px-4 lg:px-20 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  // No products state
  if (relatedProducts.length === 0) {
    return (
      <div className="px-4 lg:px-20 py-8">
        <div className="text-center text-gray-600">No related products found</div>
      </div>
    );
  }

  return (
    <div className="px-4 font-inter lg:px-20 py-8">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-semibold tracking-widest text-gray-900 uppercase">
          Featured Products
        </h2>
        <Link 
          href="/products"
          className="text-lg font-medium text-gray-800 hover:underline flex items-center"
          aria-label="View all products"
        >
          View all
          <span className="ml-2 w-8 h-1 bg-gray-800" aria-hidden="true"></span>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[20px]">
        {relatedProducts.map((product) => (
          <CardFeatured
            key={product._id}
            id={product._id}
            imageSrc={product.image}
            title={product.title}
            price={typeof product.price === 'string' ? parseFloat(product.price) : product.price}
            oldPrice={product.oldPrice ? (typeof product.oldPrice === 'string' ? parseFloat(product.oldPrice) : product.oldPrice) : undefined}
            badgeText={product.status}
            badgeColor={product.status === 'New' ? 'bg-status-success' : 'bg-status-warning'}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
