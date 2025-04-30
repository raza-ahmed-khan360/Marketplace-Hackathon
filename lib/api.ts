import { client } from '@/sanity/lib/client';
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

// Cache configuration
const CACHE_MAX_AGE = 60 * 5; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// Error handling wrapper with caching
const handleFetch = async <T>(
  promise: Promise<T>, 
  cacheKey?: string
): Promise<[T | null, Error | null]> => {
  try {
    // Check cache if cacheKey provided
    if (cacheKey) {
      const cached = cache.get(cacheKey);
      const now = Date.now();
      if (cached && now - cached.timestamp < CACHE_MAX_AGE * 1000) {
        return [cached.data as T, null];
      }
    }

    const data = await promise;
    
    // Store in cache if cacheKey provided
    if (cacheKey && data) {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }

    if (!data) {
      throw new Error('No data returned from Sanity');
    }

    return [data, null];
  } catch (error) {
    console.error('API Error:', error);
    return [null, error as Error];
  }
};

// Products API
export const getProducts = async (): Promise<[Product[] | null, Error | null]> => {
  return handleFetch(client.fetch(productsQuery), 'all-products');
};

export const getFeaturedProducts = async (): Promise<[Product[] | null, Error | null]> => {
  return handleFetch(client.fetch(featuredProductsQuery), 'featured-products');
};

export const getProductById = async (id: string): Promise<[Product | null, Error | null]> => {
  if (!id) throw new Error('Product ID is required');
  return handleFetch(client.fetch(productByIdQuery(id)), `product-${id}`);
};

export const getProductsByCategory = async (categoryId: string): Promise<[Product[] | null, Error | null]> => {
  if (!categoryId) throw new Error('Category ID is required');
  return handleFetch(client.fetch(productsByCategoryQuery(categoryId)), `category-products-${categoryId}`);
};

export const getRelatedProducts = async (productId: string): Promise<[Product[] | null, Error | null]> => {
  if (!productId) throw new Error('Product ID is required');
  return handleFetch(client.fetch(relatedProductsQuery(productId)), `related-products-${productId}`);
};

export const searchProducts = async (query: string): Promise<[Product[] | null, Error | null]> => {
  if (!query) throw new Error('Search query is required');
  // Don't cache search results as they should be fresh
  return handleFetch(client.fetch(searchProductsQuery(query)));
};

// Categories API
export const getCategories = async (): Promise<[Category[] | null, Error | null]> => {
  return handleFetch(client.fetch(categoriesQuery), 'all-categories');
};

export const getCategoryById = async (id: string): Promise<[Category | null, Error | null]> => {
  if (!id) throw new Error('Category ID is required');
  return handleFetch(client.fetch(categoryByIdQuery(id)), `category-${id}`);
};

// Cache management
export const clearCache = () => {
  cache.clear();
};

export const invalidateCacheItem = (key: string) => {
  cache.delete(key);
};