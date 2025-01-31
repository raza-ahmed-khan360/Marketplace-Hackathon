'use client';

import { useEffect, useState, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import CategoryProducts from '../../components/CardCategory';
import { Category } from '../../../types';
import { getCategories } from '../../../lib/api';

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div 
          key={index} 
          className="w-full h-[250px] animate-pulse bg-gray-scales-off-white rounded-3xs md:w-[312px]"
        />
      ))}
    </div>
  ); 
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="text-center py-10 font-inter">
      <h2 className="text-xl font-semibold text-status-error mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-scales-dark-gray mb-4">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-accents-accents text-gray-scales-white rounded-3xs hover:bg-accents-dark-accents transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, fetchError] = await getCategories();
      
      if (fetchError) throw new Error(fetchError instanceof Error ? fetchError.message : String(fetchError));
      if (!data || data.length === 0) {
        throw new Error('No categories available');
      }
      
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
      console.error('Error fetching categories:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return <CategorySkeleton />;
  }

  if (error) {
    throw new Error(error);
  }

  return <CategoryProducts categories={categories} />;
}

export default function TopCategories() {
  return (
    <section className="w-auto py-12 font-inter">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl lg:text-[32px] font-semibold capitalize mb-12 text-gray-scales-black">
          Top Categories
        </h2>
        
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.reload()}
        >
          <CategoriesContent />
        </ErrorBoundary>
      </div>
    </section>
  );
}
