# Service Filters Implementation

## Architecture Overview

The Service Filters feature follows the SOLID principles and React best
practices outlined in the project's architecture guidelines. It consists of:

1. **Custom Hook**: `useServiceFilters` for state management and business logic
2. **UI Components**: `ServiceFilters` and `ServiceFilterDialog` for user
   interaction
3. **Integration**: With the `ServiceStatus` component in the monitoring
   dashboard

## Component Structure

```
src/
├── components/
│   └── monitoring/
│       ├── hooks/
│       │   └── useServiceFilters.ts  # State management and filter logic
│       ├── shared/
│       │   ├── ServiceFilters.tsx    # Filter display and management UI
│       │   └── ServiceFilterDialog.tsx # Filter creation/editing dialog
│       └── ServiceStatus.tsx         # Integration with service display
```

## Custom Hook: useServiceFilters

The `useServiceFilters` hook manages filter state and persistence:

```typescript
// Key features
export const useServiceFilters = ({
  projectId,
  services,
}: UseServiceFiltersProps) => {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);

  // Load filters from localStorage on component mount
  useEffect(() => {
    const savedFilters = localStorage.getItem(`serviceFilters_${projectId}`);
    // ...
  }, [projectId]);

  // Save filters to localStorage when they change
  useEffect(() => {
    // ...
  }, [filterGroups, projectId]);

  // Apply filters to services
  useEffect(() => {
    // ...
  }, [services, filterGroups]);

  // Filter management functions
  const addFilterGroup = (group: FilterGroup) => {
    /* ... */
  };
  const updateFilterGroup = (index: number, group: FilterGroup) => {
    /* ... */
  };
  const removeFilterGroup = (index: number) => {
    /* ... */
  };
  const clearFilters = () => {
    /* ... */
  };

  return {
    filterGroups,
    filteredServices,
    addFilterGroup,
    updateFilterGroup,
    removeFilterGroup,
    clearFilters,
  };
};
```

## UI Components

### ServiceFilters Component

Responsible for displaying active filters and providing controls to manage them:

```typescript
export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  services,
  filterGroups,
  onAddFilterGroup,
  onUpdateFilterGroup,
  onRemoveFilterGroup,
  onClearFilters,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFilterIndex, setEditingFilterIndex] = useState<number | null>(
    null,
  );

  // Handler functions
  const handleDialogClose = () => {
    /* ... */
  };
  const handleApplyFilter = (group: FilterGroup) => {
    /* ... */
  };
  const handleEditFilter = (index: number) => {
    /* ... */
  };

  // Render UI
  // ...
};
```

### ServiceFilterDialog Component

Provides the UI for creating and editing filters:

```typescript
export const ServiceFilterDialog: React.FC<ServiceFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilter,
  services,
  initialFilterGroup,
}) => {
  // State management
  const [operator, setOperator] = useState<FilterOperator>(
    initialFilterGroup?.operator || 'AND',
  );
  const [conditions, setConditions] = useState<FilterCondition[]>(
    initialFilterGroup?.conditions || [{ field: 'status', value: '' }],
  );

  // Handler functions
  // ...

  // Render UI
  // ...
};
```

## Integration with ServiceStatus

The `ServiceStatus` component integrates the filtering functionality:

```typescript
export const ServiceStatus: React.FC<ServiceStatusProps> = memo(({ services, projectId }) => {
  const {
    filterGroups,
    filteredServices,
    addFilterGroup,
    updateFilterGroup,
    removeFilterGroup,
    clearFilters
  } = useServiceFilters({ projectId, services });

  return (
    <BoxedWrapper>
      <div className="flex flex-col">
        <SectionHeader /* ... */ />

        <ServiceFilters
          services={services}
          filterGroups={filterGroups}
          onAddFilterGroup={addFilterGroup}
          onUpdateFilterGroup={updateFilterGroup}
          onRemoveFilterGroup={removeFilterGroup}
          onClearFilters={clearFilters}
        />

        {/* Display filtered services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              // Service card
            ))
          ) : (
            // No results message
          )}
        </div>
      </div>
    </BoxedWrapper>
  );
});
```

## Data Persistence

Filters are persisted in localStorage with project-specific keys:

```typescript
// Save filters
localStorage.setItem(
  `serviceFilters_${projectId}`,
  JSON.stringify(filterGroups),
);

// Load filters
const savedFilters = localStorage.getItem(`serviceFilters_${projectId}`);
if (savedFilters) {
  try {
    const parsedFilters = JSON.parse(savedFilters);
    setFilterGroups(parsedFilters);
  } catch (error) {
    console.error('Error parsing saved filters:', error);
    localStorage.removeItem(`serviceFilters_${projectId}`);
  }
}
```

## Filter Logic Implementation

The filtering logic applies each filter group to the services array:

```typescript
// Apply filters to services
useEffect(() => {
  if (!services || services.length === 0) {
    setFilteredServices([]);
    return;
  }

  if (filterGroups.length === 0) {
    // No filters, show all services
    setFilteredServices(services);
    return;
  }

  // Apply each filter group
  const filtered = services.filter((service) => {
    // Check each filter group
    return filterGroups.every((group) => {
      const { operator, conditions } = group;

      // Apply conditions based on operator
      switch (operator) {
        case 'AND':
          return conditions.every((condition) => {
            const serviceValue = service[condition.field];
            return serviceValue === condition.value;
          });

        case 'OR':
          return conditions.some((condition) => {
            const serviceValue = service[condition.field];
            return serviceValue === condition.value;
          });

        case 'NOT':
          return conditions.every((condition) => {
            const serviceValue = service[condition.field];
            return serviceValue !== condition.value;
          });

        default:
          return true;
      }
    });
  });

  setFilteredServices(filtered);
}, [services, filterGroups]);
```

## Testing Considerations

When writing tests for the Service Filters feature, consider:

1. **Unit Tests**:

   - Test the `useServiceFilters` hook in isolation
   - Verify filter logic for different operators (AND, OR, NOT)
   - Test localStorage persistence

2. **Component Tests**:

   - Test the `ServiceFilters` component rendering
   - Verify dialog interactions
   - Test filter editing functionality

3. **Integration Tests**:
   - Test the integration with `ServiceStatus`
   - Verify filtered services display correctly

## Future Enhancements

Potential enhancements to consider:

1. **Server-side persistence**: Store filters in a database for cross-device
   access
2. **Filter presets**: Allow saving and loading common filter configurations
3. **Advanced filtering**: Support more complex conditions and operators
4. **Filter sharing**: Enable sharing filter configurations between users
