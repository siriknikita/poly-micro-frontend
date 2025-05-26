import { useEffect, useState, useRef } from 'react';
import { TestList } from './TestList';
import { TestChat } from './TestChat';
import { TestItem } from '../../types/testing';
import { MessageSquare, Play, FileText } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { useResizablePanel, useTestItems, useMicroserviceNavigation } from './hooks';
import { IconButton, NavigationControls, SearchInput, ResizeHandle } from './components';
import { DEFAULT_PROMPTS } from './constants';
import { TestsTab } from '../tests/TestsTab';

import { useToast } from '@/context/useToast';
import { useProject } from '@/context/useProject';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';

// Using key instead of memo to force remount when project changes
export const AutomatedTesting = () => {
  // State for selected test and chat visibility
  const [, setSelectedTest] = useState<TestItem | null>(null);
  const [showChat, setShowChat] = useState(true);
  const [activeView, setActiveView] = useState<'testing' | 'test-discovery'>('testing');

  // Use our custom hooks
  const { width: chatWidth, isDragging, setIsDragging, startResize } = useResizablePanel();
  const { project } = useProject();
  const { showInfo, showSuccess, showError } = useToast();

  // Get project microservices
  const [microservices, setMicroservices] = useState<TestItem[]>(project?.microservices || []);
  
  useEffect(() => {
    if (project?.microservices) {
      setMicroservices(project.microservices);
    }
  }, [project]);

  const {
    selectedMicroservice,
    setSelectedMicroservice,
    searchQuery,
    setSearchQuery,
    filteredMicroservices,
    navigateMicroservice,
    getPreviousMicroserviceName,
    getNextMicroserviceName,
  } = useMicroserviceNavigation({
    microservices: microservices,
    initialMicroservice: microservices.length > 0 ? microservices[0] : null,
  });

  console.group('Microservices');
  console.log('microservices', microservices);
  console.log('filteredMicroservices', filteredMicroservices);
  console.log('selectedMicroservice', selectedMicroservice);
  console.log('searchQuery', searchQuery);
  console.groupEnd();

  // Reference to the chat component for setting input
  const chatRef = useRef<{ setInput: (text: string) => void }>(null);

  // Track if all tests have been run
  const [hasRunAllTests, setHasRunAllTests] = useState(false);
  const [isRunningAllTests, setIsRunningAllTests] = useState(false);

  // Show a success message when tests complete
  useEffect(() => {
    if (hasRunAllTests && !isRunningAllTests) {
      showSuccess('All tests completed!');
      setHasRunAllTests(false);
    }
  }, [hasRunAllTests, isRunningAllTests, showSuccess]);

  // Handle generating a test
  const handleGenerateTest = (test: TestItem) => {
    setSelectedTest(test);
    const defaultPrompt = DEFAULT_PROMPTS.GENERATE_TEST(test.name);
    if (chatRef.current) {
      chatRef.current.setInput(defaultPrompt);
    }
    showInfo(`Preparing to generate test for ${test.name}`);
  };

  // Handle running a test
  const handleRunTest = async (test: TestItem) => {
    try {
      await runTest(test.id);
      showSuccess(`Started test for ${test.name}`);
    } catch (error) {
      showError(
        `Error running test: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  // Handle running all tests
  const handleRunAllTests = async () => {
    try {
      setHasRunAllTests(true);
      setIsRunningAllTests(true);
      await runAllTests();
      showSuccess(`Started tests for ${selectedMicroservice?.name || 'selected microservice'}`);
      setIsRunningAllTests(false);
    } catch (error) {
      showError(
        `Error running tests: ${error instanceof Error ? error.message : String(error)}`
      );
      setHasRunAllTests(false);
      setIsRunningAllTests(false);
    }
  };

  // If there's no selected microservice and we have filtered results, select the first one
  useEffect(() => {
    if (!selectedMicroservice && filteredMicroservices.length > 0) {
      setSelectedMicroservice(filteredMicroservices[0]);
    }
  }, [selectedMicroservice, filteredMicroservices, setSelectedMicroservice]);

  // Get test items for the current microservice
  const currentTests = selectedMicroservice?.children || [];
  const {
    functionResults,
    runTest,
    runAllTests,
    testRunIds,
  } = useTestItems(currentTests, project?.id || '', selectedMicroservice?.id || '');

  if (!selectedMicroservice) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900"
      onMouseMove={(e) => isDragging && e.preventDefault()}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {activeView === 'testing' ? `Testing: ${selectedMicroservice.name}` : 'Test Discovery'}
            </h2>
            {activeView === 'testing' && (
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search microservices..."
              />
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* View Toggle Buttons */}
            <div className="flex items-center mr-4 bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <IconButton
                onClick={() => setActiveView('testing')}
                icon={<Play className="h-4 w-4" />}
                variant={activeView === 'testing' ? 'active' : 'outline'}
                title="Test Runner"
                aria-label="Test Runner"
              />
              <IconButton
                onClick={() => setActiveView('test-discovery')}
                icon={<FileText className="h-4 w-4" />}
                variant={activeView === 'test-discovery' ? 'active' : 'outline'}
                title="Test Discovery"
                aria-label="Test Discovery"
              />
            </div>
            
            {activeView === 'testing' && (
              <>
                <GuidanceTooltip
                  step={OnboardingStep.RUN_ALL_TESTS}
                  title="Run All Tests"
                  description="Click this button to run all tests for the selected microservice. This is useful when you want to verify the overall health of your service."
                  position="bottom"
                  className="inline-block"
                >
                  <IconButton
                    onClick={handleRunAllTests}
                    icon={<Play className="h-4 w-4" />}
                    label="Run All Tests"
                    variant="primary"
                    size="md"
                  />
                </GuidanceTooltip>
                <GuidanceTooltip
                  step={OnboardingStep.TEST_ASSISTANT}
                  title="Test Assistant"
                  description="The Test Assistant helps you generate and modify tests using AI. You can ask it to create new tests or explain existing ones."
                  position="left"
                  className="inline-block"
                >
                  <IconButton
                    onClick={() => setShowChat(!showChat)}
                    icon={<MessageSquare className="h-5 w-5" />}
                    variant={showChat ? 'outline' : 'active'}
                    title={showChat ? 'Hide Test Assistant' : 'Show Test Assistant'}
                    aria-label={showChat ? 'Hide Test Assistant' : 'Show Test Assistant'}
                  />
                </GuidanceTooltip>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeView === 'testing' ? (
          <div className="flex-1 relative">
            <GuidanceTooltip
              step={OnboardingStep.AUTOMATED_TESTING}
              title="Automated Testing"
              description="Run and generate tests for your microservices. You can execute individual tests or run all tests for a service. Use the Test Assistant chat on the right to get help with testing."
              position="bottom"
              className="h-full"
            >
              <div className="p-4 h-full">
                {selectedMicroservice.children && selectedMicroservice.children.length > 0 ? (
                  <TestList
                    tests={selectedMicroservice.children}
                    onRunTest={handleRunTest}
                    onGenerateTest={handleGenerateTest}
                    functionResults={functionResults}
                    microserviceId={selectedMicroservice.id}
                    testRunIds={testRunIds}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8 max-w-md">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No tests found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        This microservice doesn't have any tests yet. Use the Test Assistant to
                        generate some tests for this service.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </GuidanceTooltip>
          </div>
        ) : (
          <div className="flex-1 relative">
            <TestsTab />
          </div>
        )}
        
        {activeView === 'testing' && (
          <>
            {showChat && (
              <>
                <ResizeHandle onResizeStart={startResize} />
                <div style={{ width: `${chatWidth}px` }} className="border-l border-gray-200 dark:border-gray-700">
                  <TestChat
                    ref={chatRef}
                    onGenerateTest={handleGenerateTest}
                  />
                </div>
              </>
            )}
            
            <NavigationControls
              onNavigate={navigateMicroservice}
              previousItemName={getPreviousMicroserviceName()}
              nextItemName={getNextMicroserviceName()}
              showControls={filteredMicroservices.length > 1}
            />
          </>
        )}
      </div>
    </div>
  );
};
