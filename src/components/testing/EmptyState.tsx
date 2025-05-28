import { memo } from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  description?: string;
}

/**
 * Component for displaying an empty state
 */
export const EmptyState = memo<EmptyStateProps>(
  ({
    message = 'No logs found for this microservice',
    description = 'Try triggering a pipeline to generate logs.',
  }) => {
    return (
      <div
        id="empty-state-container"
        className="flex flex-col items-center justify-center h-full text-center p-8"
        data-testid="empty-state-container"
        role="status"
        aria-live="polite"
      >
        <AlertCircle
          className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4"
          data-testid="empty-state-icon"
        />
        <h3
          className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2"
          data-testid="empty-state-message"
        >
          {message}
        </h3>
        <p
          className="text-gray-500 dark:text-gray-400"
          data-testid="empty-state-description"
        >
          {description}
        </p>
      </div>
    );
  },
);
