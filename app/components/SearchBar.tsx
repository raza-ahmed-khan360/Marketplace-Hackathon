'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { searchProducts } from '../../lib/api';
import { Product } from '../../types';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [data, searchError] = await searchProducts(query);
      if (searchError) throw searchError;
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
        setResults([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductClick = (productId: string) => {
    router.push(`/single-product?id=${productId}`);
    setIsDropdownOpen(false);
    setSearchQuery('');
    setResults([]);
    if (onClose) onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setResults([]);
    setIsDropdownOpen(false);
    if (onClose) onClose();
  };

  return (
    <div ref={searchRef} className="relative font-inter">
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          placeholder="Search products..."
          className="w-full h-[46px] px-4 rounded-3xs border border-gray-scales-light-gray bg-gray-scales-white focus:outline-none focus:border-accents-dark-accents text-gray-scales-dark-gray"
          aria-label="Search products"
        />
        {onClose ? (
          <button
            onClick={handleClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-label="Close search"
          >
            <XMarkIcon className="w-5 h-5 text-gray-scales-dark-gray" />
          </button>
        ) : (
          <Image
            src="/Header/search.svg"
            alt="Search"
            width={20}
            height={20}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-scales-dark-gray"
          />
        )}
      </div>

      {isDropdownOpen && (searchQuery || loading || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-y-auto bg-gray-scales-white rounded-3xs shadow-lg border border-gray-scales-light-gray z-50">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <p className="text-lg text-gray-scales-dark-gray">Searching...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-10">
              <p className="text-lg text-status-error">{error}</p>
            </div>
          )}

          {!loading && !error && results.length === 0 && searchQuery && (
            <div className="flex items-center justify-center py-10">
              <p className="text-lg text-gray-scales-dark-gray">No products found</p>
            </div>
          )}

          {!loading && !error && results.map((product) => (
            <button
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-scales-off-white transition-colors text-left"
            >
              <Image
                src={product.image}
                alt={product.title}
                width={40}
                height={40}
                className="rounded-3xs object-cover"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-scales-black line-clamp-1">
                  {product.title}
                </h4>
                <p className="text-sm text-gray-scales-dark-gray">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}