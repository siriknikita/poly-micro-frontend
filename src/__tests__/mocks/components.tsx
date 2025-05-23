import React from 'react';

// Mock TestItemComponent
export const MockTestItemComponent = ({
  item,
  isExpanded,
}: {
  item: { id: string; name: string; status?: string };
  isExpanded: boolean;
}) => (
  <div data-testid={`test-item-${item.id}`}>
    {item.name}
    {isExpanded && (
      <div>
        <div>description</div>
        <button>Run Test</button>
        <button>View Output</button>
        <div
          data-testid="test-status-indicator"
          className={`status-${item.status || 'unknown'}`}
        ></div>
      </div>
    )}
  </div>
);

// Mock IconButton
export const MockIconButton = ({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) => (
  <button onClick={onClick} title={title}>
    {children}
  </button>
);

// Mock TestOutputModal
export const MockTestOutputModal = () => <div data-testid="test-output-modal"></div>;
