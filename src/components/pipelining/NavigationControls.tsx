import { memo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Service } from '@/types';
import { IconButton } from './components';

interface NavigationControlsProps {
  onNavigate: (direction: 'up' | 'down') => void;
  currentService: Service;
  services: Service[];
}

export const NavigationControls = memo<NavigationControlsProps>(
  ({ onNavigate, currentService, services }) => {
    const currentIndex = services.findIndex((s) => s.name === currentService.name);

    // Get the previous service name
    const getPreviousServiceName = useCallback(() => {
      return services[(currentIndex - 1 + services.length) % services.length].name;
    }, [currentIndex, services]);

    // Get the next service name
    const getNextServiceName = useCallback(() => {
      return services[(currentIndex + 1) % services.length].name;
    }, [currentIndex, services]);

    return (
      <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
        <IconButton
          onClick={() => onNavigate('up')}
          icon={<ChevronUp className="h-5 w-5" />}
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg"
          title={`Previous: ${getPreviousServiceName()}`}
          aria-label={`Navigate to previous service: ${getPreviousServiceName()}`}
        />
        <IconButton
          onClick={() => onNavigate('down')}
          icon={<ChevronDown className="h-5 w-5" />}
          variant="outline"
          className="bg-white dark:bg-gray-800 shadow-lg"
          title={`Next: ${getNextServiceName()}`}
          aria-label={`Navigate to next service: ${getNextServiceName()}`}
        />
      </div>
    );
  },
);
