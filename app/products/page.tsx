'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card } from '../components/CardProducts';
import { Product } from '../../types';
import { getProducts, getProductsByCategory, getCategories } from '../../lib/api';

interface PriceRange {
  min: number;
  max: number | null;
  label: string;
}

const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: null, label: 'Over $200' },
];

const TAGS = [
  'New Arrivals',
  'Sale',
  'Best Seller',
  'Featured'
];

/**
 * Products Page Component
 * Displays a grid of products with optional category filtering
 * Includes a newsletter subscription section and Instagram feed
 * 
 * @returns {JSX.Element} A complete products page with filters and additional sections
 */
export default function Products() {
  return (
    <Suspense fallback={<div className="w-auto py-12 font-inter">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center py-10">
          <p className="text-lg text-gray-scales-dark-gray">Loading products...</p>
        </div>
      </div>
    </div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ _id: string; title: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [displayCount, setDisplayCount] = useState(6); // Number of products to display initially
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<Set<number>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const categoryId = searchParams ? searchParams.get('category') : null;

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const [data, error] = await getCategories();
        if (error) throw error;
        if (data) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products based on category filter
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [data, fetchError] = categoryId 
          ? await getProductsByCategory(categoryId)
          : await getProducts();

        if (fetchError) throw fetchError;
        
        if (!data || data.length === 0) {
          setFilteredProducts([]);
          return;
        }

        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Apply all filters
  useEffect(() => {
    let filtered = [...products];

    // Apply price range filter
    if (selectedPriceRanges.size > 0) {
      filtered = filtered.filter(product => {
        const price = parseFloat(typeof product.price === 'string' ? product.price : product.price.toString());
        return Array.from(selectedPriceRanges).some(index => {
          const range = PRICE_RANGES[index];
          if (range.max === null) {
            return price >= range.min;
          }
          return price >= range.min && price <= range.max;
        });
      });
    }

    // Apply tags filter
    if (selectedTags.size > 0) {
      filtered = filtered.filter(product => 
        selectedTags.has(product.status || '')
      );
    }

    // Apply categories filter
    if (selectedCategories.size > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.has(product.category?._id || '')
      );
    }

    setFilteredProducts(filtered);
    setDisplayCount(6); // Reset display count when filters change
  }, [selectedPriceRanges, selectedTags, selectedCategories, products]);

  const handlePriceRangeChange = (index: number) => {
    setSelectedPriceRanges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleClearFilters = () => {
    setSelectedPriceRanges(new Set());
    setSelectedTags(new Set());
    setSelectedCategories(new Set());
  };

  /**
   * Handles newsletter subscription
   * @param {React.FormEvent} e - Form submission event
   */
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription for:', newsletterEmail);
    setNewsletterEmail('');
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6); // Load 6 more products
  };

  // Get category title
  const getCategoryTitle = useCallback(() => {
    if (!categoryId || products.length === 0) return 'All Products';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? `${category.title} Products` : 'All Products';
  }, [categoryId, products.length, categories]);
 
  // Loading state display
  if (loading) {
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

  // Error state display
  if (error) {
    return (
      <section className="w-auto py-12 font-inter">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <p className="text-lg text-status-error">{error}</p>
            <button 
              onClick={() => setProducts([])}
              className="px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="w-auto font-inter">
      {/* Products Header */}
      <section className="w-auto py-12 bg-gray-scales-white">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl lg:text-[32px] font-semibold capitalize text-gray-scales-black mb-12">
            {getCategoryTitle()}
          </h1>

          {/* Products Grid with Sidebar Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full lg:w-[280px] shrink-0">
              <div className="bg-gray-scales-white p-6 rounded-3xs border border-gray-scales-light-gray">
                <h2 className="text-2xl font-semibold text-gray-scales-black mb-8">Filters</h2>
                
                {/* Categories Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-scales-black mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label 
                        key={category._id}
                        className="flex items-center gap-3 text-gray-scales-dark-gray hover:text-accents-dark-accents transition-colors cursor-pointer"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedCategories.has(category._id)}
                          onChange={() => handleCategoryChange(category._id)}
                          className="w-4 h-4 rounded-sm text-accents-accents focus:ring-accents-dark-accents"
                        />
                        <span className="text-sm capitalize">{category.title}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-scales-black mb-4">Price Range</h3>
                  <div className="space-y-3">
                    {PRICE_RANGES.map((range, index) => (
                      <label 
                        key={range.label}
                        className="flex items-center gap-3 text-gray-scales-dark-gray hover:text-accents-dark-accents transition-colors cursor-pointer"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedPriceRanges.has(index)}
                          onChange={() => handlePriceRangeChange(index)}
                          className="w-4 h-4 rounded-sm text-accents-accents focus:ring-accents-dark-accents"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-scales-black mb-4">Tags</h3>
                  <div className="space-y-3">
                    {TAGS.map((tag) => (
                      <label 
                        key={tag}
                        className="flex items-center gap-3 text-gray-scales-dark-gray hover:text-accents-dark-accents transition-colors cursor-pointer"
                      >
                        <input 
                          type="checkbox"
                          checked={selectedTags.has(tag)}
                          onChange={() => handleTagChange(tag)}
                          className="w-4 h-4 rounded-sm text-accents-accents focus:ring-accents-dark-accents"
                        />
                        <span className="text-sm">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button 
                  onClick={handleClearFilters}
                  className="w-full px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-lg text-gray-scales-dark-gray">No products found matching your filters.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.slice(0, displayCount).map((product) => (
                      <Card
                        key={product._id}
                        product={product}
                      />
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {displayCount < filteredProducts.length && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors font-semibold"
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="w-auto py-12 bg-gray-scales-off-white">
        <div className="container mx-auto px-4">
          <div className="max-w-[400px] sm:max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl lg:text-[32px] font-semibold text-gray-scales-black text-center mb-8">
              Subscribe to our newsletter
            </h2>
            
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row items-stretch gap-4">
              <div className="flex-grow">
                <input 
                  type="email" 
                  placeholder="Email address..." 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full h-[46px] px-4 rounded-3xs border border-gray-scales-light-gray bg-gray-scales-white focus:outline-none focus:border-accents-dark-accents text-gray-scales-dark-gray"
                  required
                  aria-label="Email address for newsletter"
                />
              </div>
              
              <button 
                type="submit"
                className="px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="w-auto py-12 bg-gray-scales-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl lg:text-[32px] font-semibold text-gray-scales-black text-center mb-12">
            Follow products and discounts on Instagram
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {products.slice(0, 6).map((product, index) => (
              <div key={index} className="aspect-square relative">
                <Image 
                  src={product.image}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className="object-cover cursor-pointer transition-transform duration-200 hover:scale-105 rounded-3xs"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}