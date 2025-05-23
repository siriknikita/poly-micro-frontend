import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { TestList } from '../../components/testing/TestList';
import { mockTestItems } from '../mocks/mockData';
import { TestItem } from '@/types';

// Create mock functions outside the mock
const expandAllMock = vi.fn();
const collapseAllMock = vi.fn();
const toggleExpandMock = vi.fn();
let expandedItemsState: Record<string, boolean> = {};

// Mock the hooks module
vi.mock('../../components/testing/hooks', () => {
  return {
    useTestItems: vi
      .fn()
      .mockImplementation((tests: TestItem[], projectId: string, microserviceId: string) => {
        // This implementation allows us to simulate the behavior of expandAll and collapseAll
        return {
          expandedItems: expandedItemsState,
          toggleExpand: (id: string) => {
            toggleExpandMock(id);
            expandedItemsState = {
              ...expandedItemsState,
              [id]: !expandedItemsState[id],
            };
          },
          expandAll: () => {
            expandAllMock();
            // Simulate expanding all items
            const newState: Record<string, boolean> = {};
            const expandAllItems = (items: TestItem[]) => {
              items.forEach((item) => {
                newState[item.id] = true;
                if (item.children) {
                  expandAllItems(item.children);
                }
              });
            };
            expandAllItems(tests);
            expandedItemsState = newState;
          },
          collapseAll: () => {
            collapseAllMock();
            // Simulate collapsing all items
            expandedItemsState = {};
          },
          showResults: true,
          toggleResultsVisibility: vi.fn(),
          currentMicroserviceId: microserviceId || null,
          isLoading: false,
          error: null,
          functionResults: {},
          runTest: vi.fn(),
          viewTestOutput: vi.fn(),
          runningTests: {},
          isOutputModalOpen: false,
          selectedTestId: null,
          closeOutputModal: vi.fn(),
          setRunningTests: vi.fn(),
          setCurrentMicroservice: vi.fn(),
          runAllTests: vi.fn(),
        };
      }),
  };
});

// Mock the useProject hook
vi.mock('../../context/useProject', () => ({
  useProject: () => ({
    project: { id: 'project1', name: 'Test Project' },
    setProject: vi.fn(),
  }),
}));

