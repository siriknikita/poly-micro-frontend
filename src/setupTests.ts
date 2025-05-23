import { vi } from 'vitest';
import React from 'react';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard' }),
    BrowserRouter: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

// Mock GuidanceContext
vi.mock('@/context/GuidanceContext', async () => {
  const actual = await vi.importActual('@/context/GuidanceContext');
  return {
    ...actual,
    useGuidance: () => ({
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
    }),
    GuidanceProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
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
