
// src/hooks/useAffordability.ts

import { useState, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { CALCULATE_AFFORDABILITY } from '../graphql/queries/affordability';
import type { AffordabilityInput, AffordabilityData } from '../types/affordability';

interface AffordabilityResponse {
  calculateAffordability: {
    success: boolean;
    message?: string;
  } & AffordabilityData;
}

export const useAffordability = () => {
  const [data, setData] = useState<AffordabilityResponse['calculateAffordability'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkAffordability = useCallback(async (input: AffordabilityInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apolloClient.query<AffordabilityResponse>({
        query: CALCULATE_AFFORDABILITY,
        variables: input,
        fetchPolicy: 'network-only',
      });
      
      // Check if data exists before accessing
      if (result?.data?.calculateAffordability) {
        setData(result.data.calculateAffordability);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    checkAffordability,
    data,
    loading,
    error,
  };
};