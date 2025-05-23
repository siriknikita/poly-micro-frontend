# Service Filters

## Overview

The Service Filters feature allows users to filter microservices based on their status and health
properties. Filters are project-specific, meaning each project can have its own set of filters that
are persisted across sessions.

## Key Features

- **Flexible Filtering**: Filter services by status, health, or both using logical operators (AND,
  OR, NOT)
- **Project-specific Persistence**: Filter settings are saved per project and restored automatically
- **Multiple Filter Groups**: Create complex filtering scenarios with multiple filter groups
- **Edit Existing Filters**: Easily modify existing filters by clicking on them
- **Clear Filters**: Remove all filters with a single click

## Components

### ServiceFilters

The main component that displays active filters and provides controls to add, edit, remove, and
clear filters.

**Props:**

- `services`: Array of Service objects
- `filterGroups`: Array of active FilterGroup objects
- `onAddFilterGroup`: Function to add a new filter group
- `onUpdateFilterGroup`: Function to update an existing filter group
- `onRemoveFilterGroup`: Function to remove a filter group
- `onClearFilters`: Function to clear all filters

### ServiceFilterDialog

A modal dialog that allows users to create or edit filter conditions.

**Props:**

- `isOpen`: Boolean to control dialog visibility
- `onClose`: Function to close the dialog
- `onApplyFilter`: Function to apply the filter
- `services`: Array of Service objects
- `initialFilterGroup`: Optional FilterGroup for editing existing filters

## Data Types

### FilterOperator

Logical operators for combining filter conditions:

- `AND`: All conditions must match
- `OR`: Any condition can match
- `NOT`: None of the conditions should match

### FilterField

Properties of a service that can be filtered:

- `status`: The operational status of the service
- `health`: The health status of the service

### FilterCondition

A single filter condition:

```typescript
interface FilterCondition {
  field: FilterField;
  value: string;
}
```

### FilterGroup

A group of conditions with a logical operator:

```typescript
interface FilterGroup {
  operator: FilterOperator;
  conditions: FilterCondition[];
}
```

## Usage

### Adding a Filter

1. Click the "Add Filter" button
2. Select a filter operator (AND, OR, NOT)
3. Add one or more conditions by selecting a field and value
4. Click "Apply Filter"

### Editing a Filter

1. Click the edit icon (pencil) next to an existing filter
2. Modify the operator or conditions as needed
3. Click "Apply Filter"

### Removing a Filter

Click the remove icon (X) next to the filter you want to remove.

### Clearing All Filters

Click the "Clear all" button to remove all filters.

## Persistence

Filters are automatically saved to localStorage using the key `serviceFilters_${projectId}` and
restored when the component mounts. This ensures that filter settings persist across page reloads
and browser sessions.

## Default Behavior

When no filters are applied, all services are displayed. If filters are applied but no services
match the criteria, a message is displayed indicating that no services match the current filters.
