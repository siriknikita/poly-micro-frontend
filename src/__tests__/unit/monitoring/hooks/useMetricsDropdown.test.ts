import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMetricsDropdown } from '../../../../components/monitoring/hooks/useMetricsDropdown';
import { Metric } from '../../../../components/monitoring/shared/MetricsSelector';

describe('useMetricsDropdown Hook', () => {
  const mockMetrics: Metric[] = [
    { id: 'load', name: 'CPU Load %', selected: true },
    { id: 'memory', name: 'Memory Usage %', selected: true },
    { id: 'threads', name: 'Active Threads', selected: false },
  ];

  const mockOnMetricsChange = vi.fn();

  // Mock document event listeners
  const mockAddEventListener = vi.spyOn(document, 'addEventListener');
  const mockRemoveEventListener = vi.spyOn(document, 'removeEventListener');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct state', () => {
    const { result } = renderHook(() =>
      useMetricsDropdown({
        metrics: mockMetrics,
        onMetricsChange: mockOnMetricsChange,
      }),
    );

    expect(result.current.isOpen).toBe(false);
    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredMetrics).toEqual(mockMetrics);
    expect(result.current.selectedCount).toBe(2); // load and memory are selected
  });

  it('should toggle dropdown open/closed', () => {
    const { result } = renderHook(() =>
      useMetricsDropdown({
        metrics: mockMetrics,
        onMetricsChange: mockOnMetricsChange,
      }),
    );

    // Initially closed
    expect(result.current.isOpen).toBe(false);

    // Open dropdown
    act(() => {
      result.current.toggleDropdown();
    });
    expect(result.current.isOpen).toBe(true);

    // Close dropdown
    act(() => {
      result.current.toggleDropdown();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should filter metrics based on search term', () => {
    const { result } = renderHook(() =>
      useMetricsDropdown({
        metrics: mockMetrics,
        onMetricsChange: mockOnMetricsChange,
      }),
    );

    // Initially all metrics are shown
    expect(result.current.filteredMetrics.length).toBe(3);

    // Search for "CPU"
    act(() => {
      result.current.handleSearchChange('CPU');
    });

    // Only CPU Load should be shown
    expect(result.current.filteredMetrics.length).toBe(1);
    expect(result.current.filteredMetrics[0].id).toBe('load');

    // Search for "Usage"
    act(() => {
      result.current.handleSearchChange('Usage');
    });

    // Only Memory Usage should be shown
    expect(result.current.filteredMetrics.length).toBe(1);
    expect(result.current.filteredMetrics[0].id).toBe('memory');

    // Clear search
    act(() => {
      result.current.handleSearchChange('');
    });

    // All metrics should be shown again
    expect(result.current.filteredMetrics.length).toBe(3);
  });

  it('should toggle metric selection', () => {
    const { result } = renderHook(() =>
      useMetricsDropdown({
        metrics: mockMetrics,
        onMetricsChange: mockOnMetricsChange,
      }),
    );

    // Initially 2 metrics are selected
    expect(result.current.selectedCount).toBe(2);

    // Toggle 'load' off
    act(() => {
      result.current.toggleMetric('load');
    });

    // Should call onMetricsChange with updated selection
    expect(mockOnMetricsChange).toHaveBeenCalledWith(['memory']);

    // Toggle 'threads' on
    act(() => {
      result.current.toggleMetric('threads');
    });

    // Should call onMetricsChange with updated selection
    expect(mockOnMetricsChange).toHaveBeenCalledWith(['memory', 'threads']);
  });

  it('should handle keyboard events', () => {
    const { result } = renderHook(() =>
      useMetricsDropdown({
        metrics: mockMetrics,
        onMetricsChange: mockOnMetricsChange,
      }),
    );

    // Open dropdown
    act(() => {
      result.current.toggleDropdown();
    });
    expect(result.current.isOpen).toBe(true);

    // Press Escape
    act(() => {
      result.current.handleKeyDown({ key: 'Escape' } as React.KeyboardEvent);
    });

    // Dropdown should close
    expect(result.current.isOpen).toBe(false);

    // Open dropdown again
    act(() => {
      result.current.toggleDropdown();
    });

    // Search for "CPU" to filter to one result
    act(() => {
      result.current.handleSearchChange('CPU');
    });

    // Press Enter (with no metricId, should toggle the only visible metric)
    act(() => {
      result.current.handleKeyDown({ key: 'Enter' } as React.KeyboardEvent);
    });

    // Should toggle the 'load' metric
    expect(mockOnMetricsChange).toHaveBeenCalled();

    // Press Enter with specific metricId
    act(() => {
      result.current.handleKeyDown(
        { key: 'Enter' } as React.KeyboardEvent,
        'memory',
      );
    });

    // Should toggle the 'memory' metric
    expect(mockOnMetricsChange).toHaveBeenCalled();
  });

  it('should add and remove event listeners', () => {
    const { unmount } = renderHook(() =>
      useMetricsDropdown({
        metrics: mockMetrics,
        onMetricsChange: mockOnMetricsChange,
      }),
    );

    // Should add click outside listener
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );

    // Unmount
    unmount();

    // Should remove click outside listener
    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );
  });

  it('should update metrics when props change', () => {
    const { result, rerender } = renderHook(
      (props) => useMetricsDropdown(props),
      {
        initialProps: {
          metrics: mockMetrics,
          onMetricsChange: mockOnMetricsChange,
        },
      },
    );

    // Initially 2 metrics are selected
    expect(result.current.selectedCount).toBe(2);

    // Update props with new metrics
    const updatedMetrics = [
      { id: 'load', name: 'CPU Load %', selected: false },
      { id: 'memory', name: 'Memory Usage %', selected: false },
      { id: 'threads', name: 'Active Threads', selected: true },
    ];

    rerender({ metrics: updatedMetrics, onMetricsChange: mockOnMetricsChange });

    // Selected count should update
    expect(result.current.selectedCount).toBe(1);
    expect(result.current.filteredMetrics).toEqual(updatedMetrics);
  });
});
