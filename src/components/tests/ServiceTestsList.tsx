import React, { useState } from 'react';
import { useServiceTests, TestItem } from '../../hooks/useServiceTests';
import { useRunServiceTests } from '../../hooks/useRunServiceTests';
import {
  Folder,
  Code,
  FunctionSquare,
  CheckCircle,
  AlertCircle,
  Loader,
  Play,
} from 'lucide-react';
import { BoxedWrapper } from '../shared';

interface ServiceTestsListProps {
  serviceId: string;
  serviceName: string;
}

type ModuleData = {
  modules: Record<string, TestItem[]>;
  functions: TestItem[];
};

type GroupedTests = Record<string, ModuleData>;

// Individual test item component
const TestItemComponent: React.FC<{ test: TestItem }> = ({ test }) => {
  return (
    <li className="flex items-start py-1">
      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
      <div>
        <div className="text-gray-800 dark:text-gray-200">{test.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {test.type === 'method' ? 'Test method' : test.type}
        </div>
      </div>
    </li>
  );
};

// Test class component with its test items
const TestClass: React.FC<{ className: string; tests: TestItem[] }> = ({
  className,
  tests,
}) => {
  return (
    <div className="ml-6 mb-4">
      <div className="flex items-center mb-2">
        <Code className="h-4 w-4 text-purple-500 mr-2" />
        <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">
          {className}
        </h4>
      </div>

      <ul className="ml-8 space-y-1">
        {tests.map((test) => (
          <TestItemComponent
            key={test.id}
            test={test}
          />
        ))}
      </ul>
    </div>
  );
};

// Component for module functions
const ModuleFunctions: React.FC<{ functions: TestItem[] }> = ({
  functions,
}) => {
  if (functions.length === 0) return null;

  return (
    <div className="ml-6">
      <ul className="space-y-1">
        {functions.map((func) => (
          <li
            key={func.id}
            className="flex items-start py-1"
          >
            <FunctionSquare className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
            <div>
              <div className="text-gray-800 dark:text-gray-200">
                {func.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Test function
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Module group component
const ModuleGroup: React.FC<{ moduleData: ModuleData }> = ({ moduleData }) => {
  return (
    <div className="mb-6">
      {Object.entries(moduleData.modules).map(([className, tests]) => (
        <TestClass
          key={className}
          className={className}
          tests={tests}
        />
      ))}
      <ModuleFunctions functions={moduleData.functions} />
    </div>
  );
};

// Module name component
const ModuleName: React.FC<{ moduleName: string }> = ({ moduleName }) => {
  return (
    <div className="flex items-center mb-2">
      <Folder className="h-5 w-5 text-blue-500 mr-2" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        {moduleName}
      </h3>
    </div>
  );
};

// Loading state component
const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <Loader className="h-8 w-8 animate-spin text-gray-500" />
  </div>
);

// Error state component
const ErrorState: React.FC<{ error?: string }> = ({ error }) => (
  <div className="p-6 text-center">
    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
    <h3 className="text-lg font-medium text-red-500 mb-1">
      Error loading tests
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      {error || 'Could not load tests for this service.'}
    </p>
  </div>
);

// Empty state component
const EmptyState: React.FC = () => (
  <div className="py-8 text-center">
    <p className="text-gray-500 dark:text-gray-400">
      No tests found for this service.
    </p>
  </div>
);

// Run tests button component
const RunTestsButton: React.FC<{ serviceId: string; serviceName: string }> = ({
  serviceId,
  serviceName,
}) => {
  const {
    runTests,
    isRunning,
    isError,
    error,
    testResult,
    reset,
  } = useRunServiceTests();
  const [showResult, setShowResult] = useState(false);

  const handleRunTests = () => {
    setShowResult(true);
    runTests(serviceId);
  };

  const handleCloseResult = () => {
    setShowResult(false);
    reset();
  };

  return (
    <>
      <button
        onClick={handleRunTests}
        disabled={isRunning}
        className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition
          disabled:bg-blue-400 disabled:cursor-not-allowed"
      >
        {isRunning ? (
          <>
            <Loader className="h-4 w-4 mr-1.5 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1.5" />
            Run Tests
          </>
        )}
      </button>

      {showResult && (testResult || isError) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Test Results - {serviceName}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 dark:bg-gray-900 dark:text-gray-100">
              {isError ? (
                <div className="text-red-500">
                  <AlertCircle className="h-5 w-5 inline-block mr-2" />
                  {error?.toString() || 'An error occurred while running tests'}
                </div>
              ) : testResult?.error ? (
                <div className="text-red-500">
                  <AlertCircle className="h-5 w-5 inline-block mr-2" />
                  {testResult.error}
                </div>
              ) : testResult ? (
                <>
                  <div
                    className={`mb-4 p-2 rounded ${testResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                  >
                    {testResult.success ? (
                      <CheckCircle className="h-5 w-5 inline-block mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 inline-block mr-2" />
                    )}
                    {testResult.success
                      ? 'Tests completed successfully!'
                      : 'Tests failed.'}
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-1">Details:</h4>
                    <div className="text-xs">
                      <p>Service: {testResult.service_name}</p>
                      <p>Status: {testResult.status}</p>
                      <p>Test Run ID: {testResult.test_run_id}</p>
                      <p>Duration: {testResult.duration_seconds?.toFixed(2)}s</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-1">Test Results:</h4>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-center">
                        <div className="text-sm font-medium">{testResult.total_tests}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-center text-green-800 dark:text-green-200">
                        <div className="text-sm font-medium">{testResult.passed_tests}</div>
                        <div className="text-xs">Passed</div>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900 p-2 rounded text-center text-red-800 dark:text-red-200">
                        <div className="text-sm font-medium">{testResult.failed_tests}</div>
                        <div className="text-xs">Failed</div>
                      </div>
                      {/* Skipped tests box only shown if we have that data */}
                    </div>
                  </div>

                  {testResult.stdout && (
                    <div className="mb-4">
                      <details>
                        <summary className="text-sm font-semibold mb-1 cursor-pointer">
                          View Raw Test Output
                        </summary>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto max-h-[200px] overflow-y-auto mt-2">
                          {testResult.stdout}
                        </pre>
                      </details>
                    </div>
                  )}

                  {testResult.stderr && testResult.stderr.trim() && (
                    <div className="mb-4">
                      <details>
                        <summary className="text-sm font-semibold mb-1 cursor-pointer text-red-600 dark:text-red-400">
                          View Error Output
                        </summary>
                        <pre className="bg-red-50 dark:bg-red-900/20 p-2 rounded text-xs overflow-x-auto max-h-[200px] overflow-y-auto mt-2 text-red-800 dark:text-red-300">
                          {testResult.stderr}
                        </pre>
                      </details>
                    </div>
                  )}

                  {testResult.json_report && testResult.json_report.tests && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Test Details:</h4>
                      <div className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
                        {testResult.json_report.tests.map((test: any, index: number) => (
                          <div
                            key={test.nodeid}
                            className={`p-2 border-b border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'dark:bg-gray-900'}`}
                          >
                            <div className="flex items-start">
                              <span className={`mr-2 flex-shrink-0`}>
                                {test.outcome === 'passed' ? 
                                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                                  test.outcome === 'failed' ? 
                                  <AlertCircle className="h-4 w-4 text-red-500" /> : 
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />}
                              </span>
                              <div>
                                <div className="font-medium text-sm">{test.nodeid.split('::').pop()}</div>
                                <div className="text-xs text-gray-500">{test.nodeid}</div>
                                <div className="text-xs">{test.outcome} ({((test.call?.duration || 0) + (test.setup?.duration || 0) + (test.teardown?.duration || 0)).toFixed(3)}s)</div>
                              </div>
                            </div>
                            {test.outcome === 'failed' && test.call && test.call.longrepr && (
                              <details className="mt-2 ml-6">
                                <summary className="text-xs text-red-500 dark:text-red-400 cursor-pointer font-medium">Show error details</summary>
                                <pre className="mt-1 bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                                  {test.call.longrepr}
                                </pre>
                              </details>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={handleCloseResult}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-800 dark:text-gray-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Main component
export const ServiceTestsList: React.FC<ServiceTestsListProps> = ({
  serviceId,
  serviceName,
}) => {
  const { testsData, isLoading, isError, error } = useServiceTests(serviceId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !testsData) {
    return <ErrorState error={error || undefined} />;
  }

  // Group tests by module and class
  const groupedTests: GroupedTests = testsData.tests.reduce((acc, test) => {
    if (!acc[test.module_name]) {
      acc[test.module_name] = {
        modules: {},
        functions: [],
      };
    }

    if (test.class_name) {
      if (!acc[test.module_name].modules[test.class_name]) {
        acc[test.module_name].modules[test.class_name] = [];
      }
      acc[test.module_name].modules[test.class_name].push(test);
    } else {
      acc[test.module_name].functions.push(test);
    }

    return acc;
  }, {} as GroupedTests);

  return (
    <BoxedWrapper className="border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Tests for {serviceName}
        </h2>
        <RunTestsButton serviceId={serviceId} serviceName={serviceName} />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Discovered {testsData.tests.length} tests on{' '}
        {new Date(testsData.discovery_time).toLocaleString()}
      </p>

      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

      {testsData.tests.length === 0 ? (
        <EmptyState />
      ) : (
        Object.entries(groupedTests).map(([moduleName, moduleData]) => (
          <div
            key={moduleName}
            className="mb-6"
          >
            <ModuleName moduleName={moduleName} />
            <ModuleGroup moduleData={moduleData} />
          </div>
        ))
      )}
    </BoxedWrapper>
  );
};
