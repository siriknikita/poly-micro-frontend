import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import { CPUChart } from '../../../components/monitoring/CPUChart';
import { CPUData, Service } from '@/types';

// Mock the hooks
vi.mock('../../../components/monitoring/hooks', () => ({
  useMetricsSelection: vi.fn(() => ({
    metrics: [
      { id: 'load', name: 'CPU Load %', dataKey: 'load', color: '#4f46e5', selected: true },
      { id: 'memory', name: 'Memory Usage %', dataKey: 'memory', color: '#059669', selected: true },
      {
        id: 'threads',
        name: 'Active Threads',
        dataKey: 'threads',
        color: '#db2777',
        selected: false,
      },
    ],
    updateMetricSelection: vi.fn(),
  })),
}));

// Mock the shared components
vi.mock('../../../components/monitoring/shared/ServiceSelector', () => ({
  ServiceSelector: ({
    onServiceSelect,
    services,
    selectedService,
  }: {
    onServiceSelect: (service: string) => void;
    services: Service[];
    selectedService: string | null;
  }) => (
    <div data-testid="service-selector">
      <select
        data-testid="service-select"
        value={selectedService || ''}
        onChange={(e) => onServiceSelect(e.target.value)}
      >
        <option value="">Select a service</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('../../../components/monitoring/shared/MetricsSelector', () => ({
  MetricsSelector: ({
    metrics,
    onMetricsChange,
  }: {
    metrics: Array<{ id: string; name: string; dataKey: string; color: string; selected: boolean }>;
    onMetricsChange: (ids: string[]) => void;
  }) => (
    <div data-testid="metrics-selector">
      {metrics.map((metric) => (
        <div key={metric.id} data-testid={`metric-${metric.id}`}>
          <input
            type="checkbox"
            checked={metric.selected}
            onChange={() => {
              const selectedIds = metrics
                .filter((m) => (m.id === metric.id ? !m.selected : m.selected))
                .map((m) => m.id);
              onMetricsChange(selectedIds);
            }}
          />
          {metric.name}
        </div>
      ))}
    </div>
  ),
}));

// Mock recharts components
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="line-chart">{children}</div>
    ),
    Line: ({ dataKey, stroke, name }: { dataKey: string; stroke: string; name: string }) => (
      <div data-testid={`line-${dataKey}`} style={{ stroke }} data-name={name}></div>
    ),
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    Legend: () => <div data-testid="legend"></div>,
  };
});

describe('CPUChart Component', () => {
  const mockServices: Service[] = [
    { id: 'service1', name: 'Service 1', status: 'Running' },
    { id: 'service2', name: 'Service 2', status: 'Stopped' },
  ];

  const mockCPUData: CPUData[] = [
    { time: '10:00', load: 25, memory: 40, threads: 10 },
    { time: '10:05', load: 30, memory: 45, threads: 12 },
    { time: '10:10', load: 35, memory: 50, threads: 15 },
  ];

  const mockOnServiceSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the prompt to select a service when no service is selected', () => {
    render(
      <CPUChart
        data={null}
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        selectedProjectId="project1"
      />,
    );

    expect(
      screen.getByText('Please select a microservice to view its metrics'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('service-selector')).toBeInTheDocument();
  });

  it('renders "No metrics available" message when service is selected but no data', () => {
    render(
      <CPUChart
        data={null}
        selectedService="service1"
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        selectedProjectId="project1"
      />,
    );

    expect(screen.getByText('No metrics available for this service')).toBeInTheDocument();
  });

  it('renders the chart when service is selected and data is available', () => {
    render(
      <CPUChart
        data={mockCPUData}
        selectedService="service1"
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        selectedProjectId="project1"
      />,
    );

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-load')).toBeInTheDocument();
    expect(screen.getByTestId('line-memory')).toBeInTheDocument();
    // threads is not selected in our mock
    expect(screen.queryByTestId('line-threads')).not.toBeInTheDocument();
  });

  it('renders the metrics selector when service is selected and data is available', () => {
    render(
      <CPUChart
        data={mockCPUData}
        selectedService="service1"
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        selectedProjectId="project1"
      />,
    );

    expect(screen.getByTestId('metrics-selector')).toBeInTheDocument();
  });

  it('allows service selection through the service selector', async () => {
    const { user } = render(
      <CPUChart
        data={null}
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        selectedProjectId="project1"
      />,
    );

    const selectElement = screen.getByTestId('service-select');
    await user.selectOptions(selectElement, 'service1');

    expect(mockOnServiceSelect).toHaveBeenCalledWith('service1');
  });
});
