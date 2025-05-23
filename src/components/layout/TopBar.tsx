import React from 'react';
import { LogOut } from 'lucide-react';
import { ProjectSelector } from '../shared/selectors/ProjectSelector';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from '../shared/Logo';
import { Project } from '@/types';
import { useProjectManagement } from '../monitoring/hooks/useProjectManagement';

interface TopBarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onLogout: () => void;
  activeTab?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  darkMode,
  setDarkMode,
  selectedProject,
  onSelectProject,
  onLogout,
  activeTab = '',
}) => {
  // Use the hook to get projects data from the API
  const { projects, loading } = useProjectManagement(activeTab);
  return (
    <nav className="w-full h-16 bg-white dark:bg-gray-800 border-b border-white dark:border-gray-700">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Logo />
            <div className="w-64">
              <ProjectSelector
                projects={projects}
                selectedProject={selectedProject}
                onSelectProject={onSelectProject}
                loading={loading}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
