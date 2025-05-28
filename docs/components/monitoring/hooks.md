# Dashboard Custom Hooks Documentation

## Overview

The Dashboard component has been refactored to use custom hooks for better
separation of concerns, improved maintainability, and code reuse. This document
provides detailed information about each custom hook, its purpose, and usage.

## Hooks Structure

```
src/components/monitoring/hooks/
├── useAuthManagement.ts   # Hook for managing authentication state
├── useProjectManagement.ts # Hook for managing project selection
├── useServiceSelection.ts # Hook for managing service selection
├── useTabNavigation.ts    # Hook for managing tab navigation
└── index.ts               # Export file for hooks
```

## Hook Details

### useTabNavigation

This hook manages tab navigation within the Dashboard component, synchronizing
the active tab with the URL.

**Key Features:**

- Determines the active tab based on the current URL
- Updates the URL when the active tab changes
- Provides a consistent interface for tab management

**Usage:**

```tsx
const { activeTab, setActiveTab, pathToTab } = useTabNavigation();

// Use activeTab to conditionally render content
{
  activeTab === 'dashboard' && <DashboardContent />;
}

// Use setActiveTab to change tabs
<button onClick={() => setActiveTab('monitoring')}>Go to Monitoring</button>;
```

### useProjectManagement

This hook manages project selection, persistence, and context updates.

**Key Features:**

- Loads the last selected project from localStorage
- Updates the project context when the selected project changes
- Handles project-specific data loading based on the active tab

**Usage:**

```tsx
const { selectedProject, handleSelectProject } =
  useProjectManagement(activeTab);

// Use selectedProject to conditionally render content
{
  selectedProject ? (
    <ProjectContent project={selectedProject} />
  ) : (
    <NoProjectSelected />
  );
}

// Use handleSelectProject to change the selected project
<ProjectSelector onSelectProject={handleSelectProject} />;
```

### useAuthManagement

This hook manages user authentication state and service selection history.

**Key Features:**

- Retrieves the current user from localStorage
- Provides logout functionality
- Manages service selection history across tabs

**Usage:**

```tsx
const { user, handleLogout, getLastSelectedService } = useAuthManagement();

// Check if user is authenticated
if (!user) return <Redirect to="/login" />;

// Use handleLogout for logout functionality
<LogoutButton onClick={handleLogout} />;

// Use getLastSelectedService to retrieve the last selected service
const initialService = getLastSelectedService(projectId, 'monitoring');
```

### useServiceSelection

This hook manages service selection within each feature.

**Key Features:**

- Tracks the currently selected service
- Persists service selection in localStorage
- Provides a consistent interface for service selection across features

**Usage:**

```tsx
const { selectedService, setSelectedService } = useServiceSelection({
  projectId,
  services,
  initialServiceName,
  storageKey: 'monitoring',
});

// Use selectedService to conditionally render content
{
  selectedService ? (
    <ServiceDetails service={selectedService} />
  ) : (
    <NoServiceSelected />
  );
}

// Use setSelectedService to change the selected service
<ServiceSelector onServiceSelect={setSelectedService} />;
```

## Integration in Dashboard Component

The Dashboard component integrates these hooks to create a modular, maintainable
codebase:

```tsx
export function Dashboard() {
  const { darkMode, setDarkMode } = useTheme();

  // Use custom hooks to manage different aspects of the dashboard
  const { activeTab, setActiveTab } = useTabNavigation();
  const { selectedProject, handleSelectProject } =
    useProjectManagement(activeTab);
  const { user, handleLogout, getLastSelectedService } = useAuthManagement();

  // Component rendering logic...
}
```

## Benefits of Hook-Based Architecture

1. **Separation of Concerns**: Each hook handles a specific aspect of the
   Dashboard functionality
2. **Code Reusability**: Hooks can be reused across different components
3. **Testability**: Isolated logic is easier to test
4. **Maintainability**: Changes to one aspect don't affect others
5. **Readability**: Component code is cleaner and more focused on rendering
