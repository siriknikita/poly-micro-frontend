import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { MetricsSelector } from '../../../../components/monitoring/shared/MetricsSelector';
import { Metric } from '../../../../components/monitoring/shared/MetricsSelector';

// Mock the useMetricsDropdown hook
vi.mock('../../../../components/monitoring/hooks', () => ({
  useMetricsDropdown: ({
    metrics,
    onMetricsChange,
  }: {
    metrics: Metric[];
    onMetricsChange: (ids: string[]) => void;
  }) => ({
    isOpen: true,
    searchTerm: '',
    filteredMetrics: metrics,
    selectedCount: metrics.filter((m: Metric) => m.selected).length,
    dropdownRef: { current: null },
    searchInputRef: { current: null },
    toggleDropdown: vi.fn(),
    toggleMetric: (id: string) => {
      const updatedMetrics = metrics.map((m: Metric) =>
        m.id === id ? { ...m, selected: !m.selected } : m,
      );
      onMetricsChange(updatedMetrics.filter((m: Metric) => m.selected).map((m: Metric) => m.id));
    },
    handleSearchChange: vi.fn(),
    handleKeyDown: vi.fn(),
  }),
}));

// Mock the child components
vi.mock('../../../../components/monitoring/shared/MetricsToggleButton', () => ({
  MetricsToggleButton: ({
    selectedCount,
    onClick,
    isOpen,
  }: {
    selectedCount: number;
    onClick: () => void;
    isOpen: boolean;
  }) => (
    <button
      data-testid="metrics-toggle-button"
      onClick={onClick}
      data-selected-count={selectedCount}
      data-is-open={isOpen}
    >
      Metrics ({selectedCount})
    </button>
  ),
}));

vi.mock('../../../../components/monitoring/shared/MetricsSearch', () => ({
  MetricsSearch: ({
    searchTerm,
    onChange,
    onKeyDown,
    inputRef,
  }: {
    searchTerm: string;
    onChange: (value: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <input
      data-testid="metrics-search"
      type="text"
      value={searchTerm}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      ref={inputRef}
    />
  ),
}));

vi.mock('../../../../components/monitoring/shared/MetricsList', () => ({
  MetricsList: ({
    metrics,
    onToggleMetric,
    onKeyDown,
  }: {
    metrics: Metric[];
    onToggleMetric: (id: string) => void;
    onKeyDown: (e: React.KeyboardEvent, id?: string) => void;
  }) => (
    <div data-testid="metrics-list">
      {metrics.map((metric: Metric) => (
        <div
          key={metric.id}
          data-testid={`metric-item-${metric.id}`}
          data-selected={metric.selected}
          onClick={() => onToggleMetric(metric.id)}
          onKeyDown={(e) => onKeyDown(e, metric.id)}
          tabIndex={0}
        >
          {metric.name}
        </div>
      ))}
    </div>
  ),
}));

describe('MetricsSelector Component', () => {
  const mockMetrics: Metric[] = [
    { id: 'load', name: 'CPU Load %', selected: true },
    { id: 'memory', name: 'Memory Usage %', selected: true },
    { id: 'threads', name: 'Active Threads', selected: false },
  ];

  const mockOnMetricsChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with all subcomponents', () => {
    render(<MetricsSelector metrics={mockMetrics} onMetricsChange={mockOnMetricsChange} />);

    // Toggle button should be rendered
    expect(screen.getByTestId('metrics-toggle-button')).toBeInTheDocument();

    // Dropdown is open in our mock, so search and list should be visible
    expect(screen.getByTestId('metrics-search')).toBeInTheDocument();
    expect(screen.getByTestId('metrics-list')).toBeInTheDocument();

    // All metrics should be rendered
    expect(screen.getByTestId('metric-item-load')).toBeInTheDocument();
    expect(screen.getByTestId('metric-item-memory')).toBeInTheDocument();
    expect(screen.getByTestId('metric-item-threads')).toBeInTheDocument();
  });

  it('shows correct selected state for metrics', () => {
    render(<MetricsSelector metrics={mockMetrics} onMetricsChange={mockOnMetricsChange} />);

    // Check selected state
    expect(screen.getByTestId('metric-item-load').getAttribute('data-selected')).toBe('true');
    expect(screen.getByTestId('metric-item-memory').getAttribute('data-selected')).toBe('true');
    expect(screen.getByTestId('metric-item-threads').getAttribute('data-selected')).toBe('false');
  });

  it('shows correct selected count in toggle button', () => {
    render(<MetricsSelector metrics={mockMetrics} onMetricsChange={mockOnMetricsChange} />);

    // Toggle button should show 2 selected metrics
    expect(screen.getByTestId('metrics-toggle-button').getAttribute('data-selected-count')).toBe(
      '2',
    );
  });

  it('calls onMetricsChange when a metric is toggled', async () => {
    const { user } = render(
      <MetricsSelector metrics={mockMetrics} onMetricsChange={mockOnMetricsChange} />,
    );

    // Click on the 'load' metric to toggle it off
    await user.click(screen.getByTestId('metric-item-load'));

    // onMetricsChange should be called with only 'memory' selected
    expect(mockOnMetricsChange).toHaveBeenCalledWith(['memory']);

    // Reset mock to check only the next call
    mockOnMetricsChange.mockClear();

    // Click on the 'threads' metric to toggle it on
    await user.click(screen.getByTestId('metric-item-threads'));

    // onMetricsChange should be called with the latest state
    expect(mockOnMetricsChange).toHaveBeenCalledWith(['load', 'memory', 'threads']);
  });

  it('applies custom className when provided', () => {
    render(
      <MetricsSelector
        metrics={mockMetrics}
        onMetricsChange={mockOnMetricsChange}
        className="custom-class"
      />,
    );

    // The root div should have the custom class
    const rootElement = screen.getByTestId('metrics-toggle-button').closest('div');
    expect(rootElement).toHaveClass('custom-class');
  });
});
