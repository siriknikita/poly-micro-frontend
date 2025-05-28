import React from 'react';
import { useServiceTests, TestItem } from '../../hooks/useServiceTests';
import {
  Folder,
  Code,
  FunctionSquare,
  CheckCircle,
  AlertCircle,
  Loader,
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
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Tests for {serviceName}
      </h2>

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
