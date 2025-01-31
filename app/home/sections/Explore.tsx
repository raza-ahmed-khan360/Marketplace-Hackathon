'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { getProducts } from "../../../lib/api";
import { useDataFetching } from "../../../lib/hooks/useDataFetching";
import { Product } from "../../../types";

const ExploreSection = () => {
  const router = useRouter();
  const { data: products, isLoading, error } = useDataFetching<Product[]>(getProducts);
 
  const handleMainImageClick = () => {
    if (products && products.length > 0) {
      router.push(`/single-product?id=${products[0]._id}`);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/single-product?id=${productId}`);
  };

  if (isLoading) {
    return (
      <section className="w-auto py-12 font-inter">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-gray-scales-dark-gray">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-auto py-12 font-inter">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-status-error">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="w-auto py-12 font-inter">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-10">
            <p className="text-lg text-gray-scales-dark-gray">No products found</p>
          </div>
        </div>
      </section>
    );
  }

  const mainProduct = products[0];
  const gridProducts = products.slice(1, 5);

  return (
    <section className="w-auto py-12 font-inter">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Section - Large Chair Image and Vertical Text */}
          <div className="relative flex justify-center items-center">
            {/* Large Chair Image */}
            <div className="h-auto">
              <Image
                onClick={handleMainImageClick}
                className="object-cover transition-transform duration-200 hover:scale-105 cursor-pointer w-full h-auto rounded-3xs shadow-md"
                width={648}
                height={648}
                alt={mainProduct.title}
                src={mainProduct.image}
              />
            </div>
            {/* Vertical Text */}
            <div className="absolute left-4 top-4 lg:top-1/2 lg:left-[-120px] font-inter lg:transform lg:-translate-y-1/2 lg:-rotate-90 text-lg lg:text-4xl font-semibold text-gray-scales-black">
              EXPLORE NEW AND POPULAR STYLES
            </div>
          </div>

          {/* Right Section - Grid of Products */}
          <div className="grid grid-cols-2 gap-6">
            {gridProducts.map((product) => (
              <div 
                key={product._id} 
                className="w-full aspect-square"
                onClick={() => handleProductClick(product._id)}
              >
                <Image
                  className="object-cover w-auto h-full transition-transform duration-200 hover:scale-105 cursor-pointer rounded-3xs shadow-md"
                  width={312}
                  height={312}
                  alt={product.title}
                  src={product.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
