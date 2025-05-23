import React, { ReactNode } from 'react';
import { useTheme } from '@hooks/index';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  icon: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, icon }) => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">{icon}</div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="mt-2 flex justify-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
