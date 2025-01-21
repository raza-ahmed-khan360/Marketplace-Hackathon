import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

type FetchFunction<T> = () => Promise<[T | null, Error | null]>;

export function useDataFetching<T>(
  fetchFn: FetchFunction<T>,
  dependencies: any[] = []
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const [data, error] = await fetchFn();
        if (error) throw error;
        setState({ data, isLoading: false, error: null });
      } catch (error) {
        console.error('Fetch error:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'An error occurred',
          isLoading: false,
        }));
      }
    };

    fetchData();
  }, dependencies);

  return state;
} 