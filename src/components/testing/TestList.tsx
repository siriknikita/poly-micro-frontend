import { memo, useState, useEffect } from 'react';
import { TestItem as TestItemType } from '@/types';
import { useTestItems } from './hooks';
import { TestItemComponent, IconButton, TestOutputModal } from './components';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/context/useToast';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';

interface TestListProps {
  tests: TestItemType[];
  onRunTest: (test: TestItemType) => void;
  onGenerateTest: (test: TestItemType) => void;
  functionResults: Record<string, string>;
  microserviceId: string;
}

import { useProject } from '@/context/useProject';

export const TestList = memo<TestListProps>(
  ({ tests, onRunTest, onGenerateTest, functionResults, microserviceId }) => {
    // State to track if all items are expanded
    const [areAllExpanded, setAreAllExpanded] = useState(false);

    // Use our custom hook for managing test items
    const { project } = useProject();
    const { showSuccess, showError, showInfo } = useToast();
    const {
      expandedItems,
      toggleExpand,
      expandAll,
      collapseAll,
      showResults,
      toggleResultsVisibility,
      currentMicroserviceId,
      isLoading,
      error,
      isOutputModalOpen: hookIsOutputModalOpen,
      selectedTestId: hookSelectedTestId,
      closeOutputModal: hookCloseOutputModal,
      viewTestOutput,
    } = useTestItems(tests, project?.id || '', microserviceId);

    // Reset areAllExpanded state when microservice changes
    useEffect(() => {
      setAreAllExpanded(false);
    }, [currentMicroserviceId]);

    // Check if all items are expanded and update the button state accordingly
    useEffect(() => {
      if (!tests || tests.length === 0) return;

      // Helper function to check if all items and their children are expanded
      const areAllItemsExpanded = (items: TestItemType[]): boolean => {
        return items.every((item) => {
          const isCurrentItemExpanded = expandedItems[item.id] === true;

          // If the current item is not expanded, return false
          if (!isCurrentItemExpanded) return false;

          // If it has children, check if all children are expanded too
          if (item.children && item.children.length > 0) {
            return areAllItemsExpanded(item.children);
          }

          return true;
        });
      };

      const allExpanded = areAllItemsExpanded(tests);
      setAreAllExpanded(allExpanded);
    }, [expandedItems, tests]);

    // Check if there are any results to display
    const hasResults = Object.keys(functionResults).length > 0;

    /**
     * Recursively render test items and their children
     */
    const renderTestItem = (item: TestItemType, depth = 0) => {
      const isExpanded = expandedItems[item.id];
      const hasChildren = item.children && item.children.length > 0;
      const result = functionResults[item.id];

      return (
        <div key={item.id}>
          <TestItemComponent
            item={item}
            depth={depth}
            isExpanded={isExpanded}
            onToggleExpand={toggleExpand}
            onRunTest={handleRunTest}
            onGenerateTest={(test) => {
              onGenerateTest(test);
              showInfo(`Generating test for ${test.name}...`);
            }}
            result={result}
            showResults={showResults}
            onShowOutput={(testId) => {
              viewTestOutput(testId);
            }}
          />

          {hasChildren && isExpanded && (
            <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4">
              {item.children?.map((child) => renderTestItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    // Handle toggling all items
    const handleToggleAll = () => {
      if (areAllExpanded) {
        collapseAll();
        showInfo('All tests collapsed');
      } else {
        expandAll();
        showInfo('All tests expanded');
      }
      setAreAllExpanded(!areAllExpanded);
    };

    // Wrap onRunTest to add toast notifications
    const handleRunTest = (test: TestItemType) => {
      showInfo(`Running test: ${test.name}...`);
      onRunTest(test);

      // The actual toast notification will be shown when the test completes
      // This is handled in the timer callback in useTestItems
      setTimeout(() => {
        if (test.id in functionResults) {
          const resultText = functionResults[test.id];
          if (resultText.includes('Success')) {
            showSuccess(`Test ${test.name} completed successfully`);
          } else if (resultText.includes('Partial')) {
            showInfo(`Test ${test.name} completed with some failures`);
          } else {
            showError(`Test ${test.name} failed`);
          }
        }
      }, 1500); // Slightly longer than the mock test execution time
    };

    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-start mb-3 space-x-4">
          <GuidanceTooltip
            step={OnboardingStep.EXPAND_ALL_TESTS}
            title="Expand All Functions"
            description="Click this button to expand all test functions at once. This gives you a complete overview of all tests in the microservice and their nested structure."
            position="bottom"
            className="flex items-center"
          >
            <div className="flex items-center">
              <IconButton
                onClick={handleToggleAll}
                icon={
                  areAllExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )
                }
                title={areAllExpanded ? 'Collapse all' : 'Expand all functions'}
                aria-label={areAllExpanded ? 'Collapse all tests' : 'Expand all tests'}
                variant="outline"
              />
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {areAllExpanded ? 'Collapse all' : 'Expand all functions'}
              </span>
            </div>
          </GuidanceTooltip>

          {hasResults && (
            <div className="flex items-center">
              <IconButton
                onClick={toggleResultsVisibility}
                icon={showResults ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                title={showResults ? 'Hide test results' : 'Show test results'}
                aria-label={showResults ? 'Hide test results' : 'Show test results'}
                variant="outline"
                data-testId={showResults ? 'hide-results' : 'show-test-results'}
              />
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {showResults ? 'Hide results' : 'Show results'}
              </span>
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="py-8 flex justify-center items-center">
            <div
              data-testid="loading-indicator"
              className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
            ></div>
          </div>
        )}

        {/* Error state */}
        {error && <div className="py-8 text-center text-red-600 dark:text-red-400">{error}</div>}

        {/* Empty state */}
        {!isLoading && !error && (!tests || tests.length === 0) && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No tests available
          </div>
        )}

        {/* Test items */}
        {!isLoading && !error && tests && tests.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow divide-y divide-gray-200 dark:divide-gray-700">
            {tests.map((test) => renderTestItem(test))}
          </div>
        )}

        {/* Test output modal */}
        <TestOutputModal
          isOpen={hookIsOutputModalOpen || false}
          testId={hookSelectedTestId}
          output={hookSelectedTestId ? functionResults[hookSelectedTestId] : ''}
          onClose={hookCloseOutputModal || (() => {})}
        />
      </div>
    );
  },
);
