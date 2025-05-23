import { afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import React from 'react';
import { User } from '@/db/db';

// Make Vitest's vi available as a global for Jest compatibility
// This allows tests to use jest.mock, jest.fn, etc.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).jest = vi;

// Create a mock user for tests that can be used by individual tests
export const mockUser: User = {
  id: 'test-user',
  username: 'testuser',
  email: 'test@example.com',
  businessName: 'Test Business',
  password: 'password123',
  hasCompletedOnboarding: true,
};

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const navigateMock = vi.fn();

  // Silence React Router warnings by intercepting console.warn
  const originalWarn = console.warn;
  console.warn = function (message, ...args) {
    if (
      message &&
      typeof message === 'string' &&
      message.includes('React Router Future Flag Warning')
    ) {
      return; // Suppress React Router warnings
    }
    originalWarn.call(console, message, ...args);
  };

  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ pathname: '/dashboard' }),
    BrowserRouter: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

// We're not mocking useAuth globally to allow individual tests to mock it as needed

// Mock GuidanceContext
vi.mock('@/context/GuidanceContext', async () => {
  const actual = await vi.importActual('@/context/GuidanceContext');
  const guidanceMock = {
    isGuidanceVisible: false,
    isOnboarding: false,
    showGuidance: vi.fn(),
    hideGuidance: vi.fn(),
    currentStep: 0,
    totalSteps: 11,
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    goToStep: vi.fn(),
    completeGuidance: vi.fn().mockResolvedValue(undefined),
    shouldShowTooltipForStep: vi.fn().mockReturnValue(false),
  };

  return {
    ...actual,
    useGuidance: () => guidanceMock,
    GuidanceProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

// Mock ProjectContext
vi.mock('@/context/ProjectContext', async () => {
  const actual = await vi.importActual('@/context/ProjectContext');
  const projectMock = {
    project: {
      id: 'project1',
      name: 'Test Project',
      microservices: [],
    },
    setProject: vi.fn(),
    loading: false,
    error: null,
  };

  return {
    ...actual,
    ProjectProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useProject: () => projectMock,
  };
});

// Create a React context to mock the ToastContext
const ToastContext = React.createContext({
  showInfo: vi.fn(),
  showSuccess: vi.fn(),
  showError: vi.fn(),
  showWarning: vi.fn(),
});

// Mock ToastContext
vi.mock('@/context/ToastContext', async () => {
  const toastMock = {
    showInfo: vi.fn(),
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showWarning: vi.fn(),
  };

  return {
    ToastContext,
    ToastProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(ToastContext.Provider, { value: toastMock }, children),
    useToast: () => React.useContext(ToastContext),
  };
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock window.matchMedia for GuidanceTooltip
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// MSW server for API mocking
export const server = setupServer(...handlers);

// Setup mock server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
