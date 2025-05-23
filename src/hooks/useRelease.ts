import { useContext } from 'react';
import { ReleaseContext } from '../context/ReleaseContext';

/**
 * Hook to access the release context
 * @returns {ReleaseContextType} The release context
 */
export const useRelease = () => {
  const context = useContext(ReleaseContext);
  if (context === undefined) {
    throw new Error('useRelease must be used within a ReleaseProvider');
  }
  return context;
};
