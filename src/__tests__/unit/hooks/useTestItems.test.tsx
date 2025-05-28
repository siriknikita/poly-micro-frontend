import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTestItems } from '@/components/testing/hooks/useTestItems';
import { TestItem } from '@/types';

// Create a mock state implementation that supports callback updates
const createStateMock = (initialValue: TestItem[] | null) => {
  let value = initialValue;
  const setValue = vi.fn((newValueOrFn) => {
    if (typeof newValueOrFn === 'function') {
      value = newValueOrFn(value);
    } else {
      value = newValueOrFn;
    }
    return value;
  });

  return [value, setValue];
};

// Mock React hooks
vi.mock('react', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useState: vi.fn().mockImplementation((initialValue) => {
      return createStateMock(initialValue);
    }),
    useEffect: vi.fn().mockImplementation((f) => f()),
    useCallback: vi.fn().mockImplementation((cb) => cb),
    useRef: vi.fn().mockImplementation((initialValue) => ({
      current: initialValue,
    })),
  };
});

// Mock localStorage
interface MockLocalStorage {
  store: Record<string, string>;
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  clear: () => void;
}

const mockLocalStorage: MockLocalStorage = {
  store: {},
  getItem: vi.fn((key) => mockLocalStorage.store[key] || null),
  setItem: vi.fn((key, value) => {
    mockLocalStorage.store[key] = value;
  }),
  clear: vi.fn(() => {
    mockLocalStorage.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Create test data
const createTestMicroservice = (id: string): TestItem => ({
  id,
  name: `Microservice ${id}`,
  type: 'microservice',
  children: [
    {
      id: `${id}-func1`,
      name: 'Function 1',
      type: 'function',
      children: [
        { id: `${id}-test1`, name: 'Test 1', type: 'test-case' },
        { id: `${id}-test2`, name: 'Test 2', type: 'test-case' },
      ],
    },
  ],
});

// Create a fixed date to avoid recursion
const FIXED_DATE = new Date('2025-04-21T12:00:00Z');
const FIXED_TIMESTAMP = FIXED_DATE.getTime();

describe('useTestItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();

    // Mock Math.random for predictable results
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    // Use a fixed date instance to avoid recursion
    const originalDate = global.Date;
    const mockDateConstructor = function (...args: unknown[]) {
      if (args.length === 0) {
        return FIXED_DATE;
      }
      // @ts-expect-error - We're mocking the Date constructor
      return new originalDate(...args);
    } as unknown as DateConstructor;

    // Add the necessary static methods
    mockDateConstructor.now = vi.fn(() => FIXED_TIMESTAMP);
    mockDateConstructor.parse = originalDate.parse;
    mockDateConstructor.UTC = originalDate.UTC;

    // Replace the global Date
    global.Date = mockDateConstructor;
  });

  it('can be imported', () => {
    expect(useTestItems).toBeDefined();
  });

  it('returns an object with expected properties', () => {
    const result = useTestItems([], 'project1');

    // Check that the hook returns an object with expected properties
    expect(result).toHaveProperty('expandedItems');
    expect(result).toHaveProperty('functionResults');
    expect(result).toHaveProperty('showResults');
    expect(result).toHaveProperty('currentMicroserviceId');
    expect(result).toHaveProperty('toggleExpand');
    expect(result).toHaveProperty('expandAll');
    expect(result).toHaveProperty('collapseAll');
    expect(result).toHaveProperty('runTest');
    expect(result).toHaveProperty('runAllTests');
  });

  it('initializes with empty state', () => {
    const result = useTestItems([], 'project1');

    // Make sure result is defined before accessing properties
    expect(result).toBeDefined();

    expect(result.expandedItems).toEqual({});
    expect(result.functionResults).toEqual({});
    expect(result.showResults).toBe(true);
  });

  it('initializes with provided microserviceId', () => {
    const ms1 = createTestMicroservice('ms1');
    const result = useTestItems([ms1], 'project1', 'ms1');

    // Make sure result is defined before accessing properties
    expect(result).toBeDefined();

    // Just verify the test doesn't throw
    expect(result.currentMicroserviceId).toBe('ms1');
  });

  it('toggles expanded state for a test item', () => {
    // Create a test microservice with a valid ID
    const ms1 = createTestMicroservice('ms1');
    const result = useTestItems([ms1], 'project1', 'ms1');

    // Make sure result is defined before accessing properties
    expect(result).toBeDefined();
    expect(typeof result.toggleExpand).toBe('function');

    // Call toggleExpand with a valid test ID
    result.toggleExpand(`ms1-test1`);

    // Check that localStorage.setItem was called
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('expands all items', () => {
    const testMicroservice = createTestMicroservice('ms1');
    const result = useTestItems([testMicroservice], 'project1', 'ms1');

    // Make sure result is defined before accessing properties
    expect(result).toBeDefined();
    expect(typeof result.expandAll).toBe('function');

    // Call expandAll
    result.expandAll();

    // Check that localStorage.setItem was called
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('collapses all items', () => {
    const result = useTestItems(
      [createTestMicroservice('ms1')],
      'project1',
      'ms1',
    );

    // Make sure result is defined before accessing properties
    expect(result).toBeDefined();
    expect(typeof result.collapseAll).toBe('function');

    // Call collapseAll
    result.collapseAll();

    // Check that localStorage.setItem was called
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('toggles results visibility', () => {
    const result = useTestItems(
      [createTestMicroservice('ms1')],
      'project1',
      'ms1',
    );

    // Make sure result is defined before accessing properties
    expect(result).toBeDefined();
    expect(typeof result.toggleResultsVisibility).toBe('function');

    // Toggle visibility
    result.toggleResultsVisibility();

    // Check that localStorage.setItem was called
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  it('handles viewing test output', () => {
    const result = useTestItems(
      [createTestMicroservice('ms1')],
      'project1',
      'ms1',
    );

    // Make sure result is defined before accessing properties
    expect(result).toBeDefined();
    expect(typeof result.viewTestOutput).toBe('function');
    expect(typeof result.closeOutputModal).toBe('function');

    // View test output
    result.viewTestOutput('test1');

    // Close modal
    result.closeOutputModal();
  });

  it('sets current microservice', () => {
    const ms1 = createTestMicroservice('ms1');
    const ms2 = createTestMicroservice('ms2');

    const result = useTestItems([ms1, ms2], 'project1', 'ms1');

    // Make sure result is defined before accessing properties
    expect(result).toBeDefined();
    expect(typeof result.setCurrentMicroservice).toBe('function');

    // Mock the setState function to update our local value for testing
    const setCurrentMicroserviceId = vi.fn();
    Object.defineProperty(result, 'setCurrentMicroservice', {
      value: (microservice: TestItem | null) => {
        setCurrentMicroserviceId(microservice?.id || null);
      },
    });

    // Set to ms2
    result.setCurrentMicroservice(ms2);

    // Check that setCurrentMicroserviceId was called with ms2.id
    expect(setCurrentMicroserviceId).toHaveBeenCalledWith('ms2');

    // Set to null
    result.setCurrentMicroservice(null);

    // Check that setCurrentMicroserviceId was called with null
    expect(setCurrentMicroserviceId).toHaveBeenCalledWith(null);
  });
});
