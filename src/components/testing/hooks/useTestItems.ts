import { useState, useEffect, useRef, useCallback } from 'react';
import { TestItem } from '@/types';
import { testsApi } from '@/utils/api';

/**
 * Helper functions for localStorage operations
 */
const storage = {
  save: (key: string, microserviceId: string | null, data: unknown): void => {
    if (!microserviceId) return;

    try {
      const existingData = localStorage.getItem(key) || '{}';
      const parsedData = JSON.parse(existingData) as Record<string, unknown>;
      parsedData[microserviceId] = data;
      localStorage.setItem(key, JSON.stringify(parsedData));
    } catch (error) {
      console.error(`Failed to save data to localStorage (${key}):`, error);
    }
  },

  load: <T>(key: string, microserviceId: string | null, defaultValue: T): T => {
    if (!microserviceId) return defaultValue;

    try {
      const storedData = localStorage.getItem(key);
      if (!storedData) return defaultValue;

      const parsedData = JSON.parse(storedData) as Record<string, unknown>;
      return microserviceId in parsedData
        ? (parsedData[microserviceId] as T)
        : defaultValue;
    } catch (error) {
      console.error(`Failed to load data from localStorage (${key}):`, error);
      return defaultValue;
    }
  },
};

const STORAGE_KEYS = {
  expandedItems: (projectId: string) =>
    `poly-micro-manager-expanded-items:${projectId}`,
  functionResults: (projectId: string) =>
    `poly-micro-manager-function-results:${projectId}`,
  showResults: (projectId: string) =>
    `poly-micro-manager-show-results:${projectId}`,
};

/**
 * Hook for managing test items, including execution and analysis
 */
