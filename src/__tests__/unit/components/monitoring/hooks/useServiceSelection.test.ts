import { renderHook, act } from '@testing-library/react';
import { useServiceSelection } from '@/components/monitoring/hooks/useServiceSelection';
import { Service } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useServiceSelection', () => {
  const mockServices: Service[] = [
    { id: '1', name: 'service1', url: 'http://service1.com' },
    { id: '2', name: 'service2', url: 'http://service2.com' },
    { id: '3', name: 'service3', url: 'http://service3.com' },
  ];

  const projectId = 'project123';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('should select the service provided by initialServiceName', () => {
    const { result } = renderHook(() =>
      useServiceSelection({
        projectId,
        services: mockServices,
        initialServiceName: 'service2',
      }),
    );

    expect(result.current.selectedService).toBe('service2');
  });

  it('should select the service from localStorage if initialServiceName is not provided', () => {
    localStorageMock.setItem(
      `lastSelected_monitoring_${projectId}`,
      'service3',
    );

    const { result } = renderHook(() =>
      useServiceSelection({
        projectId,
        services: mockServices,
      }),
    );

    expect(result.current.selectedService).toBe('service3');
  });

  it('should select the first service if initialServiceName is not provided and nothing is in localStorage', () => {
    const { result } = renderHook(() =>
      useServiceSelection({
        projectId,
        services: mockServices,
      }),
    );

    expect(result.current.selectedService).toBe('service1');
  });

  it('should select the first service if initialServiceName is not found in services', () => {
    const { result } = renderHook(() =>
      useServiceSelection({
        projectId,
        services: mockServices,
        initialServiceName: 'nonexistent',
      }),
    );

    expect(result.current.selectedService).toBe('service1');
  });

  it('should save the selected service to localStorage when it changes', () => {
    const { result } = renderHook(() =>
      useServiceSelection({
        projectId,
        services: mockServices,
      }),
    );

    act(() => {
      result.current.setSelectedService('service2');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `lastSelected_monitoring_${projectId}`,
      'service2',
    );
    expect(result.current.selectedService).toBe('service2');
  });

  it('should use custom storageKey if provided', () => {
    const customKey = 'customKey';

    const { result } = renderHook(() =>
      useServiceSelection({
        projectId,
        services: mockServices,
        storageKey: customKey,
      }),
    );

    act(() => {
      result.current.setSelectedService('service2');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      `lastSelected_${customKey}_${projectId}`,
      'service2',
    );
  });

  it('should handle empty services array', () => {
    const { result } = renderHook(() =>
      useServiceSelection({
        projectId,
        services: [],
      }),
    );

    expect(result.current.selectedService).toBeNull();
  });
});
