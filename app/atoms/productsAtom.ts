import { client } from '@/sanity/lib/client';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

interface Product {
  price: number;
  _id: string;
  name: string;
}

// Base products atom
const productsAtom = atom<Product[]>([]);

// Fetch products atom
const fetchProductsAtom = atom(
  null,
  async (get, set) => {
    const data = await client.fetch('*[_type == "product"]');
    set(productsAtom, data);
  }
);

// Set products atom
const setProductsAtom = atom(
  null,
  (get, set, newProducts: Product[]) => {
    set(productsAtom, newProducts);
  }
);

/**
 * Custom hook to use products functionality
 */
export function useProducts() {
  const [products] = useAtom(productsAtom);
  const [, setProducts] = useAtom(setProductsAtom);
  const [, fetchProducts] = useAtom(fetchProductsAtom);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, setProducts };
}
