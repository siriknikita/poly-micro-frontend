import { useState, useEffect, useCallback } from 'react';
import { User, db } from '@/db/db';

// Authentication state key in localStorage
const AUTH_STATE_KEY = 'currentUser';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem(AUTH_STATE_KEY);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuth();

    // Add event listener to handle storage changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_STATE_KEY) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    try {
      const user = await db.users.where('username').equals(username).first();

      if (user && user.password === password) {
        // Store user in localStorage with consistent key
        localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(user));

        // Update auth state
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Invalid username or password'));
      }
    } catch (error) {
      console.error('Login failed:', error);
      return Promise.reject(new Error('Login failed'));
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id'>): Promise<void> => {
    try {
      const existingUser = await db.users.where('username').equals(userData.username).first();
      if (existingUser) {
        return Promise.reject(new Error('Username already exists'));
      }
      await db.users.add(userData);
      return Promise.resolve();
    } catch (error) {
      console.error('Registration failed:', error);
      return Promise.reject(new Error('Registration failed'));
    }
  }, []);

  const logout = useCallback(() => {
    // Remove user from localStorage
    localStorage.removeItem(AUTH_STATE_KEY);

    // Update auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  // Helper function to refresh auth state from localStorage
  // This can be called manually when needed
  const refreshAuthState = useCallback(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STATE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh auth state:', error);
      return false;
    }
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshAuthState,
  };
}
