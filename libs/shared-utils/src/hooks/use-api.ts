import { useState, useEffect } from 'react';
import { apiClient } from '../api/api-client';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(endpoint: string, immediate = true) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiClient.get<T>(endpoint);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [endpoint, immediate]);

  return {
    ...state,
    refetch: execute,
  };
}