import React from 'react';
import { Service } from '@/types';
import {
  Dropdown,
  DropdownOption,
  DropdownSectionProps,
} from '@/components/shared/Dropdown';

interface ServiceSelectorProps {
  selectedService: string | null;
  services: Service[];
  onServiceSelect: (service: string) => void;
  className?: string;
  label?: string;
  showAllOption?: boolean;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  services,
  onServiceSelect,
  className = '',
  label = 'Select a service',
  showAllOption = false,
}) => {
  // Transform services to dropdown options
  const serviceOptions: DropdownOption[] = services
    ? services.map((service) => ({ id: service.name, label: service.name }))
    : [];

  // Add placeholder option
  const placeholderOptions: DropdownOption[] = [{ id: '', label }];

  // Add 'All Services' option if needed
  if (showAllOption) {
    placeholderOptions.push({ id: 'All', label: 'All Services' });
  }

  // Create sections for the dropdown
  const sections: DropdownSectionProps[] = [
    {
      options: placeholderOptions,
      onSelect: onServiceSelect,
    },
    {
      options: serviceOptions,
      onSelect: onServiceSelect,
    },
  ];

  return (
    <Dropdown
      buttonLabel={label}
      selectedOption={selectedService || ''}
      sections={sections}
      className={className}
      testId="service-selector"
    />
  );
};
