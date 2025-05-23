import { renderHook, act } from '@testing-library/react';
import { useAuthManagement } from '@/components/monitoring/hooks/useAuthManagement';
import { useAuth } from '@/components/auth/hooks/useAuth';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import React from 'react';

// Create mock functions
const navigateMock = vi.fn();
const mockLogout = vi.fn();
const mockRefreshAuthState = vi.fn();

// Import User type from db
import { User } from '@/db/db';

// Create a wrapper component with our mocks
function createWrapper(mockUser: User | null) {
  // Mock the useAuth hook
  vi.mocked(useAuth).mockReturnValue({
    user: mockUser,
    isAuthenticated: !!mockUser,
    isLoading: false,
    login: vi.fn(),
    logout: mockLogout,
    register: vi.fn(),
    refreshAuthState: mockRefreshAuthState,
  });

  // Create a wrapper component
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(React.Fragment, null, children);
  };
}

// Mock the hooks we need
vi.mock('@/components/auth/hooks/useAuth');
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

describe('useAuthManagement', () => {
  const mockUser: User = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    businessName: 'Test Business',
    password: 'password123',
    hasCompletedOnboarding: true,
  };
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  };

  // Save the original localStorage
  const originalLocalStorage = window.localStorage;

  // Setup and teardown
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    // Reset mocks
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
  });

  it('should retrieve user data from localStorage', () => {
    const wrapper = createWrapper(mockUser);

    const { result } = renderHook(() => useAuthManagement(), { wrapper });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should return null if user not in localStorage', () => {
    const wrapper = createWrapper(null);

    const { result } = renderHook(() => useAuthManagement(), { wrapper });

    expect(result.current.user).toBeNull();
  });

  it('should handle logout correctly', () => {
    const wrapper = createWrapper(mockUser);

    const { result } = renderHook(() => useAuthManagement(), { wrapper });

    // Call the logout function
    act(() => {
      result.current.handleLogout();
    });

    // Verify that the logout function from useAuth was called
    expect(mockLogout).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  it('should get the last selected service', () => {
    const wrapper = createWrapper(mockUser);

    const projectId = 'project1';
    const tabName = 'monitoring';
    const serviceId = 'service1';
    const expectedKey = `lastSelected_${tabName}_${projectId}`;

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === expectedKey) {
        return serviceId;
      }
      return null;
    });

    const { result } = renderHook(() => useAuthManagement(), { wrapper });

    const lastSelected = result.current.getLastSelectedService(projectId, tabName);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(expectedKey);
    expect(lastSelected).toBe(serviceId);
  });
});
