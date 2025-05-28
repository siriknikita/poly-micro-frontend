import React from 'react';
import { Boxes } from 'lucide-react';
import { LANDING_PAGE_URL } from '@/config';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  linkEnabled?: boolean;
}

// Helper function to get the appropriate size classes
const getSizeClasses = (size: 'sm' | 'md' | 'lg'): string => {
  switch (size) {
    case 'sm':
      return 'w-8 h-8';
    case 'lg':
      return 'w-16 h-16';
    case 'md':
    default:
      return 'w-12 h-12';
  }
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  linkEnabled = true,
}) => {
  const logoContent = (
    <>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
      <Boxes
        className={`relative ${getSizeClasses(size)} text-blue-400 transform group-hover:scale-110 transition duration-500`}
      />
    </>
  );

  if (linkEnabled) {
    return (
      <a
        href={LANDING_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative group ${className}`}
      >
        {logoContent}
      </a>
    );
  }

  return <div className={`relative group ${className}`}>{logoContent}</div>;
};
