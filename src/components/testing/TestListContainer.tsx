import { memo, useCallback } from 'react';
import { isEqual } from 'lodash';
import { TestList } from './TestList';
import { TestItem } from '@/types';
import { mockTestData } from '@data/mockTestData';
import { NavigationControls } from './components';
import { useTestItems } from './hooks';
import { useProject } from '@/context/useProject';

interface TestListContainerProps {
  selectedMicroservice: TestItem;
  functionResults: Record<string, string>;
  handleGenerateTest: (test: TestItem) => void;
  handleMicroserviceChange: (direction: 'up' | 'down') => void;
}

/**
 * Container for the test list with navigation controls
 */
export const TestListContainer = memo<TestListContainerProps>(
  ({ selectedMicroservice, functionResults, handleGenerateTest, handleMicroserviceChange }) => {
    // Get project context
    const { project } = useProject();

    // Use our custom hook for test items
    const { runTest } = useTestItems(mockTestData, project?.id || '', selectedMicroservice?.id);

    // Get the previous microservice name
    const getPreviousMicroserviceName = useCallback(() => {
      const currentIndex = mockTestData.findIndex((ms) => ms.id === selectedMicroservice.id);
      if (currentIndex === -1) return '';
      const prevIndex = (currentIndex - 1 + mockTestData.length) % mockTestData.length;
      return mockTestData[prevIndex].name;
    }, [selectedMicroservice.id]);

    // Get the next microservice name
    const getNextMicroserviceName = useCallback(() => {
      const currentIndex = mockTestData.findIndex((ms) => ms.id === selectedMicroservice.id);
      if (currentIndex === -1) return '';
      const nextIndex = (currentIndex + 1) % mockTestData.length;
      return mockTestData[nextIndex].name;
    }, [selectedMicroservice.id]);

    return (
      <div className="flex-1 relative">
        <div className="p-4 overflow-auto h-full">
          <TestList
            tests={[selectedMicroservice]}
            onRunTest={runTest}
            onGenerateTest={handleGenerateTest}
            functionResults={functionResults}
            microserviceId={selectedMicroservice.id}
          />
        </div>

        <NavigationControls
          onNavigate={handleMicroserviceChange}
          previousItemName={getPreviousMicroserviceName()}
          nextItemName={getNextMicroserviceName()}
          showControls={mockTestData.length > 1}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.selectedMicroservice, nextProps.selectedMicroservice) &&
      isEqual(prevProps.functionResults, nextProps.functionResults)
    );
  },
);
