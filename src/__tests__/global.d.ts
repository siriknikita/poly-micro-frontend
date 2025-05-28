// Type definitions for test files
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  vi,
  expect,
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
} from 'vitest';

// Extend the global namespace to make Jest types available
declare global {
  // Add Jest as a global object that's an alias for Vitest's vi
  const jest: typeof vi;

  // Add test globals
  const describe: typeof globalThis.describe;
  const it: typeof globalThis.it;
  const test: typeof it;
  const expect: typeof globalThis.expect;
  const beforeEach: typeof globalThis.beforeEach;
  const afterEach: typeof globalThis.afterEach;
  const beforeAll: typeof globalThis.beforeAll;
  const afterAll: typeof globalThis.afterAll;

  // Add common Jest testing functions as globals
  namespace NodeJS {
    interface Global {
      jest: typeof vi;
      describe: typeof globalThis.describe;
      it: typeof globalThis.it;
      test: typeof it;
      expect: typeof globalThis.expect;
      beforeEach: typeof globalThis.beforeEach;
      afterEach: typeof globalThis.afterEach;
      beforeAll: typeof globalThis.beforeAll;
      afterAll: typeof globalThis.afterAll;
    }
  }

  // Add Jest's Mock type for use in tests
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Mock<T = any, Y extends any[] = any[]> = vi.Mock<T, Y>;
  }
}

// This export is needed to make TypeScript treat this file as a module
export {};
