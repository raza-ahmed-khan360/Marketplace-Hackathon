'use client';

import { useState, useCallback } from 'react';
import CardFeatured from "../../components/CardFeatured";
import { Product } from "../../../types";
import { getFeaturedProducts } from "../../../lib/api";
import { useDataFetching } from "../../../lib/hooks/useDataFetching";

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded-lg mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function FeaturedProducts() {
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const handleRetry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount, maxRetries]);

  const { data: products, isLoading, error } = useDataFetching<Product[]>(
    getFeaturedProducts,
    [retryCount]
  );

  if (isLoading) {
    return (
      <section className="w-auto py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-inter lg:text-[32px] font-semibold capitalize mb-12 text-gray-scales-black">
            Featured Products
          </h2>
          <ProductSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-auto py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl lg:text-[32px] font-inter font-semibold capitalize mb-12 text-gray-scales-black">
            Featured Products
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          {retryCount < maxRetries && (
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-accents-accents text-white rounded-lg hover:bg-accents-dark-accents transition-colors"
            >
              Try Again ({maxRetries - retryCount} attempts remaining)
            </button>
          )}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="w-auto py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-inter lg:text-[32px] font-semibold capitalize mb-8">
            Featured Products
          </h2>
          <p className="text-gray-500">No featured products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-auto py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl lg:text-[32px] font-inter font-semibold capitalize mb-12 text-gray-scales-black">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <CardFeatured
              key={product._id}
              id={product._id}
              imageSrc={product.image}
              title={product.title}
              price={product.price}
              oldPrice={product.oldPrice}
              badgeText={product.status}
              badgeColor={product.status === 'New' ? 'bg-status-success' : 'bg-status-warning'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
