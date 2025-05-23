# Core and Layout Components Documentation

## Overview

The Core and Layout Components are the main structural elements of the Poly Micro Manager
application. They provide the application's layout, navigation functionality, and core application
logic. These components serve as the foundation upon which the feature-specific components are
built.

## Project Structure

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
├── index.css                  # Global CSS styles
├── components/layout/         # Layout components
│   ├── Sidebar.tsx            # Application sidebar navigation
│   ├── TopBar.tsx             # Application top navigation bar
│   ├── ThemeToggle.tsx        # Dark/light theme toggle
│   └── index.ts               # Export file for layout components
├── context/                   # Application context providers
│   ├── ProjectContext.tsx     # Project context provider
│   ├── ToastContext.tsx       # Toast notification context
│   ├── projectTypes.ts        # Type definitions for project context
│   ├── toastTypes.ts          # Type definitions for toast context
│   ├── useProject.tsx         # Hook for accessing project context
│   └── useToast.tsx           # Hook for accessing toast context
├── hooks/                     # Application-wide custom hooks
│   ├── useMonitoringData.ts   # Hook for fetching monitoring data
│   ├── usePagination.ts       # Hook for pagination functionality
│   ├── useTheme.ts            # Hook for theme management
│   └── index.ts               # Export file for hooks
└── types/                     # TypeScript type definitions
```

## Key Components

### Dashboard.tsx

The main dashboard component that serves as the landing page after authentication. It provides an
overview of the microservices ecosystem and quick access to key features.

**Key Features:**

- Microservice overview and status
- Quick access to frequently used features
- Recent activity and notifications
- Performance metrics summary

### Sidebar.tsx

The main navigation component that provides access to all features of the application.

**Key Features:**

- Feature navigation (Testing, Monitoring, Pipelining)
- Collapsible sections
- Visual indicators for active sections
- User profile access
- Theme toggle integration

### TopBar.tsx

The top navigation bar that provides global actions and information.

**Key Features:**

- Project selection
- User account information
- Notifications
- Global search
- Quick actions

### ProjectSelector.tsx

Component for selecting and switching between different projects/microservice ecosystems.

**Key Features:**

- Project list display
- Project switching
- Project information
- Recent projects

### ThemeToggle.tsx

A toggle component for switching between light and dark themes.

**Key Features:**

- Theme state management
- Visual toggle indicator
- Smooth theme transition
- System preference detection

## Application Flow

1. **Authentication**: User logs in through the auth components
2. **Dashboard**: User lands on the main Dashboard
3. **Project Selection**: User selects a project using ProjectSelector
4. **Feature Navigation**: User navigates to specific features using Sidebar
5. **Feature Interaction**: User interacts with feature-specific components
6. **Global Actions**: User performs global actions via TopBar

## Integration with Feature Components

- **Auth**: Authentication state determines what's visible in the core components
- **Testing**: Testing features are accessed through the Sidebar
- **Monitoring**: Monitoring data is summarized in the Dashboard
- **Pipelining**: Pipeline status is displayed in the Dashboard

## Theming System

The application supports both light and dark themes:

1. **Theme Toggle**: Users can switch themes using ThemeToggle
2. **Theme Context**: Theme state is managed through a global context
3. **Component Styling**: All components respond to theme changes
4. **User Preference**: Theme preference is saved for returning users

## Responsive Design

The core components implement responsive design principles:

1. **Mobile Layout**: Sidebar collapses to a hamburger menu
2. **Tablet Layout**: Adjusted spacing and component sizes
3. **Desktop Layout**: Full feature visibility and optimal spacing
4. **Breakpoints**: Standard breakpoints for consistent responsive behavior

## Usage Examples

### Navigating Between Features

1. User clicks on a feature in the Sidebar (e.g., "Testing")
2. The application navigates to the selected feature
3. The active item in the Sidebar is highlighted
4. The TopBar updates to show feature-specific actions

### Switching Projects

1. User clicks on the current project name in the ProjectSelector
2. A dropdown of available projects appears
3. User selects a different project
4. All components update to show data for the selected project

### Toggling Theme

1. User clicks on the ThemeToggle component
2. The application switches between light and dark themes
3. All components update their styling according to the new theme
4. The theme preference is saved for future sessions
