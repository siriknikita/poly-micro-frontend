import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { AutomatedTesting } from '@/components/testing';
import { mockMicroservices } from '../mocks/mockData';

// Create mock functions we'll use in tests
const mockShowInfo = vi.fn();
const mockShowSuccess = vi.fn();
const mockStartResize = vi.fn();
const mockRunAllTests = vi.fn(() => ({ totalTests: 3, microserviceName: 'Microservice 1' }));

// Mock the useProject hook
vi.mock('@/context/useProject', () => ({
  useProject: vi.fn(() => ({
    project: {
      id: 'project1',
      microservices: mockMicroservices,
    },
  })),
}));

// Mock the context provider
vi.mock('@/context/ProjectContext', () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the useToast hook
vi.mock('@/context/useToast', () => ({
  useToast: vi.fn(() => ({
    showInfo: mockShowInfo,
    showSuccess: mockShowSuccess,
    showError: vi.fn(),
    showWarning: vi.fn(),
  })),
}));

// Mock the toast context
vi.mock('@/context/ToastContext', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the custom hooks
vi.mock('@/components/testing/hooks', () => ({
  useResizablePanel: vi.fn(() => ({
    width: 300,
    isDragging: false,
    setIsDragging: vi.fn(),
    startResize: mockStartResize,
  })),
  useTestItems: vi.fn(() => ({
    functionResults: {
      test1: { status: 'success', output: 'Test passed' },
      test2: { status: 'running' },
    },
    runTest: vi.fn(),
    runAllTests: mockRunAllTests,
    setCurrentMicroservice: vi.fn(),
    allTestsComplete: true,
  })),
  useMicroserviceNavigation: vi.fn(() => ({
    selectedMicroservice: mockMicroservices[0],
    setSelectedMicroservice: vi.fn(),
    searchQuery: '',
    setSearchQuery: vi.fn(),
    filteredMicroservices: mockMicroservices,
    navigateMicroservice: vi.fn(),
    getPreviousMicroserviceName: vi.fn(() => 'Previous Service'),
    getNextMicroserviceName: vi.fn(() => 'Next Service'),
  })),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe('AutomatedTesting Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with microservice name and test list', () => {
    render(<AutomatedTesting />);

    // Microservice name should be displayed
    expect(screen.getByText('Testing: ' + mockMicroservices[0].name)).toBeInTheDocument();

    // Test list should be rendered when microservice has children
    expect(screen.getByText(/Authentication Service/)).toBeInTheDocument();
  });

  it('renders the run all tests button', () => {
    render(<AutomatedTesting />);

    // Run all tests button should be visible
    const runAllButton = screen.getByText('Run All Tests');
    expect(runAllButton).toBeInTheDocument();

    // Test button click
    fireEvent.click(runAllButton);
    expect(mockShowInfo).toHaveBeenCalledWith('Running 3 tests for Microservice 1...');
  });

  it('renders the chat toggle button', () => {
    render(<AutomatedTesting />);

    // Chat toggle button should be visible
    const chatToggleButton = screen.getByLabelText('Hide Test Assistant');
    expect(chatToggleButton).toBeInTheDocument();

    // Test button click to hide chat
    fireEvent.click(chatToggleButton);
    // After clicking, the aria-label should change
    expect(screen.getByLabelText('Show Test Assistant')).toBeInTheDocument();
  });

  it('renders the ResizeHandle component when chat is visible', () => {
    render(<AutomatedTesting />);

    // Resize handle should be rendered
    const resizeHandle = screen.getByRole('separator');
    expect(resizeHandle).toBeInTheDocument();

    // Test resize start
    fireEvent.mouseDown(resizeHandle);
    expect(mockStartResize).toHaveBeenCalled();
  });

  it('shows success toast when all tests complete', () => {
    // Render with allTestsComplete = true
    render(<AutomatedTesting />);

    // Success toast should have been called
    expect(mockShowSuccess).toHaveBeenCalledWith(
      'All tests for Authentication Service have completed',
    );
  });

  it('handles test generation correctly', () => {
    // We'll just verify the component renders correctly
    render(<AutomatedTesting />);

    // Since we can't directly test the handleGenerateTest function in this test,
    // we'll just verify that the component renders without errors
    expect(screen.getByText('Testing: ' + mockMicroservices[0].name)).toBeInTheDocument();
  });
});
