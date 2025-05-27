import { CLASSES_BY_SEVERITY, SERVICE_STATUS_CLASSES } from '@/helpers/constants';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

function StatusBadge({ status, className = '' }: StatusBadgeProps): JSX.Element {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  // Check if the status is a severity level or a service status
  let styleClass = '';
  // For display purposes, potentially convert to uppercase
  let displayStatus = status;

  // First try to match with severity levels (lowercase)
  if (CLASSES_BY_SEVERITY[status.toLowerCase() as keyof typeof CLASSES_BY_SEVERITY]) {
    styleClass = CLASSES_BY_SEVERITY[status.toLowerCase() as keyof typeof CLASSES_BY_SEVERITY];
    // For severity values, display in uppercase
    displayStatus = status.toUpperCase();
  }
  // Then try to match with service statuses (Running, Healthy, etc.)
  else if (SERVICE_STATUS_CLASSES[status as keyof typeof SERVICE_STATUS_CLASSES]) {
    styleClass = SERVICE_STATUS_CLASSES[status as keyof typeof SERVICE_STATUS_CLASSES];
  }
  // For case-insensitive matching with service statuses
  else {
    // Try to find a case-insensitive match in service statuses
    const statusKey = Object.keys(SERVICE_STATUS_CLASSES).find(
      (key) => key.toLowerCase() === status.toLowerCase(),
    );

    if (statusKey) {
      styleClass = SERVICE_STATUS_CLASSES[statusKey as keyof typeof SERVICE_STATUS_CLASSES];
    } else {
      // Default styling if no match is found
      styleClass = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  }

  return (
    <span
      data-testid={`status-badge-${status.toLowerCase()}`}
      className={`${baseClasses} ${styleClass} ${className}`}
    >
      {displayStatus}
    </span>
  );
}

export default StatusBadge;
