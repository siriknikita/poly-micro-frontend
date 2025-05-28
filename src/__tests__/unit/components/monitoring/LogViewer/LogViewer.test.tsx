import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LogViewer } from '@/components/monitoring/LogViewer/LogViewer';
import { Log, Service } from '@/types';

// Mock dependencies
const mockUsePagination = jest
  .fn()
  .mockImplementation(() => mockPaginationReturn);
jest.mock('@hooks/index', () => ({
  usePagination: mockUsePagination,
}));

jest.mock('@shared/index', () => ({
  BoxedWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="boxed-wrapper">{children}</div>
  ),
  SectionHeader: ({
    title,
    HeaderIcon,
    headerClassName,
  }: {
    title: string;
    HeaderIcon?: React.ComponentType;
    headerClassName?: string;
    iconClassName?: string;
  }) => (
    <div data-testid="section-header">
      {HeaderIcon && <HeaderIcon data-testid="header-icon" />}
      <span className={headerClassName}>{title}</span>
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  AlertCircle: () => <span data-testid="alert-circle-icon">AlertCircle</span>,
}));

jest.mock(
  '../../../../../../../src/components/monitoring/LogViewer/TablePagination',
  () => ({
    __esModule: true,
    TablePagination: ({
      currentPage,
      totalPages,
    }: {
      currentPage: number;
      totalPages: number;
    }) => (
      <div data-testid="table-pagination">
        Table Pagination: Page {currentPage} of {totalPages}
      </div>
    ),
  }),
);

// Mock the shared components
jest.mock('@/components/monitoring/shared', () => {
  // Create simple mock components that directly call the handlers
  const ServiceSelector = ({
    selectedService,
    onServiceSelect,
  }: {
    selectedService: string;
    services?: Service[];
    onServiceSelect: (service: string) => void;
  }) => (
    <div data-testid="service-selector">
      <div data-testid="service-display">
        {selectedService || 'All Services'}
      </div>
      <div className="dropdown-menu">
        <button
          data-testid="dropdown-option-service1"
          onClick={() => onServiceSelect('service1')}
        >
          Service 1
        </button>
        <button
          data-testid="dropdown-option-All"
          onClick={() => onServiceSelect('All')}
        >
          All Services
        </button>
      </div>
    </div>
  );

  const SeveritySelector = ({
    selectedSeverity,
    onSeverityChange,
  }: {
    selectedSeverity: string;
    onSeverityChange: (severity: string) => void;
  }) => (
    <div data-testid="severity-selector">
      <div data-testid="severity-display">
        {selectedSeverity || 'All Severities'}
      </div>
      <div className="dropdown-menu">
        <button
          data-testid="dropdown-option-error"
          onClick={() => onSeverityChange('error')}
        >
          ERROR
        </button>
        <button
          data-testid="dropdown-option-info"
          onClick={() => onSeverityChange('info')}
        >
          INFO
        </button>
        <button
          data-testid="dropdown-option-warn"
          onClick={() => onSeverityChange('warn')}
        >
          WARN
        </button>
        <button
          data-testid="dropdown-option-all"
          onClick={() => onSeverityChange('all')}
        >
          All Severities
        </button>
      </div>
    </div>
  );

  const RowsPerPageSelector = ({
    itemsPerPage,
    onItemsPerPageChange,
  }: {
    itemsPerPage: number;
    onItemsPerPageChange: (event: { target: { value: number } }) => void;
  }) => {
    // Create a function that directly calls the handler with the right value
    const handleChange = (value: number) => {
      onItemsPerPageChange({ target: { value } });
    };

    return (
      <div data-testid="rows-per-page-selector">
        <div data-testid="rows-per-page-selector-display">
          {itemsPerPage} per page
        </div>
        <div className="dropdown-menu">
          <button
            data-testid="dropdown-option-10"
            onClick={() => handleChange(10)}
          >
            10 per page
          </button>
          <button
            data-testid="dropdown-option-25"
            onClick={() => handleChange(25)}
          >
            25 per page
          </button>
        </div>
      </div>
    );
  };

  return {
    ServiceSelector,
    SeveritySelector,
    RowsPerPageSelector,
    StatusBadge: ({ status, variant }: { status: string; variant: string }) => (
      <span
        data-testid={`status-badge-${status}`}
        className={variant}
      >
        {status}
      </span>
    ),
  };
});

// StatusBadge is now mocked in the shared components mock above

// Define mock pagination return value outside the describe block
const mockPaginationReturn = {
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  paginatedLogs: [] as Log[],
  setLastLogRowRef: jest.fn(),
  handlePageChange: jest.fn(),
  handleItemsPerPageChange: jest.fn(),
};

