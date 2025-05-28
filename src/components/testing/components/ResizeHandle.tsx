import { memo, MouseEvent } from 'react';
import { GripVertical } from 'lucide-react';

interface ResizeHandleProps {
  onResizeStart: (e: MouseEvent) => void;
  className?: string;
}

/**
 * Component for resizing panels
 */
export const ResizeHandle = memo<ResizeHandleProps>(
  ({ onResizeStart, className = '' }) => {
    return (
      <div
        className={`flex items-center cursor-col-resize hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
        onMouseDown={(e) => {
          onResizeStart(e);
          // Prevent default to avoid text selection on initial click
          e.preventDefault();
        }}
        role="separator"
        aria-label="Resize panel"
        aria-orientation="vertical"
        title="Resize panel"
      >
        <GripVertical className="h-6 w-6 text-gray-400" />
      </div>
    );
  },
);
