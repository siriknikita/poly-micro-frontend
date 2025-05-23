import React, { memo } from 'react';
import { Search } from 'lucide-react';
import { METRICS_SELECTOR } from '../constants';

interface MetricsSearchProps {
  searchTerm: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

/**
 * Search input component for filtering metrics
 */
export const MetricsSearch: React.FC<MetricsSearchProps> = memo(
  ({ searchTerm, onChange, onKeyDown, inputRef }) => {
    return (
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full py-2 pl-8 pr-3 text-sm bg-gray-50 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={METRICS_SELECTOR.SEARCH.PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            data-testid="metrics-search-input"
          />
        </div>
      </div>
    );
  },
);

MetricsSearch.displayName = 'MetricsSearch';
