import React, { memo } from 'react';
import { METRICS_SELECTOR } from '../constants';

interface MetricsToggleButtonProps {
  selectedCount: number;
  onClick: () => void;
  isOpen: boolean;
}

/**
 * Button component for toggling the metrics dropdown
 */
export const MetricsToggleButton: React.FC<MetricsToggleButtonProps> = memo(
  ({ selectedCount, onClick, isOpen }) => {
    const buttonText =
      selectedCount > 0
        ? METRICS_SELECTOR.BUTTON_TEXT.WITH_SELECTION(selectedCount)
        : METRICS_SELECTOR.BUTTON_TEXT.NO_SELECTION;

    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-between w-48 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        data-testid="metrics-selector-button"
      >
        <span className="truncate">{buttonText}</span>
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  },
);

MetricsToggleButton.displayName = 'MetricsToggleButton';