// Mock the ProjectContext
vi.mock('../../context/ProjectContext', () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the TestItemComponent
vi.mock('../../components/testing/components/TestItem', () => ({
  TestItemComponent: ({
    item,
    isExpanded,
    onToggleExpand,
  }: {
    item: TestItem;
    isExpanded: boolean;
    onToggleExpand: (id: string) => void;
  }) => (
    <div data-testid={`test-item-${item.id}`} className={isExpanded ? 'expanded' : 'collapsed'}>
      {item.name}
      <button data-testid={`toggle-${item.id}`} onClick={() => onToggleExpand(item.id)}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      {item.children && isExpanded && (
        <div data-testid={`children-${item.id}`}>
          {item.children.map((child) => (
            <div key={child.id} data-testid={`child-${child.id}`}>
              {child.name}
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

// Mock the IconButton component
vi.mock('../../components/testing/components/IconButton', () => ({
  IconButton: ({ onClick, title }: { onClick: () => void; title: string }) => (
    <button data-testid={`button-${title.replace(/\s+/g, '-').toLowerCase()}`} onClick={onClick}>
      {title}
    </button>
  ),
}));

// Mock the TestOutputModal
vi.mock('../../components/testing/components/TestOutputModal', () => ({
  TestOutputModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="test-output-modal"></div> : null,
}));

// Helper function to reset mocks
function resetMocks() {
  expandedItemsState = {};
  expandAllMock.mockClear();
  collapseAllMock.mockClear();
  toggleExpandMock.mockClear();
}

describe('Expand All Functions Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMocks();
  });

  it('should expand all test items when "Expand all functions" button is clicked', async () => {
    const { user } = render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={vi.fn()}
        onGenerateTest={vi.fn()}
        functionResults={{}}
      />,
    );

    // Initially, only some items might be expanded based on the mock
    // Click the "Expand all functions" button
    const expandAllButton = screen.getByTestId('button-expand-all-functions');
    await user.click(expandAllButton);

    // Check that expandAll was called
    expect(expandAllMock).toHaveBeenCalled();

    // After clicking, all test items should be expanded
    mockTestItems.forEach((item) => {
      const testItem = screen.getByTestId(`test-item-${item.id}`);
      expect(testItem).toHaveClass('expanded');

      // If the item has children, they should be visible
      if (item.children && item.children.length > 0) {
        const childrenContainer = screen.getByTestId(`children-${item.id}`);
        expect(childrenContainer).toBeInTheDocument();

        // Check that all children are rendered
        item.children.forEach((child) => {
          const childElement = screen.getByTestId(`child-${child.id}`);
          expect(childElement).toBeInTheDocument();
        });
      }
    });

    // Check that the toggle buttons now say "Collapse"
    mockTestItems.forEach((item) => {
      const toggleButton = screen.getByTestId(`toggle-${item.id}`);
      expect(toggleButton).toHaveTextContent('Collapse');
    });
  });

  it('should collapse all test items when "Collapse all" button is clicked', async () => {
    // First render and expand all items
    const { user, rerender } = render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={vi.fn()}
        onGenerateTest={vi.fn()}
        functionResults={{}}
      />,
    );

    // Expand all items first
    const expandAllButton = screen.getByTestId('button-expand-all-functions');
    await user.click(expandAllButton);

    // Verify all items are expanded
    rerender(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={vi.fn()}
        onGenerateTest={vi.fn()}
        functionResults={{}}
      />,
    );

    mockTestItems.forEach((item) => {
      const testItem = screen.getByTestId(`test-item-${item.id}`);
      expect(testItem).toHaveClass('expanded');
    });

    // Now all items should be expanded
    // Click the "Collapse all" button
    const collapseAllButton = screen.getByTestId('button-collapse-all');
    await user.click(collapseAllButton);

    // Check that collapseAll was called
    expect(collapseAllMock).toHaveBeenCalled();

    // Force a rerender to reflect the state changes
    rerender(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={vi.fn()}
        onGenerateTest={vi.fn()}
        functionResults={{}}
      />,
    );

    // After clicking, all test items should be collapsed
    mockTestItems.forEach((item) => {
      const testItem = screen.getByTestId(`test-item-${item.id}`);
      expect(testItem).toHaveClass('collapsed');

      // Children should not be visible
      if (item.children && item.children.length > 0) {
        const childrenContainer = screen.queryByTestId(`children-${item.id}`);
        expect(childrenContainer).not.toBeInTheDocument();
      }
    });

    // Check that the toggle buttons now say "Expand"
    mockTestItems.forEach((item) => {
      const toggleButton = screen.getByTestId(`toggle-${item.id}`);
      expect(toggleButton).toHaveTextContent('Expand');
    });
  });

  it('should correctly update button text when manually expanding/collapsing items', async () => {
    const { user, rerender } = render(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={vi.fn()}
        onGenerateTest={vi.fn()}
        functionResults={{}}
      />,
    );

    // Initially, all items should be collapsed
    mockTestItems.forEach((item) => {
      const testItem = screen.getByTestId(`test-item-${item.id}`);
      expect(testItem).toHaveClass('collapsed');
    });

    // Manually expand all items one by one
    for (const item of mockTestItems) {
      const toggleButton = screen.getByTestId(`toggle-${item.id}`);
      await user.click(toggleButton);

      // If the item has children, expand them too
      if (item.children && item.children.length > 0) {
        for (const child of item.children) {
          // Need to query again as the DOM has changed
          const childToggle = screen.queryByTestId(`toggle-${child.id}`);
          if (childToggle) {
            await user.click(childToggle);
          }
        }
      }
    }

    // Force a rerender to reflect the state changes
    rerender(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={vi.fn()}
        onGenerateTest={vi.fn()}
        functionResults={{}}
      />,
    );

    // Verify all items are expanded
    mockTestItems.forEach((item) => {
      const testItem = screen.getByTestId(`test-item-${item.id}`);
      expect(testItem).toHaveClass('expanded');

      // Check that the toggle button says "Collapse"
      const toggleButton = screen.getByTestId(`toggle-${item.id}`);
      expect(toggleButton).toHaveTextContent('Collapse');
    });

    // Now collapse one item
    const firstItemToggle = screen.getByTestId(`toggle-${mockTestItems[0].id}`);
    await user.click(firstItemToggle);

    // Force another rerender
    rerender(
      <TestList
        microserviceId="ms1"
        tests={mockTestItems}
        onRunTest={vi.fn()}
        onGenerateTest={vi.fn()}
        functionResults={{}}
      />,
    );

    // Check that the first item is now collapsed
    const firstItem = screen.getByTestId(`test-item-${mockTestItems[0].id}`);
    expect(firstItem).toHaveClass('collapsed');

    // Check that the first item's toggle button now says "Expand"
    const firstItemToggleAfterClick = screen.getByTestId(`toggle-${mockTestItems[0].id}`);
    expect(firstItemToggleAfterClick).toHaveTextContent('Expand');
  });
});