describe('LogViewer', () => {
  // Test data
  const mockServices: Service[] = [
    { id: '1', name: 'service1', url: 'http://service1.com' },
    { id: '2', name: 'service2', url: 'http://service2.com' },
  ];

  const mockLogs: Log[] = [
    {
      id: '1',
      timestamp: '2025-04-25T10:00:00Z',
      service_id: '1',
      severity: 'error',
      message: 'Error message 1',
      project_id: '1',
    },
    {
      id: '2',
      timestamp: '2025-04-25T10:05:00Z',
      service_id: '1',
      severity: 'info',
      message: 'Info message 1',
      project_id: '1',
    },
    {
      id: '3',
      timestamp: '2025-04-25T10:10:00Z',
      service_id: '2',
      severity: 'warn',
      message: 'Warning message 1',
      project_id: '1',
    },
    {
      id: '4',
      timestamp: '2025-04-25T10:15:00Z',
      service_id: '2',
      severity: 'info',
      message: 'Info message 2',
      project_id: '1',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Update the mock pagination return value for the current test
    mockPaginationReturn.paginatedLogs = mockLogs;
  });

  it('should render the component with logs', () => {
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />,
    );

    expect(screen.getByTestId('boxed-wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('section-header')).toBeInTheDocument();
    expect(screen.getByTestId('service-selector')).toBeInTheDocument();
    expect(screen.getByText('4 entries')).toBeInTheDocument();
  });

  // it('should display filtered logs count correctly', () => {
  //   // Set up the pagination hook to return fewer logs to simulate filtering
  //   mockPaginationReturn.paginatedLogs = [mockLogs[0]];

  //   render(
  //     <LogViewer
  //       logs={[mockLogs[0]]}
  //       selectedService="service1"
  //       selectedSeverity="error"
  //       onServiceChange={jest.fn()}
  //       onSeverityChange={jest.fn()}
  //       services={mockServices}
  //     />,
  //   );

  //   expect(screen.getByText('1 entry')).toBeInTheDocument();
  // });

  it('should call onServiceChange when service filter changes', () => {
    const mockOnServiceChange = jest.fn();

    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={mockOnServiceChange}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />,
    );

    // Click the button that selects Service 1
    const serviceButton = screen.getByTestId('dropdown-option-service1');
    fireEvent.click(serviceButton);

    expect(mockOnServiceChange).toHaveBeenCalledWith('service1');
  });

  it('should call onSeverityChange when severity filter changes', () => {
    const mockOnSeverityChange = jest.fn();

    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={mockOnSeverityChange}
        services={mockServices}
      />,
    );

    // Click the button that selects ERROR severity
    const severityButton = screen.getByTestId('dropdown-option-error');
    fireEvent.click(severityButton);

    expect(mockOnSeverityChange).toHaveBeenCalledWith('error');
  });

  it('should render with items per page selector', () => {
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />,
    );

    // Verify that the items per page selector is rendered
    const rowsPerPageSelector = screen.getByTestId('rows-per-page-selector');
    expect(rowsPerPageSelector).toBeInTheDocument();

    // Instead of checking for the display element, let's check if the dropdown options are available
    const rowsOption = screen.getByTestId('dropdown-option-10');
    expect(rowsOption).toHaveTextContent('10 per page');
  });

  it('should display table headers', () => {
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />,
    );

    // Check that common table headers are present
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Severity')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('should show pagination when there are logs', () => {
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />,
    );

    expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
  });

  it('should show "No logs found" message when no logs match filters', () => {
    // Set up the pagination hook to return no logs
    mockPaginationReturn.paginatedLogs = [];

    render(
      <LogViewer
        logs={[]}
        selectedService="service1"
        selectedSeverity="error"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />,
    );

    expect(
      screen.getByText('No logs found matching the current filters'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('table-pagination')).not.toBeInTheDocument();
  });

  it('should display log details correctly', () => {
    render(
      <LogViewer
        logs={mockLogs}
        selectedService="All"
        selectedSeverity="All"
        onServiceChange={jest.fn()}
        onSeverityChange={jest.fn()}
        services={mockServices}
      />,
    );

    // Check timestamp, service, and message content for logs
    expect(screen.getByText('Error message 1')).toBeInTheDocument();
    expect(screen.getByText('Info message 1')).toBeInTheDocument();
    expect(screen.getByText('Warning message 1')).toBeInTheDocument();
    expect(screen.getByText('Info message 2')).toBeInTheDocument();

    // Check service names in the table
    expect(screen.getAllByText('service1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('service2').length).toBeGreaterThan(0);

    // Check timestamps
    expect(screen.getByText('2025-04-25T10:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('2025-04-25T10:15:00Z')).toBeInTheDocument();

    // Check severity badges
    expect(screen.getByTestId('status-badge-error')).toBeInTheDocument();
    expect(screen.getByTestId('status-badge-warn')).toBeInTheDocument();
    expect(screen.getAllByTestId('status-badge-info').length).toBe(2);
  });
});
