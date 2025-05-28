import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://backend:8000'; // Should match your backend URL

export interface TestItem {
  id: string;
  name: string;
  path: string;
  nodeid: string;
  type: string;
  class_name?: string | null;
  module_name: string;
}

export interface ServiceTestsResponse {
  service_id: string;
  service_name: string;
  project_id: string;
  discovery_time: string;
  tests: TestItem[];
  metadata?: Record<string, any>;
}

export function useServiceTests(serviceId: string | undefined) {
  const [error, setError] = useState<string | null>(null);

  const {
    data: testsData,
    isLoading,
    isError,
    refetch,
  } = useQuery<ServiceTestsResponse>({
    queryKey: ['servicetests', serviceId],
    queryFn: async () => {
      if (!serviceId) {
        throw new Error('Service ID is required');
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/services/tests/${serviceId}`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Failed to fetch tests: ${response.status}`,
          );
        }

        return await response.json();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err;
      }
    },
    enabled: !!serviceId, // Only run the query if serviceId is provided
  });

  return {
    testsData,
    isLoading,
    isError,
    error,
    refetch,
  };
}
