# Monitoring Feature Documentation

## Overview

The Monitoring feature provides real-time observability and performance tracking for microservices.
It allows users to monitor service health, view logs, track resource usage, and receive alerts for
potential issues. The feature has been refactored to follow SOLID principles with a modular
architecture that emphasizes separation of concerns and reusability.

## Components Structure

```
src/components/monitoring/
├── hooks/                     # Custom hooks for monitoring functionality
│   ├── useMetricsSelection.ts # Hook for managing metrics selection and persistence
│   ├── useMetricsDropdown.ts  # Hook for managing metrics dropdown UI state
│   ├── useServiceSelection.ts # Hook for managing service selection
│   ├── useProjectManagement.ts # Hook for managing project selection
│   └── index.ts               # Export file for hooks
├── shared/                    # Shared components used within monitoring
│   ├── ServiceSelector.tsx    # Component for selecting microservices
│   ├── MetricsSelector.tsx    # Component for selecting which metrics to display
│   ├── MetricsToggleButton.tsx # Button to open/close metrics selection dropdown
│   ├── MetricsSearch.tsx      # Search input for filtering metrics
│   ├── MetricsList.tsx        # List of available metrics with toggle functionality
│   └── index.ts               # Export file for shared components
├── LogViewer/                 # Components for viewing and analyzing logs
│   ├── LogViewer.tsx          # Main log viewing component
│   └── TablePagination.tsx    # Pagination component for log tables
├── CPUChart.tsx               # Component for displaying CPU usage charts
├── Dashboard.tsx              # Main application dashboard and layout component
├── MonitoringDashboard.tsx    # Main dashboard for monitoring features
├── ServiceStatus.tsx          # Component for displaying service health status
└── index.ts                   # Export file for monitoring components
```

## Key Components

### CPUChart.tsx

Displays CPU usage metrics for microservices over time using Recharts library.

**Key Features:**

- Real-time CPU usage visualization
- Customizable metrics display (CPU load, memory usage, active threads)
- Service selection via ServiceSelector component
- User preference persistence for selected metrics
- Responsive chart design

**Component Dependencies:**

- `ServiceSelector`: For selecting which microservice to monitor
- `MetricsSelector`: For selecting which metrics to display on the chart
- `useMetricsSelection`: Hook for managing metrics selection state

**Usage Example:**

```jsx
<CPUChart
  data={cpuData}
  selectedService={serviceId}
  services={availableServices}
  onServiceSelect={handleServiceSelect}
  selectedProjectId={projectId}
/>
```

### Shared Components

#### ServiceSelector.tsx

A dropdown component for selecting microservices to monitor.

**Key Features:**

- Displays list of available services with status indicators
- Handles service selection events
- Supports disabled state for unavailable services

#### MetricsSelector.tsx

A comprehensive component for selecting which metrics to display on charts.

**Key Features:**

- Dropdown interface for metric selection
- Search functionality for filtering metrics
- Toggle functionality for enabling/disabling metrics
- Keyboard navigation support for accessibility
- Persistence of user preferences

**Component Dependencies:**

- `MetricsToggleButton`: Button to open/close the dropdown
- `MetricsSearch`: Search input for filtering metrics
- `MetricsList`: List of metrics with toggle functionality
- `useMetricsDropdown`: Hook for managing dropdown state and behavior

**Usage Example:**

```jsx
<MetricsSelector
  metrics={availableMetrics}
  onMetricsChange={handleMetricsChange}
  className="custom-class"
/>
```

## Custom Hooks

### useMetricsSelection

Manages the state of selected metrics and persists user preferences to localStorage.

**Key Features:**

- Loads and saves user preferences per project and service
- Manages the state of available metrics and their selection status
- Handles project and service changes
- Provides error handling for localStorage operations

**Usage Example:**

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

Manages the dropdown UI state, search functionality, and keyboard navigation for the MetricsSelector
component.

**Key Features:**

- Dropdown open/close functionality
- Search filtering of metrics based on user input
- Keyboard navigation support for accessibility
- Toggling of metric selection
- Event listener management for outside clicks
- Focus management for improved user experience

**Usage Example:**

```jsx
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
} = useMetricsDropdown({
  metrics: availableMetrics,
  onMetricsChange: handleMetricsChange,
});
```

## Type Definitions

The monitoring feature uses the following key type definitions (from `src/types/monitoring.ts`):

### CPUData

```typescript
export interface CPUData {
  time: string; // Timestamp for the data point
  load: number; // CPU load percentage
  memory: number; // Memory usage percentage
  threads: number; // Number of active threads
}
```

### Service

```typescript
export interface Service {
  id?: string;
  name: string;
  port?: number;
  url?: string;
  status?: 'Running' | 'Stopped' | 'Error' | 'Online' | 'Offline';
  health?: 'Healthy' | 'Warning' | 'Critical' | 'Degraded' | 'Error';
  uptime?: string;
  version?: string;
  lastDeployment?: string;
}
```

### Metric

```typescript
export interface Metric {
  id: string; // Unique identifier for the metric
  name: string; // Display name for the metric
  dataKey: string; // Key to access the data in the CPUData object
  color: string; // Color for the metric line in charts
  selected: boolean; // Whether the metric is selected for display
}
```

## Data Flow

1. **Service Selection**: User selects a microservice to monitor using the ServiceSelector component
2. **Data Retrieval**: CPU and other metrics data is fetched for the selected service
3. **Metrics Selection**: User selects which metrics to display using the MetricsSelector component
4. **Visualization**: Selected metrics are displayed on the CPUChart component
5. **Preference Persistence**: User preferences for selected metrics are saved to localStorage

## Usage Examples

### Monitoring CPU Metrics

1. Navigate to the Monitoring section from the sidebar
2. Select a microservice from the ServiceSelector dropdown
3. View the CPU metrics on the CPUChart component
4. Use the MetricsSelector to customize which metrics are displayed (CPU load, memory usage,
   threads)
5. Your metric preferences will be remembered for each service

### Customizing Metrics Display

1. Click on the metrics toggle button to open the metrics dropdown
2. Use the search box to filter available metrics
3. Toggle metrics on/off by clicking on them
4. Use keyboard navigation (Tab, Enter, Escape) for accessibility
5. Close the dropdown by clicking outside or pressing Escape
