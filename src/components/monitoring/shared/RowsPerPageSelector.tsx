import React from 'react';
import { Dropdown, DropdownOption, DropdownSectionProps } from '@/components/shared/Dropdown';
import { ROWS_PER_PAGE_OPTIONS } from '@constants';

interface RowsPerPageSelectorProps {
  itemsPerPage: number;
  onItemsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

export const RowsPerPageSelector: React.FC<RowsPerPageSelectorProps> = ({
  itemsPerPage,
  onItemsPerPageChange,
  className = '',
}) => {
  // Transform rows per page options to dropdown options
  const rowsOptions: DropdownOption[] = ROWS_PER_PAGE_OPTIONS.map((option) => ({
    id: option.toString(),
    label: `${option} per page`,
  }));

  // Handle selection
  const handleSelect = (id: string) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: { value: parseInt(id) },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;

    onItemsPerPageChange(syntheticEvent);
  };

  // Create sections for the dropdown
  const sections: DropdownSectionProps[] = [
    {
      options: rowsOptions,
      onSelect: handleSelect,
    },
  ];

  return (
    <Dropdown
      buttonLabel="Rows per page"
      selectedOption={itemsPerPage.toString()}
      sections={sections}
      className={className}
      testId="rows-per-page-selector"
    />
  );
};
