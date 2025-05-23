import React, { memo } from 'react';
import { MetricsToggleButton } from './MetricsToggleButton';
import { MetricsSearch } from './MetricsSearch';
import { MetricsList } from './MetricsList';
import { useMetricsDropdown } from '../hooks';

/**
 * Interface for a metric item
 */
export interface Metric {
  id: string;
  name: string;
  selected: boolean;
}

/**
 * Props for the MetricsSelector component
 */
interface MetricsSelectorProps {
  metrics: Metric[];
  onMetricsChange: (selectedMetrics: string[]) => void;
  className?: string;
}

/**
 * Component for selecting and filtering metrics
 * Follows Single Responsibility Principle by delegating specific UI parts to child components
 * and logic to custom hooks
 */
export const MetricsSelector: React.FC<MetricsSelectorProps> = memo(
  ({ metrics, onMetricsChange, className = '' }) => {
    const {
      isOpen,
      searchTerm,
      filteredMetrics,
      selectedCount,
      dropdownRef,
      searchInputRef,
      toggleDropdown,
      toggleMetric,
      handleSearchChange,
      handleKeyDown,
    } = useMetricsDropdown({ metrics, onMetricsChange });

    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <MetricsToggleButton
          selectedCount={selectedCount}
          onClick={toggleDropdown}
          isOpen={isOpen}
        />

        {isOpen && (
          <div className="absolute z-10 w-64 mt-1 bg-white rounded-md shadow-lg dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <MetricsSearch
              searchTerm={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => handleKeyDown(e)}
              inputRef={searchInputRef}
            />

            <MetricsList
              metrics={filteredMetrics}
              onToggleMetric={toggleMetric}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}
      </div>
    );
  },
);

MetricsSelector.displayName = 'MetricsSelector';
