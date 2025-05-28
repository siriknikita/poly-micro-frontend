# Shared Components Documentation

## Overview

The Shared Components module provides reusable UI components that are used
across multiple features in the Poly Micro Manager application. These components
ensure consistency in the user interface and reduce code duplication by
centralizing common UI elements.

## Components Structure

```
src/components/shared/
├── selectors/                 # Selection components
│   ├── ProjectSelector.tsx    # Project selection component
│   └── index.ts               # Export file for selector components
├── BoxedWrapper.tsx           # Wrapper component with consistent styling
├── SectionHeader.tsx          # Header component for sections
└── index.ts                   # Export file for shared components
```

## Key Components

### ProjectSelector.tsx

A dropdown component for selecting and switching between different
projects/microservice ecosystems.

**Key Features:**

- Project list display in a dropdown format
- Project selection and change handling
- Visual indication of currently selected project
- Integration with the TopBar component

**Usage:**

```tsx
import { ProjectSelector } from '../shared/selectors';

const MyComponent = () => (
  <ProjectSelector
    projects={availableProjects}
    selectedProject={currentProject}
    onSelectProject={handleProjectChange}
  />
);
```

### BoxedWrapper.tsx

A wrapper component that provides consistent styling for boxed content
throughout the application.

**Key Features:**

- Consistent padding and margins
- Border and shadow styling
- Responsive behavior
- Theme-aware styling

**Usage:**

```tsx
import { BoxedWrapper } from '../shared';

const MyComponent = () => (
  <BoxedWrapper>
    <p>Content goes here</p>
  </BoxedWrapper>
);
```

### SectionHeader.tsx

A header component for section titles with consistent styling.

**Key Features:**

- Consistent typography
- Optional action buttons
- Theme-aware styling
- Responsive behavior

**Usage:**

```tsx
import { SectionHeader } from '../shared';

const MyComponent = () => (
  <div>
    <SectionHeader title="My Section" />
    <p>Section content goes here</p>
  </div>
);
```

## Design Principles

The shared components follow these design principles:

1. **Consistency**: Ensure UI consistency across the application
2. **Reusability**: Components are designed to be reused in multiple contexts
3. **Flexibility**: Components accept props to customize their behavior
4. **Accessibility**: Components follow accessibility best practices
5. **Theming**: Components respect the application's theme settings

## Usage Guidelines

When using shared components, follow these guidelines:

1. **Import from index.ts**: Always import shared components from the index file
2. **Respect prop interfaces**: Provide all required props and use optional
   props as needed
3. **Avoid direct styling**: Use the provided props for customization rather
   than direct styling
4. **Maintain consistency**: Use shared components instead of creating similar
   one-off components
5. **Extend responsibly**: If a shared component needs new functionality,
   consider extending it rather than creating a new one

## Integration with Other Features

Shared components are used throughout the application:

- **Auth**: Form layouts and section headers
- **Testing**: Test item containers and section organization
- **Monitoring**: Dashboard layouts and data displays
- **Pipelining**: Pipeline component containers and section headers

## Contributing New Shared Components

When adding a new shared component:

1. Ensure the component is truly reusable across multiple features
2. Create a properly typed interface for component props
3. Implement responsive behavior and theme awareness
4. Add comprehensive JSDoc comments
5. Export the component from the index.ts file
6. Update this documentation
