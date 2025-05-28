import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTestItems } from '../../../../../components/testing/hooks';
import { mockTestItems } from '../../../../mocks/mockData';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTestItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should initialize with empty expanded items', () => {
    const { result } = renderHook(() =>
      useTestItems(mockTestItems, 'project1', 'ms1'),
    );

    expect(result.current.expandedItems).toEqual({});
  });

  it('should toggle expanded state for a single item', () => {
    const { result } = renderHook(() =>
      useTestItems(mockTestItems, 'project1', 'ms1'),
    );

    act(() => {
      result.current.toggleExpand('func1');
    });

    expect(result.current.expandedItems).toEqual({ func1: true });

    act(() => {
      result.current.toggleExpand('func1');
    });

    expect(result.current.expandedItems).toEqual({ func1: false });
  });

  it('should expand all items when expandAll is called', () => {
    const { result } = renderHook(() =>
      useTestItems(mockTestItems, 'project1', 'ms1'),
    );

    act(() => {
      result.current.expandAll();
    });

    // All items should be expanded
    const expectedExpandedItems: Record<string, boolean> = {};

    // Helper function to recursively add all items and their children to expectedExpandedItems
    // Define a recursive type for test items
    type TestItemWithChildren = {
      id: string;
      children?: TestItemWithChildren[];
    };
    const addAllItems = (items: TestItemWithChildren[]) => {
      items.forEach((item) => {
        expectedExpandedItems[item.id] = true;
        if (item.children && item.children.length > 0) {
          addAllItems(item.children);
        }
      });
    };

    addAllItems(mockTestItems);

    expect(result.current.expandedItems).toEqual(expectedExpandedItems);
  });

  it('should collapse all items when collapseAll is called', () => {
    const { result } = renderHook(() =>
      useTestItems(mockTestItems, 'project1', 'ms1'),
    );

    // First expand all items
    act(() => {
      result.current.expandAll();
    });

    // Then collapse all
    act(() => {
      result.current.collapseAll();
    });

    expect(result.current.expandedItems).toEqual({});
  });

  it('should save expanded state to localStorage', () => {
    const { result } = renderHook(() =>
      useTestItems(mockTestItems, 'project1', 'ms1'),
    );

    act(() => {
      result.current.toggleExpand('func1');
    });

    expect(localStorageMock.setItem).toHaveBeenCalled();

    // The key should include the project ID
    const callArgs = vi.mocked(localStorageMock.setItem).mock.calls[0];
    expect(callArgs[0]).toContain('project1');

    // The value should be a JSON string containing the expanded items
    const savedValue = JSON.parse(callArgs[1]);
    expect(savedValue).toHaveProperty('ms1');
    expect(savedValue.ms1).toEqual({ func1: true });
  });

  it('should handle multiple expanded items correctly', () => {
    const { result } = renderHook(() =>
      useTestItems(mockTestItems, 'project1', 'ms1'),
    );

    act(() => {
      result.current.toggleExpand('func1');
      result.current.toggleExpand('func2');
    });

    expect(result.current.expandedItems).toEqual({ func1: true, func2: true });

    act(() => {
      result.current.toggleExpand('func1');
    });

    expect(result.current.expandedItems).toEqual({ func1: false, func2: true });
  });
});
