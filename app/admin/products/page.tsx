'use client'
import React from 'react';
import { useProducts } from '@/app/contexts/ProductsContext';

const ManageProducts = () => {
  const { products } = useProducts();

  return (
    <div>
      <h1>Manage Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
