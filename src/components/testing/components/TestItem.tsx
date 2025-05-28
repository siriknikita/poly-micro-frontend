import { memo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Zap,
  Play,
  Eye,
  BrainCircuit,
} from 'lucide-react';
import { TestItem as TestItemType } from '@/types';
import { CSS_CLASSES, TEST_ITEM_TYPES } from '../constants';
import { IconButton } from './IconButton';
import { TestAnalysis } from '../TestAnalysis';

interface TestItemProps {
  item: TestItemType;
  depth?: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onRunTest: (test: TestItemType) => void;
  onGenerateTest: (test: TestItemType) => void;
  result?: string;
  showResults?: boolean;
  onShowOutput?: (id: string) => void;
  testRunId?: string;
  onAnalyzeTest?: (test: TestItemType) => void;
}

/**
 * Component for rendering a test item
 */
export const TestItemComponent = memo<TestItemProps>(
  ({
    item,
    depth = 0,
    isExpanded,
    onToggleExpand,
    onRunTest,
    onGenerateTest,
    result,
    showResults = true,
    onShowOutput,
    testRunId,
    onAnalyzeTest,
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = `${depth * 1.25 + 0.5}rem`;
    const showResult =
      showResults && item.type === TEST_ITEM_TYPES.FUNCTION && result;

    // Get the background color based on depth
    const depthStyle =
      CSS_CLASSES.DEPTH_STYLES[
        depth as keyof typeof CSS_CLASSES.DEPTH_STYLES
      ] || '';

    return (
      <div
        className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
        data-testid={`test-item-${item.id}`}
      >
        <div className={`flex flex-col ${depthStyle}`}>
          <div
            className="flex items-center p-3"
            style={{ paddingLeft }}
          >
            {hasChildren ? (
              <button
                onClick={() => onToggleExpand(item.id)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                role={isExpanded ? 'collapseButton' : 'expandButton'}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <span className="flex-1 ml-2 text-gray-900 dark:text-gray-100">
              {item.name}
            </span>

            {item.type === TEST_ITEM_TYPES.FUNCTION && (
              <div className="flex space-x-2">
                <IconButton
                  onClick={() => onGenerateTest(item)}
                  icon={<Zap className="h-4 w-4" />}
                  title="Generate test"
                  aria-label={`Generate test for ${item.name}`}
                  className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                  role="generateButton"
                />
                <IconButton
                  onClick={() => onRunTest(item)}
                  icon={<Play className="h-4 w-4" />}
                  title="Run test"
                  aria-label={`Run test for ${item.name}`}
                  className="text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900"
                  role="runButton"
                />
                {result && onShowOutput && (
                  <IconButton
                    onClick={() => onShowOutput(item.id)}
                    icon={<Eye className="h-4 w-4" />}
                    title="View output"
                    aria-label={`View output for ${item.name}`}
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900"
                    role="outputButton"
                  />
                )}
                {result && testRunId && onAnalyzeTest && (
                  <IconButton
                    onClick={() => onAnalyzeTest(item)}
                    icon={<BrainCircuit className="h-4 w-4" />}
                    title="AI Analysis"
                    aria-label={`Analyze test results for ${item.name}`}
                    className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900"
                    role="analyzeButton"
                  />
                )}
              </div>
            )}
          </div>

          {showResult && (
            <div className="ml-6 mr-4 mb-3 p-3 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {result}
              {testRunId && item.type === TEST_ITEM_TYPES.FUNCTION && (
                <TestAnalysis
                  testId={item.id}
                  testRunId={testRunId}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
