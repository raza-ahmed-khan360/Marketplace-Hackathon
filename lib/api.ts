import { client } from './sanity';
import { Product, Category } from '../types';
import {
  productsQuery,
  featuredProductsQuery,
  productByIdQuery,
  productsByCategoryQuery,
  relatedProductsQuery,
  searchProductsQuery,
  categoriesQuery,
  categoryByIdQuery,
} from './queries';

// Error handling wrapper
const handleFetch = async <T>(promise: Promise<T>): Promise<[T | null, Error | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    console.error('API Error:', error);
    return [null, error as Error];
  }
};

// Products API
export const getProducts = async (): Promise<[Product[] | null, Error | null]> => {
  return handleFetch(client.fetch(productsQuery));
};

export const getFeaturedProducts = async (): Promise<[Product[] | null, Error | null]> => {
  return handleFetch(client.fetch(featuredProductsQuery));
};

export const getProductById = async (id: string): Promise<[Product | null, Error | null]> => {
  return handleFetch(client.fetch(productByIdQuery(id)));
};

export const getProductsByCategory = async (categoryId: string): Promise<[Product[] | null, Error | null]> => {
  return handleFetch(client.fetch(productsByCategoryQuery(categoryId)));
};

export const getRelatedProducts = async (productId: string): Promise<[Product[] | null, Error | null]> => {
  return handleFetch(client.fetch(relatedProductsQuery(productId)));
};

export const searchProducts = async (query: string): Promise<[Product[] | null, Error | null]> => {
  return handleFetch(client.fetch(searchProductsQuery(query)));
};

// Categories API
export const getCategories = async (): Promise<[Category[] | null, Error | null]> => {
  return handleFetch(client.fetch(categoriesQuery));
};

export const getCategoryById = async (id: string): Promise<[Category | null, Error | null]> => {
  return handleFetch(client.fetch(categoryByIdQuery(id)));
}; 