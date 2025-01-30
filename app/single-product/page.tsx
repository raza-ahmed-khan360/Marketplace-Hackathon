'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { notFound } from 'next/navigation';
import Product from './Product';
import ProductCarousel from './Suggestion';
import { Product as ProductType } from '../../types';
import { client, productByIdQuery } from '../../lib/sanity';

export default function SingleProduct(): JSX.Element {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-lg text-gray-600 mb-2">Loading product...</div>
        <div className="text-sm text-gray-400">Please wait while we fetch the product details</div>
      </div>
    </div>}>
      <SingleProductContent />
    </Suspense>
  );
}

function SingleProductContent(): JSX.Element {
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get('id') : null;
  const [currentProduct, setCurrentProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
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
      } else {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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