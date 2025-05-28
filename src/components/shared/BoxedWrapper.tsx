import React from 'react';

interface BoxedWrapperProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  marginBottom?: number;
}

const BoxedWrapper: React.FC<BoxedWrapperProps> = ({
  children,
  style,
  className = '',
  marginBottom = 6,
}) => {
  return (
    <div
      style={style}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-${marginBottom} ${className}`}
      data-testId="boxed-wrapper"
    >
      {children}
    </div>
  );
};

export default BoxedWrapper;
