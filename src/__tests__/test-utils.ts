import { vi } from 'vitest';
import { Service } from '@/types';

/**
 * Helper function to create mock Service objects with required fields
 * to prevent TypeScript errors in tests
 */
export function createMockService(overrides: Partial<Service> = {}): Service {
  return {
    name: 'Mock Service',
    port: 8080,
    status: 'Running',
    health: 'Healthy',
    uptime: '1d 2h 30m',
    version: '1.0.0',
    ...overrides,
  };
}

/**
 * Helper function to create a mock function that returns the provided value
 */
export function mockReturnValue<T>(value: T) {
  return vi.fn().mockReturnValue(value);
}

/**
 * Helper function to mock a module
 */
export function mockModule(
  modulePath: string,
  mockImplementation: Record<string, unknown>,
) {
  vi.mock(modulePath, () => mockImplementation);
}