export const useTestItems = (
  tests: TestItem[] = [],
  projectId: string,
  microserviceId: string,
) => {
  // Create state for expanded items, function results, and results visibility
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [functionResults, setFunctionResults] = useState<
    Record<string, string>
  >({});
  const [showResults, setShowResults] = useState<boolean>(true);

  // State for the current microservice ID
  const [currentMicroserviceId] = useState<string>(microserviceId);

  // State for loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // State for the output modal
  const [isOutputModalOpen, setIsOutputModalOpen] = useState<boolean>(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [runningTests, setRunningTests] = useState<string[]>([]);
  const [allTestsComplete, setAllTestsComplete] = useState<boolean>(true);
  const [testRunIds, setTestRunIds] = useState<Record<string, string>>({});
  const [testAnalysis, setTestAnalysis] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Setup for API requests
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved state when component mounts
  useEffect(() => {
    if (!currentMicroserviceId) return;

    const loadedExpandedItems = storage.load<Record<string, boolean>>(
      STORAGE_KEYS.expandedItems(projectId),
      currentMicroserviceId,
      {},
    );

    const loadedFunctionResults = storage.load<Record<string, string>>(
      STORAGE_KEYS.functionResults(projectId),
      currentMicroserviceId,
      {},
    );

    const loadedShowResults = storage.load<boolean>(
      STORAGE_KEYS.showResults(projectId),
      currentMicroserviceId,
      true,
    );

    setExpandedItems(loadedExpandedItems);
    setFunctionResults(loadedFunctionResults);
    setShowResults(loadedShowResults);
  }, [currentMicroserviceId, projectId]);

  /**
   * Poll for test completion
   */
  const pollForTestCompletion = useCallback(
    (testId: string, testRunId: string) => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      let pollCount = 0;
      const maxPolls = 30;

      pollIntervalRef.current = setInterval(async () => {
        try {
          if (pollCount >= maxPolls) {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
            setRunningTests((prev) => prev.filter((id) => id !== testId));
            setAllTestsComplete(true);
            setIsLoading(false);
            return;
          }

          const response = await testsApi.getTestRun(testRunId);
          const testRun = response.data;

          if (testRun.status !== 'pending' && testRun.status !== 'running') {
            // Test has completed, update the results
            const resultText = `Test ${testRun.name} ${testRun.status} (${testRun.passed || 0}/${testRun.total || 0} passed)`;
            setFunctionResults((prev) => {
              const updated = { ...prev };
              updated[testId] = resultText;
              storage.save(
                STORAGE_KEYS.functionResults(projectId),
                currentMicroserviceId,
                updated,
              );
              return updated;
            });

            // Clean up
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
            setRunningTests((prev) => prev.filter((id) => id !== testId));
            setAllTestsComplete(true);
            setIsLoading(false);
          }

          pollCount++;
        } catch (error) {
          console.error('Error polling test status:', error);
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
          }
          setRunningTests((prev) => prev.filter((id) => id !== testId));
          setAllTestsComplete(true);
          setIsLoading(false);
        }
      }, 2000); // Poll every 2 seconds
    },
    [projectId, currentMicroserviceId],
  );

  /**
   * Execute a single test by ID
   */
  const executeTest = useCallback(
    async (testId: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        setRunningTests((prev) => [...prev, testId]);
        setAllTestsComplete(false);

        const test = tests.find((t) => t.id === testId);

        if (!test) {
          throw new Error(`Test with ID ${testId} not found`);
        }

        const response = await testsApi.runTest({
          project_id: projectId,
          service_id: currentMicroserviceId,
          test_path: `tests/${testId}.py`, // Required by API
          test_id: testId,
        });

        setTestRunIds((prev) => ({
          ...prev,
          [testId]: response.data.id,
        }));

        pollForTestCompletion(testId, response.data.id);
      } catch (error) {
        console.error(`Error executing test ${testId}:`, error);
        setError(error instanceof Error ? error : new Error(String(error)));
        setRunningTests((prev) => prev.filter((id) => id !== testId));
        setAllTestsComplete(true);
      } finally {
        setIsLoading(false);
      }
    },
    [tests, projectId, currentMicroserviceId, pollForTestCompletion],
  );

  /**
   * Run a single test by ID
   */
  const runTest = useCallback(
    async (testId: string) => {
      await executeTest(testId);
    },
    [executeTest],
  );

  /**
   * Analyze test results using AI
   */
  const analyzeTestResult = useCallback(
    async (testId: string) => {
      try {
        setIsAnalyzing(true);

        const testRunId = testRunIds[testId];
        if (!testRunId) {
          throw new Error(`No test run ID found for test ${testId}`);
        }

        const response = await testsApi.analyzeTestRun({
          test_run_id: testRunId,
          include_logs: true,
        });

        const analysisResult = response.data;

        setTestAnalysis((prev) => ({
          ...prev,
          [testId]: analysisResult,
        }));

        return analysisResult;
      } catch (error) {
        console.error(`Error analyzing test ${testId}:`, error);
        throw error;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [testRunIds],
  );

  /**
   * Run all automatable tests for the current microservice
   */
  const runAllTests = useCallback(async () => {
    // Find all automatable function tests
    const getAllFunctions = (items: TestItem[]): TestItem[] => {
      let functions: TestItem[] = [];

      items.forEach((item) => {
        if (item.type === 'function') {
          functions.push(item);
        }

        if (item.children && item.children.length > 0) {
          functions = [...functions, ...getAllFunctions(item.children)];
        }
      });

      return functions;
    };

    const functions = getAllFunctions(tests);
    if (functions.length === 0) return;

    setAllTestsComplete(false);
    setIsLoading(true);

    try {
      // Mark all as running
      const testIds = functions.map((func) => func.id);
      setRunningTests(testIds);

      // Run all tests in parallel
      await Promise.all(
        functions.map(async (func) => {
          try {
            await executeTest(func.id);
          } catch (error) {
            console.error(`Error running test ${func.id}:`, error);
          }
        }),
      );
    } catch (error) {
      console.error('Error running all tests:', error);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  }, [tests, executeTest]);

  /**
   * Toggle the visibility of test results
   */
  const toggleResultsVisibility = useCallback(() => {
    if (!currentMicroserviceId) return;

    setShowResults((prev) => {
      const next = !prev;
      storage.save(
        STORAGE_KEYS.showResults(projectId),
        currentMicroserviceId,
        next,
      );
      return next;
    });
  }, [currentMicroserviceId, projectId]);

  /**
   * Open the modal to view test output
   */
  const viewTestOutput = useCallback((testId: string) => {
    setSelectedTestId(testId);
    setIsOutputModalOpen(true);
  }, []);

  /**
   * Close the output modal
   */
  const closeOutputModal = useCallback(() => {
    setIsOutputModalOpen(false);
    setSelectedTestId(null);
  }, []);

  /**
   * Toggle expansion state of a test item
   */
  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedItems((prev) => {
        const newState = {
          ...prev,
          [id]: !prev[id],
        };
        storage.save(
          STORAGE_KEYS.expandedItems(projectId),
          currentMicroserviceId,
          newState,
        );
        return newState;
      });
    },
    [currentMicroserviceId, projectId],
  );

  /**
   * Expand all test items
   */
  const expandAll = useCallback(() => {
    const expandedState: Record<string, boolean> = {};
    const processItems = (items: TestItem[]) => {
      items.forEach((item) => {
        expandedState[item.id] = true;
        if (item.children && item.children.length > 0) {
          processItems(item.children);
        }
      });
    };
    processItems(tests);
    setExpandedItems(expandedState);
    storage.save(
      STORAGE_KEYS.expandedItems(projectId),
      currentMicroserviceId,
      expandedState,
    );
  }, [tests, currentMicroserviceId, projectId]);

  /**
   * Collapse all test items
   */
  const collapseAll = useCallback(() => {
    setExpandedItems({});
    storage.save(
      STORAGE_KEYS.expandedItems(projectId),
      currentMicroserviceId,
      {},
    );
  }, [currentMicroserviceId, projectId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return {
    expandedItems,
    toggleExpand,
    expandAll,
    collapseAll,
    showResults,
    toggleResultsVisibility,
    functionResults,
    currentMicroserviceId,
    isLoading,
    error,
    runTest,
    runAllTests,
    isOutputModalOpen,
    selectedTestId,
    closeOutputModal,
    viewTestOutput,
    analyzeTestResult,
    testRunIds,
  };
};
