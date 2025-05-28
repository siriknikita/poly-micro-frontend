import { useNavigate } from 'react-router-dom';
import { useEffect, memo } from 'react';
import { useTheme } from '@/hooks';

import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MainContent } from './MainContent';
import { TABS, TabName } from './constants';

// Import custom hooks
import {
  useTabNavigation,
  useProjectManagement,
  useAuthManagement,
} from '../monitoring/hooks';

/**
 * AppLayout component
 * Main layout component that handles the overall application structure,
 * navigation, authentication, and routing
 */
export const AppLayout = memo(function AppLayout() {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTheme();

  // Use custom hooks to manage different aspects of the application
  const { activeTab, setActiveTab } = useTabNavigation();
  const { selectedProject, handleSelectProject } =
    useProjectManagement(activeTab);
  const { user, handleLogout, getLastSelectedService, refreshAuthState } =
    useAuthManagement();

  // Check for force testing tab flag from guidance navigation
  useEffect(() => {
    const forceTestingTab = sessionStorage.getItem('forceTestingTab');
    if (forceTestingTab === 'true') {
      console.log(
        'AppLayout detected forceTestingTab flag, setting active tab to testing',
      );
      setActiveTab(TABS.TESTING);
      // Clear the flag to prevent infinite redirects
      sessionStorage.removeItem('forceTestingTab');
    }
  }, [setActiveTab]);

  // Ensure authentication state is preserved when navigating
  useEffect(() => {
    // Check URL parameters for guidance navigation
    const urlParams = new URLSearchParams(window.location.search);
    const isGuidanceNavigation = urlParams.get('guidance') === 'true';

    if (isGuidanceNavigation) {
      refreshAuthState();
    }

    // Always refresh auth state when tab changes
    if (activeTab === TABS.TESTING) {
      refreshAuthState();
    }
  }, [activeTab, refreshAuthState]);

  // Handle URL parameters for guidance navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isGuidanceNavigation = urlParams.get('guidance') === 'true';
    const stepParam = urlParams.get('step');

    if (isGuidanceNavigation && stepParam) {
      // Clear URL parameters without page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Authentication check moved to the top level for clarity

  // Redirect to login if no user
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={{
          ...user,
          // Add name property if missing to fix lint error
          name: user?.username || 'User',
        }}
      />

      <div className="flex-1 flex flex-col">
        <TopBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          onLogout={handleLogout}
        />

        <MainContent
          activeTab={activeTab as TabName}
          selectedProject={selectedProject}
          getLastSelectedService={getLastSelectedService}
        />
      </div>
    </div>
  );
});
