import React from 'react';
import { MonitoringDashboard } from '../monitoring/MonitoringDashboard';
import { AutomatedTesting } from '../testing/AutomatedTesting';
import { CICDPipeline } from '../pipelining/CICDPipeline';
import { HelpPage } from '../help/HelpPage';
import { Project } from '@/types';
import { TABS, TabName, SCROLLABLE_TABS, FULL_WIDTH_TABS } from './constants';

interface MainContentProps {
  activeTab: TabName;
  selectedProject: Project | null;
  getLastSelectedService: (projectId: string, tabName: string) => string | null;
}

/**
 * MainContent component
 * Responsible for rendering the appropriate content based on the active tab
 */
export const MainContent: React.FC<MainContentProps> = ({
  activeTab,
  selectedProject,
  getLastSelectedService,
}) => {
  // Determine CSS classes based on active tab
  const isScrollable = SCROLLABLE_TABS.includes(activeTab);
  const isFullWidth = selectedProject && FULL_WIDTH_TABS.includes(activeTab);

  // Main container classes
  const mainClasses = `flex-1 ${isScrollable ? 'overflow-auto' : 'overflow-hidden'}`;

  // Content container classes
  const contentClasses = `
    ${isFullWidth ? 'mx-auto' : 'max-w-7xl mx-auto'}
    ${isScrollable ? 'pb-8' : ''}
  `.trim();

  // Render welcome message if no project is selected
  if (!selectedProject && activeTab !== TABS.HELP) {
    return (
      <main className={mainClasses}>
        <div className={contentClasses}>
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Welcome to your dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please select a project to get started
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Render help page
  if (activeTab === TABS.HELP) {
    return (
      <main className={mainClasses}>
        <div className={contentClasses}>
          <HelpPage />
        </div>
      </main>
    );
  }

  // Render content based on active tab
  return (
    <main className={mainClasses}>
      <div className={contentClasses}>
        {selectedProject && (
          <>
            {activeTab === TABS.DASHBOARD && (
              <MonitoringDashboard
                selectedProjectId={selectedProject.id}
                initialServiceName={getLastSelectedService(
                  selectedProject.id,
                  TABS.DASHBOARD,
                )}
              />
            )}
            {activeTab === TABS.MONITORING && (
              <MonitoringDashboard
                selectedProjectId={selectedProject.id}
                initialServiceName={getLastSelectedService(
                  selectedProject.id,
                  TABS.MONITORING,
                )}
              />
            )}
            {activeTab === TABS.CICD && (
              <CICDPipeline
                selectedProjectId={selectedProject.id}
                initialServiceName={getLastSelectedService(
                  selectedProject.id,
                  TABS.CICD,
                )}
              />
            )}
            {activeTab === TABS.TESTING && (
              <AutomatedTesting key={`testing-${selectedProject.id}`} />
            )}
          </>
        )}
      </div>
    </main>
  );
};
