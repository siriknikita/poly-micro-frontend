/**
 * eslint-disable react-refresh/only-export-components
 */
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/hooks/useAuth';

/**
 * Custom hook for managing authentication-related functionality
 * Handles user data retrieval and logout
 */
export function useAuthManagement() {
  const navigate = useNavigate();
  const { user, logout, refreshAuthState } = useAuth();

  // Refresh auth state when the component mounts or when the URL changes
  useEffect(() => {
    // This ensures we always have the latest auth state
    refreshAuthState();
  }, [refreshAuthState]);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Get the last selected service for the current tab and project
  const getLastSelectedService = useCallback(
    (projectId: string, tabName: string) => {
      const key = `lastSelected_${tabName}_${projectId}`;
      return localStorage.getItem(key);
    },
    [],
  );

  return {
    user,
    handleLogout,
    getLastSelectedService,
    refreshAuthState,
  };
}
