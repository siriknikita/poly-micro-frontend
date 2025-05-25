import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  // LayoutDashboard,
  Activity,
  // GitBranch, // Removed unused import
  TestTube2,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { Tab } from '@/types';
import { useGuidance, OnboardingStep } from '@/context/GuidanceContext';
import { GuidanceTooltip } from '@/components/guidance';

const tabs: Tab[] = [
  // {
  //   id: 'dashboard',
  //   name: 'Dashboard',
  //   icon: LayoutDashboard,
  // },
  {
    id: 'monitoring',
    name: 'Microservices',
    icon: Activity,
  },
  // CI/CD Pipeline tab hidden as requested
  // {
  //   id: 'cicd',
  //   name: 'CI/CD Pipeline',
  //   icon: GitBranch,
  // },
  {
    id: 'testing',
    name: 'Automated Testing',
    icon: TestTube2,
  },
  {
    id: 'help',
    name: 'Help',
    icon: HelpCircle,
  },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
    businessName?: string;
    username?: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, user }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showGuidance } = useGuidance();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    const handleScroll = () => {
      setShowUserMenu(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700 h-16">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 mt-1"
        >
          {isExpanded ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex-1 p-4">
        <GuidanceTooltip
          step={OnboardingStep.SIDEBAR}
          title="Navigation Sidebar"
          description="Use the sidebar to navigate between different sections of the application: Microservices and Automated Testing."
          position="right"
          className="space-y-4 sidebar-tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  // Navigate to the appropriate route
                  navigate(`/${tab.id === 'dashboard' ? 'dashboard' : tab.id}`);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <Icon className="h-6 w-6 flex-shrink-0" />
                {isExpanded && <span className="font-medium">{tab.name}</span>}
              </button>
            );
          })}
        </GuidanceTooltip>
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700" ref={menuRef}>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <User className="h-6 w-6 flex-shrink-0" />
            {isExpanded && (
              <div className="flex-1 text-left">
                <p className="font-medium truncate">{user.businessName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.username}</p>
              </div>
            )}
          </button>

          {showUserMenu && isExpanded && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <button className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  showGuidance();
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <BookOpen className="h-5 w-5" />
                <span>Show Guide</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
