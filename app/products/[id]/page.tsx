'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import { useCart } from '../../contexts/CartContext';
import { Product, products } from '../../data/products';
import { notFound } from 'next/navigation';
import { toast } from 'react-hot-toast';
import CardFeatured from '../../components/CardFeatured';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === params.id);
    if (!foundProduct) {
      notFound();
    }
    setProduct(foundProduct);

    // Get 4 random products for related products section
    const otherProducts = products.filter(p => p.id !== params.id);
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
    setRelatedProducts(shuffled.slice(0, 4));
  }, [params.id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.image
      });
      toast.success('Added to cart!');
    }
  };

  return (
    <div className="w-full">
      {/* Product Details Section */}
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
            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-scales-black capitalize">
              {product.title}
            </h1>

            {/* Product Price */}
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

            {/* Divider */}
            <div className="w-full h-[1px] mx-auto bg-gainsboro"/>

            {/* Product Description */}
            <p className="text-base lg:text-lg text-gray-scales-black opacity-60 leading-relaxed">
              {product.description}
            </p>

            {/* Add to Cart Button */}
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
      <div className="px-4 lg:px-20 py-8">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <CardFeatured
              key={relatedProduct.id}
              id={relatedProduct.id}
              imageSrc={relatedProduct.image}
              title={relatedProduct.title}
              price={relatedProduct.price}
              oldPrice={relatedProduct.oldPrice}
              badgeText={relatedProduct.status}
              badgeColor={relatedProduct.status === 'New' ? 'bg-green-500' : 'bg-orange-500'}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 