import { useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

/**
 * Hook to provide functionality for refreshing all application data by invalidating React Query cache
 * @returns Object containing refresh function
 */
export const useRefreshCache = () => {
  const queryClient = useQueryClient();
  const toast = useContext(ToastContext);

  /**
   * Invalidates all queries in the React Query cache and refetches data
   */
  const refreshAllData = () => {
    try {
      // Invalidate all queries in the cache
      queryClient.invalidateQueries();
      
      // Show success toast
      if (toast) {
        toast.showSuccess('Application data refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing application data:', error);
      
      // Show error toast
      if (toast) {
        toast.showError('Failed to refresh application data');
      }
    }
  };

  return { refreshAllData };
};

export default useRefreshCache;
