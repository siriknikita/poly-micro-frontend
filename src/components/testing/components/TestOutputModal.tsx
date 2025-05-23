import { memo } from 'react';

interface TestOutputModalProps {
  isOpen?: boolean;
  testId?: string | null;
  output?: string;
  onClose?: () => void;
}

/**
 * Modal component for displaying test output
 */
export const TestOutputModal = memo<TestOutputModalProps>(
  ({ isOpen = false, testId = null, output = '', onClose }) => {
    if (!isOpen || !testId) return null;

    return (
      <div
        data-testid="test-output-modal"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Test Output: {testId}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-4 overflow-auto flex-1">
            <pre className="font-mono text-sm whitespace-pre-wrap bg-gray-100 dark:bg-gray-900 p-4 rounded text-gray-800 dark:text-gray-200">
              {output}
            </pre>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  },
);
