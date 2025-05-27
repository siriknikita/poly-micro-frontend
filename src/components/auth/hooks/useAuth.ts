import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/utils/api';
import { useToast } from '@/context/useToast';

// Authentication state key in localStorage
const AUTH_STATE_KEY = 'currentUser';

// User interface representing the authenticated user
export interface User {
  id?: string;
  username: string;
  email: string;
  full_name?: string;
  disabled?: boolean;
  created_at: string;
  last_login?: string;
}

// Auth API response interface (exported for use in api.ts)
export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export function useAuth() {
  const { showError, showSuccess, showInfo } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem(AUTH_STATE_KEY);
        if (!storedUser) {
          showInfo('No user found in localStorage');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: null,
          });
          return;
        }

        const user = JSON.parse(storedUser);
        const storedToken = localStorage.getItem('token');

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          token: storedToken,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null,
        });
      }
    };

    checkAuth();

    // Add event listener to handle storage changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_STATE_KEY || event.key === 'token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(username, password);
      const { access_token, user } = response.data;
      
      // Store user and token in localStorage
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(user));
      localStorage.setItem('token', access_token);

      // Update auth state synchronously
      const newAuthState = {
        user,
        isAuthenticated: true,
        isLoading: false,
        token: access_token,
      };
      
      // Set the auth state and trigger a forced update
      setAuthState(newAuthState);
      
      // Force a window event to ensure other components pick up the auth change
      window.dispatchEvent(new Event('auth-state-changed'));
      
      return true;
    } catch (error) {
      showError('Failed to login');
      console.error('Failed to login:', error);
      return Promise.reject(new Error('Invalid username or password'));
    }
  }, []);

  const register = useCallback(async (userData: { username: string; email: string; password: string; full_name?: string }): Promise<void> => {
    try {
      await authApi.register(userData);
      showSuccess('Registration successful');

      return Promise.resolve();
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Log detailed error for debugging
      if (error.response) {
        console.error('Error response:', { 
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Handle specific error messages from the backend
        if (error.response.status === 409) {
          return Promise.reject(new Error(error.response.data.detail || 'Username or email already exists'));
        } else {
          return Promise.reject(new Error(`Server error (${error.response.status}): ${JSON.stringify(error.response.data)}`));
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        return Promise.reject(new Error(`Connection error: Cannot reach backend server at ${authApi.getApiUrl()}`));
      } else {
        console.error('Error setting up request:', error.message);
        return Promise.reject(new Error(`Request setup error: ${error.message}`));
      }
    }
  }, []);

  const logout = useCallback(() => {
    // Remove user and token from localStorage
    localStorage.removeItem(AUTH_STATE_KEY);
    localStorage.removeItem('token');

    // Update auth state
    setAuthState(() => {
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      };
    });
  }, []);

  // Helper function to refresh auth state from localStorage and validate token
  const refreshAuthState = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem(AUTH_STATE_KEY);
      const storedToken = localStorage.getItem('token');
      if (!storedUser || !storedToken) {
        return false;
      }
      
      try {
        // Validate token by fetching user profile using our API utility
        const response = await authApi.getCurrentUser();
        if (!response.data) {
          return false;
        }
        
        const user = response.data;
        if (!user) {
          return false;
        }
        
        // Update stored user data
        localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(user));
        
        setAuthState(() => ({
          user,
          isAuthenticated: true,
          isLoading: false,
          token: storedToken,
        }));

        return true;
      } catch (err) {
        showError('Failed to validate token');
        console.error('Failed to validate token:', err);
        logout();
        return false;
      }
    } catch (error) {
      showError('Failed to refresh auth state');
      console.error('Failed to refresh auth state:', error);
      logout();
      return false;
    }
  }, [logout]);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshAuthState,
  };
}
