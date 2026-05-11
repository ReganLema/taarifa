
// src/hooks/useSalary.ts

import { useState, useCallback } from 'react';
import { apolloClient } from '../lib/apollo';
import { GET_SALARY_RANGE } from '../graphql/queries/salary';
import type { SalaryRangeInput, SalaryRangeResult } from '../types/salary';

interface SalaryRangeResponse {
  salaryRange: {
    success: boolean;
    message?: string;
    data?: SalaryRangeResult[];
  };
}

export const useSalaryLookup = () => {
  const [data, setData] = useState<SalaryRangeResponse['salaryRange'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (input: SalaryRangeInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apolloClient.query<SalaryRangeResponse>({
        query: GET_SALARY_RANGE,
        variables: input,
        fetchPolicy: 'network-only',
      });
      
      // Check if data exists before accessing
      if (result?.data?.salaryRange) {
        setData(result.data.salaryRange);
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
    search,
    data,
    loading,
    error,
  };
};