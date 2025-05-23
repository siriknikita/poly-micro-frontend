/**
 * Constants related to the metrics selector component
 */

export const METRICS_SELECTOR = {
  BUTTON_TEXT: {
    NO_SELECTION: 'Select metrics',
    WITH_SELECTION: (count: number) => `${count} metric${count !== 1 ? 's' : ''} selected`,
  },
  SEARCH: {
    PLACEHOLDER: 'Search metrics...',
  },
  EMPTY_STATE: {
    NO_METRICS: 'No metrics found',
  },
};
