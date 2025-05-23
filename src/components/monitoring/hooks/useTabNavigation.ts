import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Map URL paths to tab names
const PATH_TO_TAB = {
  '/dashboard': 'dashboard',
  '/monitoring': 'monitoring',
  '/cicd': 'cicd',
  '/testing': 'testing',
};

/**
 * Custom hook for handling tab navigation in the dashboard
 * Manages active tab state and synchronizes it with the URL
 */
export function useTabNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we need to force the testing tab (for guidance navigation)
  useEffect(() => {
    const forceTestingTab = sessionStorage.getItem('forceTestingTab');
    if (forceTestingTab === 'true') {
      console.log('Forcing testing tab from sessionStorage flag');
      // Clear the flag so it doesn't keep redirecting
      sessionStorage.removeItem('forceTestingTab');
      // Set active tab to testing and update state without navigation
      setActiveTab('testing');
      // Use navigate with replace: true to avoid breaking the history stack
      // and preserve the authentication state
      navigate('/testing', { replace: true });
    }
  }, [navigate]);

  // Determine active tab from URL path
  const [activeTab, setActiveTab] = useState(() => {
    // Check if we need to force the testing tab
    const forceTestingTab = sessionStorage.getItem('forceTestingTab');
    if (forceTestingTab === 'true') {
      return 'testing';
    }
    return PATH_TO_TAB[location.pathname as keyof typeof PATH_TO_TAB] || 'dashboard';
  });

  // Update URL when tab changes
  useEffect(() => {
    const tabPath =
      Object.entries(PATH_TO_TAB).find(([, tab]) => tab === activeTab)?.[0] || '/dashboard';
    if (location.pathname !== tabPath) {
      // Use replace: true to avoid breaking the history stack and preserve auth state
      navigate(tabPath, { replace: true });
    }
  }, [activeTab, navigate, location.pathname]);

  return {
    activeTab,
    setActiveTab,
    pathToTab: PATH_TO_TAB,
  };
}
