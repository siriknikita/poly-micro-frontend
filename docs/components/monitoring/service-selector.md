# Service Selector Component

## Overview

The Service Selector component allows users to select a microservice to monitor from a list of
available services. It's a key part of the monitoring feature that enables users to focus on
specific services for detailed metrics analysis.

## Component Details

### ServiceSelector

A dropdown component that displays a list of available microservices with their status indicators.

**Props:**

- `services`: Array of service objects
- `selectedService`: ID of the currently selected service (or null if none selected)
- `onServiceSelect`: Callback function when a service is selected
- `disabled`: Optional boolean to disable the selector

**Example Usage:**

```jsx
<ServiceSelector
  services={[
    { id: 'service1', name: 'API Gateway', status: 'Running' },
    { id: 'service2', name: 'Auth Service', status: 'Stopped' },
    { id: 'service3', name: 'User Service', status: 'Running' },
  ]}
  selectedService="service1"
  onServiceSelect={(serviceId) => console.log('Selected service:', serviceId)}
/>
```

## Service Status Indicators

The ServiceSelector component displays status indicators for each service:

- **Running/Online**: Displayed with a green indicator
- **Stopped/Offline**: Displayed with a red indicator
- **Error**: Displayed with an orange indicator
- **Warning/Degraded**: Displayed with a yellow indicator

## Integration with CPUChart

The ServiceSelector component is integrated with the CPUChart component to allow users to select
which microservice to monitor:

```jsx
// Inside CPUChart.tsx
return (
  <div className="cpu-chart">
    <ServiceSelector
      services={services}
      selectedService={selectedService}
      onServiceSelect={onServiceSelect}
    />

    {selectedService && data ? (
      // Chart rendering logic
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

## Accessibility Features

The ServiceSelector component includes several accessibility features:

1. **Keyboard Navigation**: Users can navigate the dropdown using standard keyboard controls
2. **ARIA Attributes**: Appropriate ARIA attributes are used for screen readers
3. **Focus Management**: Proper focus handling for improved user experience
4. **Clear Visual Indicators**: Status indicators use both color and text for better accessibility

## Styling

The ServiceSelector component uses CSS modules for styling, ensuring that styles are scoped to the
component and don't leak to other parts of the application. The component is designed to be
responsive and adapts to different screen sizes.

## Best Practices

When using the ServiceSelector component:

1. **Always provide a comprehensive list of services**: Include all services that can be monitored
2. **Include service status**: Always include the current status of each service
3. **Handle the null case**: Be prepared to handle the case when no service is selected
4. **Provide meaningful feedback**: Show appropriate messages when services are unavailable or have
   no data

## Related Components

The ServiceSelector component works closely with other monitoring components:

- **CPUChart**: Displays CPU metrics for the selected service
- **MetricsSelector**: Allows customization of which metrics to display for the selected service
- **ServiceStatus**: Shows detailed status information for the selected service
