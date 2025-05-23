import { memo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { IconButton } from './IconButton';

interface NavigationControlsProps {
  onNavigate: (direction: 'up' | 'down') => void;
  previousItemName: string;
  nextItemName: string;
  showControls: boolean;
}

/**
 * Component for navigation controls
 */
export const NavigationControls = memo<NavigationControlsProps>(
  ({ onNavigate, previousItemName, nextItemName, showControls }) => {
    if (!showControls) return null;

    return (
      <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
        <IconButton
          onClick={() => onNavigate('up')}
          icon={<ChevronUp className="h-5 w-5" />}
          className="bg-white dark:bg-gray-800 shadow-lg"
          title={`Previous: ${previousItemName}`}
          aria-label={`Navigate to previous item: ${previousItemName}`}
        />
        <IconButton
          onClick={() => onNavigate('down')}
          icon={<ChevronDown className="h-5 w-5" />}
          className="bg-white dark:bg-gray-800 shadow-lg"
          title={`Next: ${nextItemName}`}
          aria-label={`Navigate to next item: ${nextItemName}`}
        />
      </div>
    );
  },
);
