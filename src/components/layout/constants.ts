/**
 * Constants for the layout components
 */

// Tab names
export const TABS = {
  DASHBOARD: 'dashboard',
  MONITORING: 'monitoring',
  CICD: 'cicd',
  TESTING: 'testing',
  HELP: 'help',
} as const;

// Tab type
export type TabName = (typeof TABS)[keyof typeof TABS];

// Tabs that should have overflow-auto
export const SCROLLABLE_TABS: TabName[] = [
  TABS.DASHBOARD,
  TABS.MONITORING,
  TABS.HELP,
];

// Tabs that need full width (no max-width constraint)
export const FULL_WIDTH_TABS: TabName[] = [TABS.TESTING, TABS.CICD];
