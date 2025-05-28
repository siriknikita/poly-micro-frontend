import React from 'react';
import {
  Dropdown,
  DropdownOption,
  DropdownSectionProps,
} from '@/components/shared/Dropdown';
import { SEVERITY_LEVELS, TEXT_COLORS_BY_SEVERITY } from '@/helpers/constants';

interface SeveritySelectorProps {
  selectedSeverity: string;
  onSeverityChange: (severity: string) => void;
  className?: string;
  label?: string;
}

export const SeveritySelector: React.FC<SeveritySelectorProps> = ({
  selectedSeverity,
  onSeverityChange,
  className = '',
  label = 'All Severities',
}) => {
  // Transform severity levels to dropdown options
  const severityOptions: DropdownOption[] = SEVERITY_LEVELS.map((severity) => ({
    id: severity,
    label: severity,
    colorClass:
      TEXT_COLORS_BY_SEVERITY[severity as keyof typeof TEXT_COLORS_BY_SEVERITY],
  }));

  // Add 'All' option
  const allOption: DropdownOption[] = [
    {
      id: 'All',
      label: 'All Severities',
      colorClass: TEXT_COLORS_BY_SEVERITY.All,
    },
  ];

  // Create sections for the dropdown
  const sections: DropdownSectionProps[] = [
    {
      options: allOption,
      onSelect: onSeverityChange,
    },
    {
      options: severityOptions,
      onSelect: onSeverityChange,
    },
  ];

  return (
    <Dropdown
      buttonLabel={label}
      selectedOption={selectedSeverity}
      sections={sections}
      className={className}
      testId="severity-selector"
    />
  );
};
