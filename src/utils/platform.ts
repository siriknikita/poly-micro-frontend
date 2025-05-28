/**
 * Platform detection utilities
 *
 * This file provides utilities for detecting the platform environment
 * and handling conditional imports for Tauri vs Web environments.
 */

// Check if we're in a Tauri environment
export const isTauriEnvironment = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'object' === typeof (window as any).__TAURI__
  );
};

// Get platform info (only works in Tauri)
export const getPlatformInfo = async (): Promise<string | null> => {
  if (!isTauriEnvironment()) {
    return null;
  }

  try {
    // Only import Tauri modules if we're in a Tauri environment
    if (isTauriEnvironment()) {
      // This import is wrapped in a dynamic import and try/catch to prevent
      // build errors in non-Tauri environments like Docker
      const os = await import('@tauri-apps/api/os').catch(() => null);
      if (os && os.type) {
        return await os.type();
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to get platform info:', error);
    return null;
  }
};

// Get environment name for logging
export const getEnvironmentName = (): string => {
  return isTauriEnvironment() ? 'Tauri' : 'Browser';
};
