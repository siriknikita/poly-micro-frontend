import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/utils/api';
import { isTauriEnvironment, getPlatformInfo, getEnvironmentName } from '@/utils/platform';


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
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const storedToken = localStorage.getItem('token');
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            token: storedToken,
          });
        } else {
          console.log('No user found in localStorage');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            token: null,
          });
        }
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
      console.log('Attempting login with:', { username, password });
      
      // Log environment info for debugging
      const environmentName = getEnvironmentName();
      console.log(`Running in ${environmentName} environment`);
      
      // Get platform info if in Tauri environment
      if (isTauriEnvironment()) {
        const platformInfo = await getPlatformInfo();
        if (platformInfo) {
          console.log('Platform:', platformInfo);
        }
      }
      
      // Send login request using our API utility
      const response = await authApi.login(username, password);
      console.log('Login response:', response);
      
      const { access_token, user } = response.data;
      
      console.log('Login successful, storing user data');
      
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
      
      console.log('Auth state updated manually', newAuthState);
      
      // Return success immediately without waiting for state update
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return Promise.reject(new Error('Invalid username or password'));
    }
  }, []);

  const register = useCallback(async (userData: { username: string; email: string; password: string; full_name?: string }): Promise<void> => {
    try {
      console.log('Attempting registration with:', { username: userData.username, email: userData.email });
      console.log('API URL being used:', authApi.getApiUrl());
      
      // Send registration request using our API utility
      await authApi.register(userData);
      console.log('Registration successful');
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

    console.log('Logging out');

    // Update auth state
    setAuthState((prev) => {
      console.log('Updating auth state in logout, prev', prev);
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
      console.log('Refreshing auth state');
      
      if (storedUser && storedToken) {
        console.log('Found user and token in localStorage');
        try {
          // Validate token by fetching user profile using our API utility
          const response = await authApi.getCurrentUser();
          if (!response.data) {
            console.log('User profile not found');
          } else {
          console.log('User profile fetched successfully');
          }
          
          const user = response.data;
          
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
          // If token is invalid, logout
          console.error('Token validation failed:', err);
          logout();
          return false;
        }
      }
      console.log('No user and token found in localStorage');
      return false;
    } catch (error) {
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
