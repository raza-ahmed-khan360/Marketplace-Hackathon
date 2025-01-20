'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Product from './Product';
import ProductCarousel from './Suggestion';
import { Product as ProductType } from '../../types';
import { client, productByIdQuery } from '../../lib/sanity';

/**
 * SingleProduct Page Component
 * Displays a detailed view of a single product with related product suggestions
 * Handles loading states and error cases
 * 
 * @returns {JSX.Element} A complete product page with details and suggestions
 */
export default function SingleProduct(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches product data from Sanity
     * Handles error cases and updates loading state
     */
    const fetchProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const product = await client.fetch(productByIdQuery(id));
        
        if (!product) {
          notFound();
        }
        
        setCurrentProduct(product);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading state display
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-2">Loading product...</div>
          <div className="text-sm text-gray-400">Please wait while we fetch the product details</div>
        </div>
      </div>
    );
  }

  // Error state display
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Handle case when product is not found
  if (!currentProduct) {
    return notFound();
  }

  return (
    <div className="min-h-screen">
      <Product product={currentProduct} />
      <ProductCarousel currentProductId={currentProduct._id} />
    </div>
  );
}