'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from "../../types";
import { getProducts } from "../../lib/api";
import CardGrid, { Card } from './CardProducts';

/**
 * FeaturedProducts Component
 * Displays a grid of random products using the regular product card component
 * 
 * @returns {JSX.Element} Grid of random product cards
 */
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, fetchError] = await getProducts();
      if (fetchError) throw fetchError;
      if (data) {
        // Shuffle the products array and take first 6
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setProducts(shuffled.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load featured products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <section className="w-full py-12 font-inter bg-gray-scales-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl lg:text-[32px] font-semibold capitalize mb-12 text-gray-scales-black">
            Featured Products
          </h2>
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-gray-scales-dark-gray">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-12 font-inter bg-gray-scales-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl lg:text-[32px] font-semibold capitalize mb-12 text-gray-scales-black">
            Featured Products
          </h2>
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <p className="text-lg text-status-error">{error}</p>
            <button 
              onClick={fetchProducts}
              className="px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 font-inter bg-gray-scales-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl lg:text-[32px] font-semibold capitalize mb-12 text-gray-scales-black">
          Featured Products
        </h2>
        {products.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-gray-scales-dark-gray">No featured products available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 