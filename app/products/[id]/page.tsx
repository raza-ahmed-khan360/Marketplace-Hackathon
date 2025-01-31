'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { useCart } from '../../contexts/CartContext';
import { notFound } from 'next/navigation';
import { toast } from 'react-hot-toast';
import CardFeatured from '../../components/CardFeatured';
import { client } from '../../../lib/sanity';
import { Product } from '../../../types';
import { useDataFetching } from '../../../lib/hooks/useDataFetching';
import { getProductById, getRelatedProducts } from '../../../lib/api';

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading, error } = useDataFetching<Product>(
    () => getProductById(params.id),
    [params.id]
  );
  
  const { data: relatedProducts, isLoading: relatedLoading } = useDataFetching<Product[]>(
    () => getRelatedProducts(params.id),
    [params.id]
  );

  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-[600px] bg-gray-200 rounded-lg mb-4" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="w-full">
      <div className="w-auto px-4 lg:px-20 py-8 text-left text-xl text-gray-scales-white font-inter">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Image Section */}
          <div className="flex-1 flex justify-center items-center">
            <Image
              className="rounded-lg object-cover w-full h-auto max-w-[675px] max-h-[607px]"
              width={675}
              height={607}
              alt={product.title}
              src={product.image}
            />
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-scales-black capitalize">
              {product.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="text-lg max-w-max lg:text-xl font-semibold text-center bg-accents-accents rounded-full py-4 px-8 text-white">
                ${product.price.toFixed(2)} USD
              </div>
              {product.oldPrice && (
                <div className="text-lg text-gray-500 line-through">
                  ${product.oldPrice.toFixed(2)} USD
                </div>
              )}
            </div>

            <div className="w-full h-[1px] mx-auto bg-gainsboro"/>

            <p className="text-base lg:text-lg text-gray-scales-black opacity-60 leading-relaxed">
              {product.description}
            </p>

            <button 
              onClick={handleAddToCart}
              className="flex items-center text-[20px] cursor-pointer justify-center gap-3 bg-accents-accents text-white font-semibold px-6 py-3 rounded-lg w-max hover:opacity-90 transition-opacity"
            >
              <Image
                width={30}
                height={30}
                alt="Add to cart"
                src="/singleProduct/Buy 2.svg"
              />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {!relatedLoading && relatedProducts && relatedProducts.length > 0 && (
        <div className="px-4 lg:px-20 py-8">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <CardFeatured
                key={relatedProduct._id}
                id={relatedProduct._id}
                imageSrc={relatedProduct.image}
                title={relatedProduct.title}
                price={relatedProduct.price}
                oldPrice={relatedProduct.oldPrice}
                badgeText={relatedProduct.status}
                badgeColor={relatedProduct.status === 'New' ? 'bg-status-success' : 'bg-status-warning'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}