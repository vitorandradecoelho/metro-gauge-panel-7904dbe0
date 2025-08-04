import { useState, useCallback } from 'react';

export const useModalState = () => {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await fn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    setIsLoading,
    withLoading,
  };
};