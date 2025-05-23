import React, { memo } from 'react';
import { Metric } from './MetricsSelector';

interface MetricItemProps {
  metric: Metric;
  onToggle: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
}

/**
 * Individual metric item component with checkbox
 */
export const MetricItem: React.FC<MetricItemProps> = memo(({ metric, onToggle, onKeyDown }) => {
  const handleClick = () => {
    onToggle(metric.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    onKeyDown(e, metric.id);
  };

  // Handle label click without preventing default behavior
  const handleLabelClick = () => {
    // Don't prevent default - this allows the label to trigger the checkbox
    // Just make sure we also call onToggle directly
    onToggle(metric.id);
  };

  return (
    <li
      className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="option"
      aria-selected={metric.selected}
      data-testid={`metric-option-${metric.id}`}
    >
      <div className="flex items-center w-full">
        <input
          type="checkbox"
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:border-gray-600"
          checked={metric.selected}
          onChange={handleClick}
          onClick={(e) => e.stopPropagation()}
          id={`metric-${metric.id}`}
        />
        <label
          htmlFor={`metric-${metric.id}`}
          className="block ml-2 text-sm text-gray-900 dark:text-gray-200 w-full cursor-pointer"
          onClick={handleLabelClick}
        >
          {metric.name}
        </label>
      </div>
    </li>
  );
});

MetricItem.displayName = 'MetricItem';
