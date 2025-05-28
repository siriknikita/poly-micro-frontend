import React, { memo } from 'react';
import { MetricItem } from './MetricItem';
import { Metric } from './MetricsSelector';
import { METRICS_SELECTOR } from '../constants';

interface MetricsListProps {
  metrics: Metric[];
  onToggleMetric: (id: string) => void;
  onKeyDown: (e: React.KeyboardEvent, id: string) => void;
}

/**
 * List component for displaying filterable metrics
 */
export const MetricsList: React.FC<MetricsListProps> = memo(
  ({ metrics, onToggleMetric, onKeyDown }) => {
    return (
      <ul
        className="py-1 overflow-auto max-h-60"
        role="listbox"
      >
        {metrics.length > 0 ? (
          metrics.map((metric) => (
            <MetricItem
              key={metric.id}
              metric={metric}
              onToggle={onToggleMetric}
              onKeyDown={onKeyDown}
            />
          ))
        ) : (
          <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            {METRICS_SELECTOR.EMPTY_STATE.NO_METRICS}
          </li>
        )}
      </ul>
    );
  },
);

MetricsList.displayName = 'MetricsList';
