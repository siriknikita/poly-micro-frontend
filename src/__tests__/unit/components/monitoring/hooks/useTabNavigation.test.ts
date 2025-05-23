import { renderHook, act } from '@testing-library/react';
import { useTabNavigation } from '@/components/monitoring/hooks/useTabNavigation';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

describe('useTabNavigation', () => {
  let mockLocation = { pathname: '/dashboard' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocation.mockReturnValue(mockLocation);
  });

  it('should initialize with the correct active tab based on URL path', () => {
    mockLocation = { pathname: '/monitoring' };
    mockUseLocation.mockReturnValue(mockLocation);

    const { result } = renderHook(() => useTabNavigation());

    expect(result.current.activeTab).toBe('monitoring');
  });

  it('should default to dashboard when path is not recognized', () => {
    mockLocation = { pathname: '/unknown' };
    mockUseLocation.mockReturnValue(mockLocation);

    const { result } = renderHook(() => useTabNavigation());

    expect(result.current.activeTab).toBe('dashboard');
  });

  it('should navigate to the corresponding path when activeTab changes', () => {
    mockLocation = { pathname: '/dashboard' };
    mockUseLocation.mockReturnValue(mockLocation);

    const { result } = renderHook(() => useTabNavigation());

    act(() => {
      result.current.setActiveTab('monitoring');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/monitoring', { replace: true });
  });

  it('should not navigate if the current path already corresponds to the active tab', () => {
    mockLocation = { pathname: '/monitoring' };
    mockUseLocation.mockReturnValue(mockLocation);

    const { result } = renderHook(() => useTabNavigation());

    act(() => {
      result.current.setActiveTab('monitoring');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should export pathToTab mapping object', () => {
    const { result } = renderHook(() => useTabNavigation());

    expect(result.current.pathToTab).toEqual({
      '/dashboard': 'dashboard',
      '/monitoring': 'monitoring',
      '/cicd': 'cicd',
      '/testing': 'testing',
    });
  });
});
