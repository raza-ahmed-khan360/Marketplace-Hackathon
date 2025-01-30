import { useState } from 'react';
import { useCategories } from '../app/contexts/CategoriesContext';

export default function ProductFilters() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const { categories } = useCategories();
  
  return (
    <div className="w-64 p-4 border-r">
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Categories</h3>
        {categories.map(cat => (
          <label key={cat._id} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" />
            {cat.title}
          </label>
        ))}
      </div>
    </div>
  );
} 