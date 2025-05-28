import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

const API_BASE_URL = 'http://backend:8000'; // Should match your backend URL

interface RunTestsResult {
  success: boolean;
  service_id: string;
  service_name: string;
  test_run_id: string;
  status: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  duration_seconds: number;
  json_report?: any;
  stdout?: string;
  stderr?: string;
  report_path?: string;
  timestamp?: string;
  error?: string;
}

export function useRunServiceTests() {
  const [error, setError] = useState<string | null>(null);

  const runTestsMutation = useMutation<RunTestsResult, Error, string>({
    mutationFn: async (serviceId: string) => {
      if (!serviceId) {
        throw new Error('Service ID is required');
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/services/run-tests/${serviceId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Failed to run tests: ${response.status}`,
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
  });

  return {
    runTests: runTestsMutation.mutate,
    runTestsAsync: runTestsMutation.mutateAsync,
    isRunning: runTestsMutation.isPending,
    isError: runTestsMutation.isError,
    isSuccess: runTestsMutation.isSuccess,
    error,
    testResult: runTestsMutation.data,
    reset: runTestsMutation.reset,
  };
}
