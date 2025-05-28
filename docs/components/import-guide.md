# Component Import Guide

## Overview

This guide explains how to properly import components in the Poly Micro Manager
application, particularly focusing on the refactored component structure and
custom hooks.

## Component Export Structure

The application uses a centralized export system through index files at various
levels:

1. **Main components index**: `src/components/index.ts` - Re-exports components
   from all feature modules
2. **Feature module index**: e.g., `src/components/testing/index.ts` -
   Re-exports components from a specific feature
3. **Sub-module index**: e.g., `src/components/testing/components/index.ts` -
   Re-exports components from a specific sub-module

```typescript
// Import from the main components index
import { ComponentName } from '@/components';

// Import from a specific feature module
import { FeatureComponent } from '@/components/feature';

// Import from a specific sub-module
import { SubComponent } from '@/components/feature/components';
```

## Custom Hooks

The application has been refactored to use custom hooks for better separation of
concerns. Each feature module has its own hooks directory with an index file for
exports.

```typescript
// Import hooks from the main hooks directory
import { useTheme, usePagination } from '@/hooks';

// Import feature-specific hooks
import {
  useTestItems,
  useResizablePanel,
  useMicroserviceNavigation,
} from '@/components/testing/hooks';
import {
  useAuthManagement,
  useServiceSelection,
} from '@/components/monitoring/hooks';
```

## Reusable UI Components

Many UI components have been refactored into smaller, reusable components. These
are typically organized in a `components` directory within each feature module.

```typescript
// Import reusable components from the testing feature
import {
  IconButton,
  NavigationControls,
  SearchInput,
  TestItem,
} from '@/components/testing/components';
```

## Renamed Components

Some components have been renamed in the main export file to avoid naming
conflicts between different feature modules. The most notable examples are
components with the same name in different features.

### Example: IconButton Components

We have different `IconButton` implementations in different modules:

1. **TestingIconButton**: The `IconButton` from the testing module
2. **PipeliningIconButton**: The `IconButton` from the pipelining module

#### How to Import

```typescript
// Import renamed components
import { TestingIconButton, PipeliningIconButton } from '@/components';

// Usage example
<TestingIconButton icon="play" onClick={handlePlay} />
<PipeliningIconButton icon="settings" onClick={handleSettings} />
```

#### Direct Imports

If you're working directly within a feature module, you can import the original
component with its original name:

```typescript
// Within testing feature components
import { IconButton } from '../components';
// or for deeper imports
import { IconButton } from '@/components/testing/components';
```

## Constants and Utility Functions

The refactored codebase includes constants files for commonly used values:

```typescript
// Import constants from the testing feature
import { TEST_ITEM_TYPES, PANEL_SIZES } from '@/components/testing/constants';
```

## Best Practices

1. **Use index files** for imports whenever possible to maintain clean import
   paths
2. **Use custom hooks** for state management and business logic
3. **Use renamed components** when importing from the main components index
4. **Use the original component names** when working within the specific feature
   module
5. **Be consistent** with your import patterns throughout your components

## Component Documentation

For detailed documentation on specific components, refer to the feature-specific
documentation:

- [Testing Components](./testing.md)
- [Monitoring Components](./monitoring.md)
- [Pipelining Components](./pipelining.md)
- [Shared Components](./shared.md)
