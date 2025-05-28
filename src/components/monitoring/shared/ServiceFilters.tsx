import React, { useState } from 'react';
import { FilterIcon, X, Edit2 } from 'lucide-react';
import { Service } from '@/types';
import { FilterGroup } from '../hooks/useServiceFilters';
import { ServiceFilterDialog } from './ServiceFilterDialog';

interface ServiceFiltersProps {
  services: Service[];
  filterGroups: FilterGroup[];
  onAddFilterGroup: (group: FilterGroup) => void;
  onUpdateFilterGroup: (index: number, group: FilterGroup) => void;
  onRemoveFilterGroup: (index: number) => void;
  onClearFilters: () => void;
}

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

  // Format condition for display
  const formatCondition = (field: string, value: string) => {
    return `${field}: ${value}`;
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFilterIndex(null);
  };

  // Handle filter application
  const handleApplyFilter = (group: FilterGroup) => {
    if (editingFilterIndex !== null) {
      onUpdateFilterGroup(editingFilterIndex, group);
      setEditingFilterIndex(null);
    } else {
      onAddFilterGroup(group);
    }
    setIsDialogOpen(false);
  };

  // Open dialog to edit a filter
  const handleEditFilter = (index: number) => {
    setEditingFilterIndex(index);
    setIsDialogOpen(true);
  };

  return (
    <div
      className="mb-4"
      data-testid="service-filters"
    >
      <div className="flex items-center mb-2">
        <button
          onClick={() => {
            setEditingFilterIndex(null);
            setIsDialogOpen(true);
          }}
          className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mr-2"
          aria-label="Add filter"
          data-testid="add-filter-button"
        >
          <FilterIcon className="h-4 w-4 mr-1" />
          <span>Add Filter</span>
        </button>

        {filterGroups.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      {filterGroups.length > 0 && (
        <div
          className="flex flex-wrap gap-2"
          data-testid="active-filters"
        >
          {filterGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="flex items-center bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-md px-2 py-1 text-sm"
            >
              <span className="font-medium mr-1">{group.operator}:</span>
              <div className="flex flex-wrap gap-1">
                {group.conditions.map((condition, condIndex) => (
                  <span
                    key={condIndex}
                    className="mx-1"
                  >
                    {formatCondition(condition.field, condition.value)}
                    {condIndex < group.conditions.length - 1 && (
                      <span className="mx-1">•</span>
                    )}
                  </span>
                ))}
              </div>
              <div className="flex ml-1">
                <button
                  onClick={() => handleEditFilter(groupIndex)}
                  className="mr-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                  aria-label="Edit filter"
                >
                  <Edit2
                    className="h-3 w-3"
                    data-testid="edit-icon"
                  />
                </button>
                <button
                  onClick={() => onRemoveFilterGroup(groupIndex)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                  aria-label="Remove filter"
                >
                  <X
                    className="h-3 w-3"
                    data-testid="x-icon"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceFilterDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onApplyFilter={handleApplyFilter}
        services={services}
        initialFilterGroup={
          editingFilterIndex !== null
            ? filterGroups[editingFilterIndex]
            : undefined
        }
      />
    </div>
  );
};
