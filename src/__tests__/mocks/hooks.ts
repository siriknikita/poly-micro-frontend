import { vi } from 'vitest';
import { mockTestItems } from './mockData';

// Mock implementation of useTestItems hook
import { TestItem } from '@/types';

export const mockUseTestItems = (
  _tests: TestItem[],
  _projectId: string,
  _microserviceId: string,
) => ({
  testItems: mockTestItems,
  isLoading: false,
  error: null,
  expandedItems: { test1: true, test2: false },
  toggleExpand: vi.fn(),
  expandAll: vi.fn(),
  collapseAll: vi.fn(),
  showResults: true,
  toggleResultsVisibility: vi.fn(),
  currentMicroserviceId: _microserviceId,
  runTest: vi.fn(),
  viewTestOutput: vi.fn(),
  runningTests: {},
  isOutputModalOpen: false,
  selectedTestId: null,
  closeOutputModal: vi.fn(),
  setRunningTests: vi.fn(),
});

// Mock implementation for loading state
export const mockUseTestItemsLoading = () => ({
  testItems: [],
  isLoading: true,
  error: null,
  expandedItems: {},
  toggleExpand: vi.fn(),
  expandAll: vi.fn(),
  collapseAll: vi.fn(),
  showResults: true,
  toggleResultsVisibility: vi.fn(),
  currentMicroserviceId: 'ms1',
  runTest: vi.fn(),
  viewTestOutput: vi.fn(),
  runningTests: {},
  isOutputModalOpen: false,
  selectedTestId: null,
  closeOutputModal: vi.fn(),
  setRunningTests: vi.fn(),
});

// Mock implementation for error state
export const mockUseTestItemsError = () => ({
  testItems: [],
  isLoading: false,
  error: 'Failed to fetch test items',
  expandedItems: {},
  toggleExpand: vi.fn(),
  expandAll: vi.fn(),
  collapseAll: vi.fn(),
  showResults: true,
  toggleResultsVisibility: vi.fn(),
  currentMicroserviceId: 'ms1',
  runTest: vi.fn(),
  viewTestOutput: vi.fn(),
  runningTests: {},
  isOutputModalOpen: false,
  selectedTestId: null,
  closeOutputModal: vi.fn(),
  setRunningTests: vi.fn(),
});

// Mock implementation for output modal
export const mockUseTestItemsWithOutputModal = () => ({
  testItems: mockTestItems,
  isLoading: false,
  error: null,
  expandedItems: { test1: true },
  toggleExpand: vi.fn(),
  expandAll: vi.fn(),
  collapseAll: vi.fn(),
  showResults: true,
  toggleResultsVisibility: vi.fn(),
  currentMicroserviceId: 'ms1',
  runTest: vi.fn(),
  viewTestOutput: vi.fn(),
  runningTests: {},
  isOutputModalOpen: true,
  selectedTestId: 'test1',
  closeOutputModal: vi.fn(),
  setRunningTests: vi.fn(),
});
