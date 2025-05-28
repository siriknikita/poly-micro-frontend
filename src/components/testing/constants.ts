/**
 * Constants for the testing components
 */

// Chat panel dimensions
export const CHAT_PANEL = {
  MIN_WIDTH: 300,
  MAX_WIDTH: 800,
  DEFAULT_WIDTH: 400,
};

// CSS class names
export const CSS_CLASSES = {
  RESIZE_NO_SELECT: 'resize-no-select',
  DEPTH_STYLES: {
    0: 'bg-white dark:bg-gray-900',
    1: 'bg-gray-50 dark:bg-gray-800',
    2: 'bg-gray-100 dark:bg-gray-700',
  },
};

// Button variants
export const BUTTON_VARIANTS = {
  PRIMARY:
    'bg-indigo-600 text-white dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600',
  OUTLINE:
    'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
  ACTIVE:
    'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400',
};

// Test item types
export const TEST_ITEM_TYPES = {
  MICROSERVICE: 'microservice',
  FUNCTION: 'function',
  TEST: 'test',
};

// Default prompts
export const DEFAULT_PROMPTS = {
  GENERATE_TEST: (functionName: string | undefined) =>
    `Generate additional test cases for the ${functionName} function to improve coverage and edge cases.`,
};
