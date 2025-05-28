import { renderHook, act } from '@testing-library/react';
import {
  useServiceFilters,
  FilterGroup,
} from '@/components/monitoring/hooks/useServiceFilters';
import { Service } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useServiceFilters', () => {
  // Test data
  const projectId = 'test-project';
  const mockServices: Service[] = [
    {
      id: '1',
      name: 'API Gateway',
      status: 'Online',
      health: 'Healthy',
    },
    {
      id: '2',
      name: 'Auth Service',
      status: 'Online',
      health: 'Degraded',
    },
    {
      id: '3',
      name: 'Database Service',
      status: 'Offline',
      health: 'Error',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should return all services when no filters are applied', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    expect(result.current.filteredServices).toEqual(mockServices);
    expect(result.current.filterGroups).toEqual([]);
  });

  it('should filter services with AND operator', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    act(() => {
      result.current.addFilterGroup({
        operator: 'AND',
        conditions: [
          { field: 'status', value: 'Online' },
          { field: 'health', value: 'Healthy' },
        ],
      });
    });

    // Only API Gateway should match both conditions
    expect(result.current.filteredServices).toHaveLength(1);
    expect(result.current.filteredServices[0].name).toBe('API Gateway');
  });

  it('should filter services with OR operator', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    act(() => {
      result.current.addFilterGroup({
        operator: 'OR',
        conditions: [
          { field: 'health', value: 'Degraded' },
          { field: 'health', value: 'Error' },
        ],
      });
    });

    // Auth Service and Database Service should match
    expect(result.current.filteredServices).toHaveLength(2);
    expect(result.current.filteredServices[0].name).toBe('Auth Service');
    expect(result.current.filteredServices[1].name).toBe('Database Service');
  });

  it('should filter services with NOT operator', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    act(() => {
      result.current.addFilterGroup({
        operator: 'NOT',
        conditions: [{ field: 'status', value: 'Online' }],
      });
    });

    // Only Database Service should match (not Online)
    expect(result.current.filteredServices).toHaveLength(1);
    expect(result.current.filteredServices[0].name).toBe('Database Service');
  });

  it('should handle multiple filter groups', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    act(() => {
      // First filter: status is Online
      result.current.addFilterGroup({
        operator: 'AND',
        conditions: [{ field: 'status', value: 'Online' }],
      });

      // Second filter: health is not Healthy
      result.current.addFilterGroup({
        operator: 'NOT',
        conditions: [{ field: 'health', value: 'Healthy' }],
      });
    });

    // Only Auth Service should match both filter groups
    expect(result.current.filteredServices).toHaveLength(1);
    expect(result.current.filteredServices[0].name).toBe('Auth Service');
  });

  it('should update a filter group', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    act(() => {
      // Add initial filter
      result.current.addFilterGroup({
        operator: 'AND',
        conditions: [{ field: 'status', value: 'Online' }],
      });
    });

    // Initially should match API Gateway and Auth Service
    expect(result.current.filteredServices).toHaveLength(2);

    act(() => {
      // Update the filter
      result.current.updateFilterGroup(0, {
        operator: 'AND',
        conditions: [{ field: 'status', value: 'Offline' }],
      });
    });

    // After update should match only Database Service
    expect(result.current.filteredServices).toHaveLength(1);
    expect(result.current.filteredServices[0].name).toBe('Database Service');
  });

  it('should remove a filter group', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    act(() => {
      // Add filter
      result.current.addFilterGroup({
        operator: 'AND',
        conditions: [{ field: 'status', value: 'Online' }],
      });
    });

    // Initially should match API Gateway and Auth Service
    expect(result.current.filteredServices).toHaveLength(2);

    act(() => {
      // Remove the filter
      result.current.removeFilterGroup(0);
    });

    // After removal should match all services
    expect(result.current.filteredServices).toHaveLength(3);
  });

  it('should clear all filters', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    act(() => {
      // Add multiple filters
      result.current.addFilterGroup({
        operator: 'AND',
        conditions: [{ field: 'status', value: 'Online' }],
      });

      result.current.addFilterGroup({
        operator: 'NOT',
        conditions: [{ field: 'health', value: 'Healthy' }],
      });
    });

    // Initially should match only Auth Service
    expect(result.current.filteredServices).toHaveLength(1);

    act(() => {
      // Clear all filters
      result.current.clearFilters();
    });

    // After clearing should match all services
    expect(result.current.filteredServices).toHaveLength(3);
    expect(result.current.filterGroups).toEqual([]);
  });

  it('should save filters to localStorage', () => {
    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    const testFilter: FilterGroup = {
      operator: 'AND',
      conditions: [{ field: 'status', value: 'Online' }],
    };

    act(() => {
      result.current.addFilterGroup(testFilter);
    });

    // Check if localStorage was called with the right key and value
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `serviceFilters_${projectId}`,
      JSON.stringify([testFilter]),
    );
  });

  it('should load filters from localStorage', () => {
    const savedFilter: FilterGroup = {
      operator: 'OR',
      conditions: [{ field: 'health', value: 'Error' }],
    };

    // Set up localStorage with saved filter
    localStorageMock.setItem(
      `serviceFilters_${projectId}`,
      JSON.stringify([savedFilter]),
    );

    const { result } = renderHook(
      () => useServiceFilters({ projectId, services: mockServices }),
      {},
    );

    // Check if filter was loaded
    expect(result.current.filterGroups).toEqual([savedFilter]);

    // Check if services were filtered correctly
    expect(result.current.filteredServices).toHaveLength(1);
    expect(result.current.filteredServices[0].name).toBe('Database Service');
  });

  it(
    'should handle localStorage parsing errors',
    () => {
      // Set up localStorage with invalid JSON
      localStorageMock.setItem(`serviceFilters_${projectId}`, 'invalid-json');

      // Spy on console.error
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(
        () => useServiceFilters({ projectId, services: mockServices }),
        {},
      );

      // Should log error and remove the invalid item
      expect(consoleSpy).toHaveBeenCalled();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        `serviceFilters_${projectId}`,
      );

      // Should still work with default empty filters
      expect(result.current.filterGroups).toEqual([]);
      expect(result.current.filteredServices).toEqual(mockServices);

      consoleSpy.mockRestore();
    },
    {},
  );
});
