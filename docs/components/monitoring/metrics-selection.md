# Metrics Selection Components

## Overview

The metrics selection functionality allows users to customize which metrics are displayed on
monitoring charts. This feature has been refactored to follow SOLID principles with a modular
architecture that emphasizes separation of concerns and reusability.

## Components Structure

```
src/components/monitoring/
├── hooks/
│   ├── useMetricsSelection.ts # Hook for managing metrics selection and persistence
│   ├── useMetricsDropdown.ts  # Hook for managing metrics dropdown UI state
│   └── index.ts               # Export file for hooks
└── shared/
    ├── MetricsSelector.tsx    # Main component for selecting metrics
    ├── MetricsToggleButton.tsx # Button to open/close metrics selection dropdown
    ├── MetricsSearch.tsx      # Search input for filtering metrics
    ├── MetricsList.tsx        # List of available metrics with toggle functionality
    └── index.ts               # Export file for shared components
```

## Component Details

### MetricsSelector

The main component that integrates all metrics selection functionality. It provides a dropdown
interface for selecting which metrics to display on charts.

**Props:**

- `metrics`: Array of metric objects with id, name, and selected properties
- `onMetricsChange`: Callback function when metrics selection changes
- `className`: Optional custom CSS class

**Example Usage:**

```jsx
<MetricsSelector
  metrics={[
    { id: 'load', name: 'CPU Load %', selected: true },
    { id: 'memory', name: 'Memory Usage %', selected: true },
    { id: 'threads', name: 'Active Threads', selected: false },
  ]}
  onMetricsChange={(selectedIds) => console.log('Selected metrics:', selectedIds)}
  className="custom-metrics-selector"
/>
```

### MetricsToggleButton

Button component that shows the count of selected metrics and toggles the dropdown visibility.

**Props:**

- `selectedCount`: Number of selected metrics
- `onClick`: Callback function when button is clicked
- `isOpen`: Boolean indicating if dropdown is open

### MetricsSearch

Search input component for filtering available metrics.

**Props:**

- `searchTerm`: Current search term
- `onChange`: Callback function when search term changes
- `onKeyDown`: Callback function for keyboard events
- `inputRef`: Ref object for the input element

### MetricsList

Component that displays a list of available metrics with toggle functionality.

**Props:**

- `metrics`: Array of filtered metric objects
- `onToggleMetric`: Callback function when a metric is toggled
- `onKeyDown`: Callback function for keyboard events

## Custom Hooks

### useMetricsSelection

This hook manages the state of selected metrics and persists user preferences to localStorage.

**Parameters:**

- `projectId`: Current project ID
- `serviceName`: Current service name
- `defaultMetrics`: Array of default metrics with their initial selection state

**Returns:**

- `metrics`: Current metrics array with updated selection state
- `selectedMetricIds`: Array of selected metric IDs
- `updateMetricSelection`: Function to update the selected metrics

**Example:**

```jsx
const { metrics, selectedMetricIds, updateMetricSelection } = useMetricsSelection({
  projectId: 'project1',
  serviceName: 'service1',
  defaultMetrics: [
    { id: 'load', name: 'CPU Load %', dataKey: 'load', color: '#4f46e5', selected: true },
    { id: 'memory', name: 'Memory Usage %', dataKey: 'memory', color: '#059669', selected: true },
    { id: 'threads', name: 'Active Threads', dataKey: 'threads', color: '#db2777', selected: true },
  ],
});
```

### useMetricsDropdown

This hook manages the dropdown UI state, search functionality, and keyboard navigation for the
MetricsSelector component.

**Parameters:**

- `metrics`: Array of metric objects
- `onMetricsChange`: Callback function when metrics selection changes

**Returns:**

- `isOpen`: Boolean indicating if dropdown is open
- `searchTerm`: Current search term
- `filteredMetrics`: Array of metrics filtered by search term
- `selectedCount`: Number of selected metrics
- `dropdownRef`: Ref object for the dropdown container
- `searchInputRef`: Ref object for the search input
- `toggleDropdown`: Function to toggle dropdown visibility
- `toggleMetric`: Function to toggle a metric's selection state
- `handleSearchChange`: Function to handle search term changes
- `handleKeyDown`: Function to handle keyboard events

## User Preferences Persistence

The metrics selection state is persisted to localStorage using the following structure:

```javascript
{
  "metrics-selection-preferences": {
    "project1": {
      "service1": ["load", "memory"],
      "service2": ["threads"]
    },
    "project2": {
      "service3": ["load", "threads"]
    }
  }
}
```

This allows the application to remember user preferences for each project and service combination,
providing a personalized experience across sessions.

## Accessibility Features

The metrics selection components include several accessibility features:

1. **Keyboard Navigation**: Users can navigate the dropdown using Tab, Enter, and Escape keys
2. **Focus Management**: Focus is automatically set to the search input when the dropdown opens
3. **ARIA Attributes**: Appropriate ARIA attributes are used for screen readers
4. **Clickaway Detection**: Dropdown closes when clicking outside, preventing modal traps

## Integration with CPUChart

The MetricsSelector component is integrated with the CPUChart component to allow users to customize
which metrics are displayed on the chart:

```jsx
// Inside CPUChart.tsx
const { metrics, selectedMetricIds, updateMetricSelection } = useMetricsSelection({
  projectId: selectedProjectId,
  serviceName: selectedService,
  defaultMetrics: [
    { id: 'load', name: 'CPU Load %', dataKey: 'load', color: '#4f46e5', selected: true },
    { id: 'memory', name: 'Memory Usage %', dataKey: 'memory', color: '#059669', selected: true },
    { id: 'threads', name: 'Active Threads', dataKey: 'threads', color: '#db2777', selected: true },
  ],
});

return (
  <div className="cpu-chart">
    <ServiceSelector
      services={services}
      selectedService={selectedService}
      onServiceSelect={onServiceSelect}
    />

    {selectedService && data ? (
      <>
        <MetricsSelector metrics={metrics} onMetricsChange={updateMetricSelection} />

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            {metrics
              .filter((metric) => metric.selected)
              .map((metric) => (
                <Line
                  key={metric.id}
                  type="monotone"
                  dataKey={metric.dataKey}
                  stroke={metric.color}
                  name={metric.name}
                />
              ))}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </>
    ) : (
      <div className="placeholder-message">
        {selectedService
          ? 'No metrics available for this service'
          : 'Please select a microservice to view its metrics'}
      </div>
    )}
  </div>
);
```
