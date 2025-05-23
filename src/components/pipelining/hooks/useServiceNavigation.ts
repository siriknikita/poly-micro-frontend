import { useState, useCallback, useEffect } from 'react';
import { Service } from '@/types';

interface UseServiceNavigationProps {
  services: Service[];
  projectId: string;
  initialServiceName?: string | null;
  storageKey?: string;
}

export function useServiceNavigation({
  services,
  projectId,
  initialServiceName,
  storageKey = 'cicd',
}: UseServiceNavigationProps) {
  // Find initial service if provided, otherwise use first service or from localStorage
  const findInitialService = useCallback(() => {
    if (!services || services.length === 0) {
      return null;
    }

    if (initialServiceName) {
      const service = services.find((s) => s.name === initialServiceName);
      if (service) return service;
    }

    const storedServiceName = localStorage.getItem(`lastSelected_${storageKey}_${projectId}`);
    if (storedServiceName) {
      const service = services.find((s) => s.name === storedServiceName);
      if (service) return service;
    }

    return services[0];
  }, [services, initialServiceName, projectId, storageKey]);

  const [selectedService, setSelectedService] = useState<Service | null>(findInitialService);

  // Update selected service when services or initialServiceName changes
  useEffect(() => {
    const service = findInitialService();
    if (service) {
      setSelectedService(service);
    }
  }, [services, initialServiceName, findInitialService]);

  // Save selected service to localStorage when it changes
  useEffect(() => {
    if (selectedService && projectId) {
      localStorage.setItem(`lastSelected_${storageKey}_${projectId}`, selectedService.name);
    }
  }, [selectedService, projectId, storageKey]);

  // Navigate to previous or next service
  const navigateService = useCallback(
    (direction: 'up' | 'down') => {
      if (!selectedService || services.length === 0) return;

      const currentIndex = services.findIndex((s) => s.name === selectedService.name);
      if (currentIndex === -1) return;

      const newIndex =
        direction === 'up'
          ? (currentIndex - 1 + services.length) % services.length
          : (currentIndex + 1) % services.length;

      setSelectedService(services[newIndex]);
    },
    [selectedService, services],
  );

  return {
    selectedService,
    setSelectedService,
    navigateService,
  };
}
