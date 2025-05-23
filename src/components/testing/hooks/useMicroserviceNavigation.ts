import { useState, useCallback, useMemo, useEffect } from 'react';
import { TestItem } from '@/types';

interface UseMicroserviceNavigationProps {
  microservices: TestItem[];
  initialMicroservice?: TestItem | null;
}

/**
 * Hook for managing microservice navigation
 */
export const useMicroserviceNavigation = ({
  microservices,
  initialMicroservice,
}: UseMicroserviceNavigationProps) => {
  const [selectedMicroservice, setSelectedMicroservice] = useState<TestItem | null>(
    initialMicroservice || (microservices.length > 0 ? microservices[0] : null),
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Force reset the selected microservice when microservices array changes
  useEffect(() => {
    // If initialMicroservice is provided, use it
    if (initialMicroservice) {
      setSelectedMicroservice(initialMicroservice);
    }
    // Otherwise, reset selected microservice to first one in the new list
    else if (microservices.length > 0) {
      setSelectedMicroservice(microservices[0]);
    } else {
      setSelectedMicroservice(null);
    }

    // Clear search query when microservices change
    setSearchQuery('');
  }, [microservices, initialMicroservice]);

  // Filter microservices based on search query
  const filteredMicroservices = useMemo(
    () => microservices.filter((ms) => ms.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [microservices, searchQuery],
  );

  // Navigate between microservices
  const navigateMicroservice = useCallback(
    (direction: 'up' | 'down') => {
      if (!selectedMicroservice || filteredMicroservices.length === 0) return;

      const currentIndex = filteredMicroservices.findIndex(
        (ms) => ms.id === selectedMicroservice.id,
      );

      if (currentIndex === -1) {
        // If current selection is not in filtered list, select the first item
        setSelectedMicroservice(filteredMicroservices[0]);
        return;
      }

      const newIndex =
        direction === 'up'
          ? (currentIndex - 1 + filteredMicroservices.length) % filteredMicroservices.length
          : (currentIndex + 1) % filteredMicroservices.length;

      setSelectedMicroservice(filteredMicroservices[newIndex]);
    },
    [selectedMicroservice, filteredMicroservices],
  );

  // Get the previous microservice name for UI display
  const getPreviousMicroserviceName = useCallback(() => {
    if (!selectedMicroservice || filteredMicroservices.length <= 1) return '';

    const currentIndex = filteredMicroservices.findIndex((ms) => ms.id === selectedMicroservice.id);

    if (currentIndex === -1) return '';

    const prevIndex =
      (currentIndex - 1 + filteredMicroservices.length) % filteredMicroservices.length;
    return filteredMicroservices[prevIndex].name;
  }, [selectedMicroservice, filteredMicroservices]);

  // Get the next microservice name for UI display
  const getNextMicroserviceName = useCallback(() => {
    if (!selectedMicroservice || filteredMicroservices.length <= 1) return '';

    const currentIndex = filteredMicroservices.findIndex((ms) => ms.id === selectedMicroservice.id);

    if (currentIndex === -1) return '';

    const nextIndex = (currentIndex + 1) % filteredMicroservices.length;
    return filteredMicroservices[nextIndex].name;
  }, [selectedMicroservice, filteredMicroservices]);

  return {
    selectedMicroservice,
    setSelectedMicroservice,
    searchQuery,
    setSearchQuery,
    filteredMicroservices,
    navigateMicroservice,
    getPreviousMicroserviceName,
    getNextMicroserviceName,
  };
};
