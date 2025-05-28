import { useState, useEffect } from 'react';
import { Service } from '@/types';

// Define filter operators
export type FilterOperator = 'AND' | 'OR' | 'NOT';

// Define filter field types
export type FilterField = 'status' | 'health';

// Define a filter condition
export interface FilterCondition {
  field: FilterField;
  value: string;
}

// Define a filter group (conditions with an operator)
export interface FilterGroup {
  operator: FilterOperator;
  conditions: FilterCondition[];
}

interface UseServiceFiltersProps {
  projectId: string;
  services: Service[];
}

export const useServiceFilters = ({
  projectId,
  services,
}: UseServiceFiltersProps) => {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);

  // Load filters from localStorage on component mount or when projectId changes
  useEffect(() => {
    const savedFilters = localStorage.getItem(`serviceFilters_${projectId}`);
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setFilterGroups(parsedFilters);
      } catch (error) {
        console.error('Error parsing saved filters:', error);
        // Reset filters if there's an error
        localStorage.removeItem(`serviceFilters_${projectId}`);
        setFilterGroups([]);
      }
    } else {
      // Reset filters when switching to a project with no saved filters
      setFilterGroups([]);
    }
  }, [projectId]);

  // Save filters to localStorage when they change
  useEffect(() => {
    if (filterGroups.length > 0) {
      localStorage.setItem(
        `serviceFilters_${projectId}`,
        JSON.stringify(filterGroups),
      );
    } else {
      // Remove item if no filters
      localStorage.removeItem(`serviceFilters_${projectId}`);
    }
  }, [filterGroups, projectId]);

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

  // Add a new filter group
  const addFilterGroup = (group: FilterGroup) => {
    setFilterGroups((prev) => [...prev, group]);
  };

  // Update an existing filter group
  const updateFilterGroup = (index: number, group: FilterGroup) => {
    setFilterGroups((prev) => {
      const updated = [...prev];
      updated[index] = group;
      return updated;
    });
  };

  // Remove a filter group
  const removeFilterGroup = (index: number) => {
    setFilterGroups((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterGroups([]);
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
