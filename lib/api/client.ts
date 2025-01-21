/**
 * API Client module
 * Provides a type-safe interface for making API requests with proper error handling
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { config } from '../config';
import { handleError, APIError, ValidationError, validateId } from '../utils/error';
import type { Product, Category } from '../../types';

// Initialize Sanity client
const client = createClient(config.sanity);
const builder = imageUrlBuilder(client);

// Helper function to build image URLs
export const urlFor = (source: any) => builder.image(source);

/**
 * Product-related API functions
 */
export const ProductAPI = {
  /**
   * Fetch all products with optional pagination
   */
  async getAll(page = 1, limit = config.api.itemsPerPage): Promise<Product[]> {
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const query = `*[_type == "products"] | order(_createdAt desc) [${start}...${end}] {
      _id,
      title,
      price,
      priceWithoutDiscount,
      description,
      "image": image.asset->url,
      badge,
      inventory,
      tags,
      category->
    }`;

    const [data, error] = await handleError(client.fetch(query), {
      context: 'ProductAPI.getAll',
      page,
      limit,
    });

    if (error) throw new APIError('Failed to fetch products');
    return data || [];
  },

  /**
   * Fetch a single product by ID
   */
  async getById(id: string): Promise<Product> {
    if (!validateId(id)) {
      throw new ValidationError('Invalid product ID', 'id');
    }

    const query = `*[_type == "products" && _id == $id][0] {
      _id,
      title,
      price,
      priceWithoutDiscount,
      description,
      "image": image.asset->url,
      badge,
      inventory,
      tags,
      category->
    }`;

    const [data, error] = await handleError(client.fetch(query, { id }), {
      context: 'ProductAPI.getById',
      id,
    });

    if (error) throw new APIError('Failed to fetch product');
    if (!data) throw new APIError('Product not found', 404, 'NOT_FOUND');
    
    return data;
  },

  /**
   * Search products by query
   */
  async search(query: string): Promise<Product[]> {
    if (!query.trim()) {
      throw new ValidationError('Search query cannot be empty', 'query');
    }

    const searchQuery = `*[_type == "products" && (
      title match "*${query}*" ||
      description match "*${query}*" ||
      category->title match "*${query}*"
    )] {
      _id,
      title,
      price,
      "image": image.asset->url,
      badge
    }[0...${config.api.maxSearchResults}]`;

    const [data, error] = await handleError(
      client.fetch(searchQuery),
      { context: 'ProductAPI.search', query }
    );

    if (error) throw new APIError('Failed to search products');
    return data || [];
  },
};

/**
 * Category-related API functions
 */
export const CategoryAPI = {
  /**
   * Fetch all categories
   */
  async getAll(): Promise<Category[]> {
    const query = `*[_type == "categories"] | order(title asc) {
      _id,
      title,
      "image": image.asset->url,
      "products": count(*[_type == "products" && references(^._id)])
    }`;

    const [data, error] = await handleError(client.fetch(query), {
      context: 'CategoryAPI.getAll',
    });

    if (error) throw new APIError('Failed to fetch categories');
    return data || [];
  },

  /**
   * Fetch products by category ID
   */
  async getProducts(categoryId: string): Promise<Product[]> {
    if (!validateId(categoryId)) {
      throw new ValidationError('Invalid category ID', 'categoryId');
    }

    const query = `*[_type == "products" && references($categoryId)] {
      _id,
      title,
      price,
      "image": image.asset->url,
      badge,
      category->
    }`;

    const [data, error] = await handleError(
      client.fetch(query, { categoryId }),
      { context: 'CategoryAPI.getProducts', categoryId }
    );

    if (error) throw new APIError('Failed to fetch category products');
    return data || [];
  },
}; 