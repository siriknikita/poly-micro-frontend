import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';

// Mock ToastContext
const mockShowInfo = vi.fn();
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

// Mock the useToast hook
vi.mock('../../context/useToast', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    showInfo: mockShowInfo,
  }),
}));

// Mock the ToastContext
vi.mock('../../context/ToastContext', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the hooks module first, before any imports that might use it
vi.mock('../../components/testing/hooks', () => {
  return {
    useTestItems: vi.fn().mockImplementation((_tests, _projectId, microserviceId) => ({
      expandedItems: { test1: true, test2: false },
      functionResults: {},
      toggleExpand: vi.fn(),
      expandAll: vi.fn(),
      collapseAll: vi.fn(),
      showResults: true,
      toggleResultsVisibility: vi.fn(),
      currentMicroserviceId: microserviceId || '',
      isLoading: false,
      error: null,
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: vi.fn(),
      viewTestOutput: vi.fn(),
      runningTests: {},
      allTestsComplete: false,
      runTest: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    })),
  };
});

// Mock the useProject hook
vi.mock('../../context/useProject', () => ({
  useProject: () => ({
    project: { id: 'project1', name: 'Test Project' },
    setProject: vi.fn(),
  }),
  ProjectProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the ProjectContextProvider
vi.mock('../../context/ProjectContext', () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the TestItemComponent
vi.mock('../../components/testing/components', () => ({
  TestItemComponent: ({
    item,
    isExpanded,
    onRunTest,
    onGenerateTest,
    onShowOutput,
  }: {
    item: { id: string; name: string };
    isExpanded: boolean;
    onRunTest: (item: { id: string; name: string }) => void;
    onGenerateTest: (item: { id: string; name: string }) => void;
    onShowOutput: (id: string) => void;
  }) => {
    return (
      <div data-testid={`test-item-${item.id}`}>
        <span>{item.name}</span>
        {isExpanded && (
          <div>
            <div>description</div>
            <button data-testid={`run-test-${item.id}`} onClick={() => onRunTest(item)}>
              Run Test
            </button>
            <button data-testid={`generate-test-${item.id}`} onClick={() => onGenerateTest(item)}>
              Generate Test
            </button>
            <button data-testid={`view-output-${item.id}`} onClick={() => onShowOutput(item.id)}>
              View Output
            </button>
          </div>
        )}
      </div>
    );
  },
  IconButton: ({
    onClick,
    title,
    icon,
    'aria-label': ariaLabel,
  }: {
    'onClick'?: () => void;
    'title'?: string;
    'icon': React.ReactNode;
    'aria-label'?: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      data-testid={title?.toLowerCase().replace(/\s+/g, '-')}
    >
      {icon}
    </button>
  ),
  TestOutputModal: ({
    isOpen,
    testId,
    output,
    onClose,
  }: {
    isOpen: boolean;
    testId: string;
    output: string;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="test-output-modal">
        <div data-testid="modal-test-id">{testId}</div>
        <div data-testid="modal-output">{output}</div>
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

// Import after all mocks are defined
import { TestList } from '../../components/testing/TestList';
import { mockTestItems } from '../mocks/mockData';
import { useTestItems } from '../../components/testing/hooks';

describe('TestList Integration', () => {
  const mockOnRunTest = vi.fn();
  const mockOnGenerateTest = vi.fn();
  const mockToggleExpand = vi.fn();
  const mockExpandAll = vi.fn();
  const mockCollapseAll = vi.fn();
  const mockToggleResultsVisibility = vi.fn();
  const mockViewTestOutput = vi.fn();
  const mockCloseOutputModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset the mock implementation for each test
    vi.mocked(useTestItems).mockImplementation((_tests, _projectId, microserviceId) => ({
      expandedItems: { func1: true, func2: false, func3: false },
      functionResults: {},
      toggleExpand: mockToggleExpand,
      expandAll: mockExpandAll,
      collapseAll: mockCollapseAll,
      showResults: true,
      toggleResultsVisibility: mockToggleResultsVisibility,
      currentMicroserviceId: microserviceId || '',
      isLoading: false,
      error: null,
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: mockCloseOutputModal,
      viewTestOutput: mockViewTestOutput,
      runningTests: {},
      allTestsComplete: false,
      runTest: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    }));
  });

  it('renders the list of test items', () => {
    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    // Should render all test items
    mockTestItems.forEach((testItem) => {
      expect(screen.getByText(testItem.name)).toBeInTheDocument();
    });
  });

  it('displays expanded test item with details', () => {
    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    // Find the expanded function item (func1)
    const expandedFuncItem = screen.getByTestId('test-item-func1');
    expect(expandedFuncItem).toBeInTheDocument();

    // Check that it contains the description (which is only visible when expanded)
    expect(expandedFuncItem).toHaveTextContent('description');

    // Since func1 is expanded, we should see its children rendered by the TestList component
    // The children are rendered in the border-l-2 div after the func1 item
    const renderedItems = screen.getAllByText(/should authenticate|should reject/i);
    expect(renderedItems.length).toBeGreaterThan(0);
  });

  it('does not display details for collapsed test items', () => {
    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    // Find the func2 item (which should not be expanded)
    const func2Item = screen.getByTestId('test-item-func2');
    expect(func2Item).toBeInTheDocument();

    // Since func2 is not expanded, it should not have the description text
    expect(func2Item).not.toHaveTextContent('description');

    // And its children should not be visible
    // We can check that the test case names from func2's children are not in the document
    expect(screen.queryByText(/should validate a valid token/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/should reject an expired token/i)).not.toBeInTheDocument();
  });

  it('shows empty state when there are no test items', () => {
    // Override the mock to ensure tests array is empty
    render(
      <TestList
        microserviceId="ms1"
        tests={[]}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    expect(screen.getByText(/no tests available/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    // Override the mock to show loading state
    vi.mocked(useTestItems).mockReturnValueOnce({
      expandedItems: {},
      functionResults: {},
      toggleExpand: mockToggleExpand,
      expandAll: mockExpandAll,
      collapseAll: mockCollapseAll,
      showResults: true,
      toggleResultsVisibility: mockToggleResultsVisibility,
      currentMicroserviceId: 'ms1',
      isLoading: true,
      error: null,
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: mockCloseOutputModal,
      viewTestOutput: mockViewTestOutput,
      runningTests: {},
      allTestsComplete: false,
      runTest: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });

    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('shows error state', () => {
    // Override the mock to show error state
    vi.mocked(useTestItems).mockReturnValueOnce({
      expandedItems: {},
      functionResults: {},
      toggleExpand: mockToggleExpand,
      expandAll: mockExpandAll,
      collapseAll: mockCollapseAll,
      showResults: true,
      toggleResultsVisibility: mockToggleResultsVisibility,
      currentMicroserviceId: 'ms1',
      isLoading: false,
      error: 'Failed to load tests',
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: mockCloseOutputModal,
      viewTestOutput: mockViewTestOutput,
      runningTests: {},
      allTestsComplete: false,
      runTest: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });

    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    expect(screen.getByText('Failed to load tests')).toBeInTheDocument();
  });

  it('toggles all items when expand/collapse button is clicked', () => {
    // Clear previous mock calls
    mockShowInfo.mockClear();
    mockExpandAll.mockClear();

    // Mock the useTestItems hook with a custom implementation for this test
    vi.mocked(useTestItems).mockReturnValueOnce({
      expandedItems: {},
      functionResults: {},
      toggleExpand: mockToggleExpand,
      expandAll: mockExpandAll,
      collapseAll: mockCollapseAll,
      showResults: true,
      toggleResultsVisibility: mockToggleResultsVisibility,
      currentMicroserviceId: 'ms1',
      isLoading: false,
      error: null,
      isOutputModalOpen: false,
      selectedTestId: null,
      closeOutputModal: mockCloseOutputModal,
      viewTestOutput: mockViewTestOutput,
      runningTests: {},
      allTestsComplete: false,
      runTest: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });

    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    // Get the expand all button and click it
    const expandAllButton = screen.getByTestId('expand-all-functions');
    fireEvent.click(expandAllButton);

    // Check that expandAll was called
    expect(mockExpandAll).toHaveBeenCalled();
    expect(mockShowInfo).toHaveBeenCalledWith('All tests expanded');
  });

  it('runs a test when run button is clicked', () => {
    // Clear previous mock calls
    mockShowInfo.mockClear();

    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    // Find and click the run test button for func1
    const runTestButton = screen.getByTestId('run-test-func1');
    fireEvent.click(runTestButton);

    // Check that onRunTest was called with the right test
    expect(mockOnRunTest).toHaveBeenCalledWith(mockTestItems[0]);
    expect(mockShowInfo).toHaveBeenCalledWith(`Running test: ${mockTestItems[0].name}...`);
  });

  it('generates a test when generate button is clicked', () => {
    // Clear previous mock calls
    mockShowInfo.mockClear();

    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{}}
      />,
    );

    // Find and click the generate test button for func1
    const generateTestButton = screen.getByTestId('generate-test-func1');
    fireEvent.click(generateTestButton);

    // Check that onGenerateTest was called with the right test
    expect(mockOnGenerateTest).toHaveBeenCalledWith(mockTestItems[0]);
    expect(mockShowInfo).toHaveBeenCalledWith(`Generating test for ${mockTestItems[0].name}...`);
  });

  it('displays test output modal when view output button is clicked', () => {
    // Mock the output modal functionality
    vi.mocked(useTestItems).mockReturnValueOnce({
      expandedItems: { func1: true },
      functionResults: { func1: 'Test output for func1' },
      toggleExpand: mockToggleExpand,
      expandAll: mockExpandAll,
      collapseAll: mockCollapseAll,
      showResults: true,
      toggleResultsVisibility: mockToggleResultsVisibility,
      currentMicroserviceId: 'ms1',
      isLoading: false,
      error: null,
      isOutputModalOpen: true,
      selectedTestId: 'func1',
      closeOutputModal: mockCloseOutputModal,
      viewTestOutput: mockViewTestOutput,
      runningTests: {},
      allTestsComplete: false,
      runTest: vi.fn(),
      setRunningTests: vi.fn(),
      setCurrentMicroservice: vi.fn(),
      runAllTests: vi.fn(),
    });

    render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={mockOnRunTest}
        onGenerateTest={mockOnGenerateTest}
        functionResults={{ func1: 'Test output for func1' }}
      />,
    );

    // Check that the modal is displayed with the correct content
    expect(screen.getByTestId('test-output-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-test-id')).toHaveTextContent('func1');
    expect(screen.getByTestId('modal-output')).toHaveTextContent('Test output for func1');
  });
});
