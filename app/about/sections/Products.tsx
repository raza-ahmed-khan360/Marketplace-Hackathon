'use client';

import type { NextPage } from 'next';
import Image from "next/image";
import Link from "next/link";

/**
 * Interface for product item in the About page
 */
interface AboutProduct {
  image: string;
  name: string;
  price: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Products Section Component for About Page
 * Displays a curated selection of featured products in a grid layout
 * 
 * @returns {JSX.Element} A grid of featured products with images and details
 */
const Products: NextPage = () => {
  /**
   * Array of featured products to display
   * First product spans two columns on larger screens
   */
  const products: AboutProduct[] = [
    {
      image: "/About/sofa.png",
      name: "The Poplar suede sofa",
      price: "$999.00",
      width: 630,
      height: 375,
      className: "lg:col-span-2"
    },
    {
      image: "/About/Photo.png",
      name: "The Dandy chair",
      price: "$249.00",
      width: 305,
      height: 375
    },
    {
      image: "/About/Parent.png",
      name: "The Vintage chair",
      price: "$299.00",
      width: 305,
      height: 375
    }
  ];

  return (
    <section className="w-auto font-inter text-left flex-col flex items-center justify-center px-4 py-12">
      {/* Section Header */}
      <div className="container flex flex-row items-center justify-between py-0 mb-[48px]">
        <h2 className="text-[32px] leading-[110%] text-left capitalize font-semibold">
          Our Products
        </h2>
        <Link
          href="/products"
          className="text-lg font-medium text-gray-800 hover:underline flex items-center"
          aria-label="View all products"
        >
          View All
          <span className="ml-2 w-8 h-1 bg-gray-800" aria-hidden="true"></span>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid w-full h-auto grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-[20px]">
        {products.map((product, index) => (
          <div 
            key={index} 
            className={`group flex flex-col items-start justify-center gap-6 cursor-pointer ${product.className || ''}`}
          >
            {/* Product Image */}
            <div className="relative w-full overflow-hidden rounded-lg">
              <Image 
                src={product.image} 
                alt={product.name}
                width={product.width}
                height={product.height}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col items-start justify-start gap-2">
              <h3 className="text-xl leading-[140%] text-dark-primary font-medium">
                {product.name}
              </h3>
              <div className="text-lg leading-[150%] text-gray-600">
                {product.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
