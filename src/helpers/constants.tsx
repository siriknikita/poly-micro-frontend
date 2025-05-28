import {
  Timer,
  Terminal,
  GitBranch,
  XCircle,
  Bot,
  RotateCw,
} from 'lucide-react';

export const AVAILABLE_BLOCKS_MAP = {
  'Timer': Timer,
  'Command Execution': Terminal,
  'Conditional Branch': GitBranch,
  'Error Handler': XCircle,
  'AI Assistant': Bot,
  'While Loop': RotateCw,
};

// Constants for logs table

export const LOGS_TABLE_HEADERS = [
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'service_id', label: 'Service' },
  { key: 'severity', label: 'Severity' },
  { key: 'message', label: 'Message' },
  { key: 'source', label: 'Source' },
];

export const CLASSES_BY_SEVERITY = {
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  warn: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  debug: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  info: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

// Text-only color classes for severity levels - used in dropdown
export const TEXT_COLORS_BY_SEVERITY = {
  error: 'text-red-800 dark:text-red-300',
  warn: 'text-yellow-800 dark:text-yellow-300',
  debug: 'text-gray-800 dark:text-gray-300',
  info: 'text-green-800 dark:text-green-300',
  All: 'text-gray-700 dark:text-gray-200',
};

export const SEVERITY_LEVELS = ['debug', 'info', 'warn', 'error'];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export const DEFAULT_ITEMS_PER_PAGE = 10;

// Service status badge styling
export const SERVICE_STATUS_CLASSES = {
  // Success states
  Running: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Healthy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',

  // Warning states
  Warning:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Degraded:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Unstable:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',

  // Error states
  Error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  Critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  Down: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  Offline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  Failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',

  // Info/default state
  Unknown: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};
