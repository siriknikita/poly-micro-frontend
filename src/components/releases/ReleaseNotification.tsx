import React from 'react';
import { Bell } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import { useRelease } from '@/hooks/useRelease';

const ReleaseNotification: React.FC = () => {
  const { hasUnacknowledgedRelease, openReleaseModal, latestRelease } = useRelease();
  const { darkMode } = useTheme();

  if (!hasUnacknowledgedRelease || !latestRelease) return null;

  return (
    <button
      onClick={openReleaseModal}
      className={`fixed bottom-4 right-4 ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2 group z-40`}
      aria-label="View new release"
    >
      <Bell size={20} />
      <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        New in v{latestRelease.version}
      </div>
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        1
      </span>
    </button>
  );
};

export default ReleaseNotification;
