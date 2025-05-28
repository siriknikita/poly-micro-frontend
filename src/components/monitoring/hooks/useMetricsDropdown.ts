import { useState, useRef, useEffect, useCallback } from 'react';
import { Metric } from '../shared/MetricsSelector';

interface UseMetricsDropdownProps {
  metrics: Metric[];
  onMetricsChange: (selectedMetricIds: string[]) => void;
}

/**
 * Custom hook to manage metrics dropdown state and functionality
 */
export const useMetricsDropdown = ({
  metrics: initialMetrics,
  onMetricsChange,
}: UseMetricsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [metrics, setMetrics] = useState<Metric[]>(initialMetrics);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update local metrics when props change
  useEffect(() => {
    setMetrics(initialMetrics);
  }, [initialMetrics]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setSearchTerm('');
    }
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleMetric = useCallback(
    (id: string) => {
      setMetrics((prevMetrics) => {
        const updatedMetrics = prevMetrics.map((metric) =>
          metric.id === id ? { ...metric, selected: !metric.selected } : metric,
        );

        // Notify parent component of changes
        const selectedMetricIds = updatedMetrics
          .filter((metric) => metric.selected)
          .map((metric) => metric.id);

        onMetricsChange(selectedMetricIds);

        return updatedMetrics;
      });
    },
    [onMetricsChange],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, metricId?: string) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (e.key === 'Enter') {
        if (metricId) {
          toggleMetric(metricId);
        } else {
          const filteredMetrics = metrics.filter((metric) =>
            metric.name.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          if (filteredMetrics.length === 1) {
            toggleMetric(filteredMetrics[0].id);
          }
        }
      }
    },
    [metrics, searchTerm, toggleMetric],
  );

  const filteredMetrics = metrics.filter((metric) =>
    metric.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedCount = metrics.filter((metric) => metric.selected).length;

  return {
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
  };
};
