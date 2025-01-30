'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Category } from '../../types';

interface CardProps {
  category: Category;
}

const Card = ({ category }: CardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products?category=${category._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full sm:w-[312px] h-[250px] cursor-pointer rounded-3xs overflow-hidden relative group font-inter"
    >
      <Image
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        width={312}
        height={250}
        alt={category.title}
        src={category.image}
      />
      <div className="absolute inset-0 bg-gray-scales-black bg-opacity-40 flex flex-col items-center justify-center text-gray-scales-white">
        <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
        <p className="text-sm text-gray-scales-white/80">{category.products} Products</p>
      </div>
    </div>
  );
};

interface CategoryProductsProps {
  categories: Category[];
}

const CategoryProducts = ({ categories }: CategoryProductsProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {categories.map((category) => (
        <Card key={category._id} category={category} />
      ))}
    </div>
  );
};

export default CategoryProducts;
