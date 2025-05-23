import { useState, useEffect } from 'react';
import { Service } from '@/types';

interface UseServiceSelectionProps {
  projectId: string;
  services: Service[];
  initialServiceName?: string | null;
  storageKey?: string;
}

export const useServiceSelection = ({
  projectId,
  services,
  initialServiceName,
  storageKey = 'monitoring',
}: UseServiceSelectionProps) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Initialize selected service from localStorage or prop
  useEffect(() => {
    if (!services || services.length === 0) return;

    // Try to use the initialServiceName prop first
    if (initialServiceName) {
      const service = services.find((s) => s.name === initialServiceName);
      if (service) {
        setSelectedService(service.name);
        return;
      }
    }

    // Try to get from localStorage
    const savedService = localStorage.getItem(`lastSelected_${storageKey}_${projectId}`);
    if (savedService) {
      const service = services.find((s) => s.name === savedService);
      if (service) {
        setSelectedService(service.name);
        return;
      }
    }

    // If no initial service provided or found in localStorage, set the first service as default
    if (services[0]) {
      setSelectedService(services[0].name);
    }
  }, [projectId, services, initialServiceName, storageKey]);

  // Save selected service to localStorage when it changes
  useEffect(() => {
    if (selectedService && projectId) {
      localStorage.setItem(`lastSelected_${storageKey}_${projectId}`, selectedService);
    }
  }, [selectedService, projectId, storageKey]);

  return {
    selectedService,
    setSelectedService,
  };
};
