import React from 'react';

interface BoxedWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const BoxedWrapper: React.FC<BoxedWrapperProps> = ({ children, style, className = '' }) => {
  return (
    <div
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 ${className}`}
      data-testId="boxed-wrapper"
    >
      {children}
    </div>
  );
};

export default BoxedWrapper;
