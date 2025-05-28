import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMicroserviceNavigation } from '@/components/testing/hooks/useMicroserviceNavigation';
import { mockMicroservices } from '../../mocks/mockData';

describe('useMicroserviceNavigation', () => {
  it('initializes with empty microservices list', () => {
    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: [],
      }),
    );

    expect(result.current.selectedMicroservice).toBe(null);
    expect(result.current.filteredMicroservices).toEqual([]);
    expect(result.current.searchQuery).toBe('');
  });

  it('selects the first microservice by default', () => {
    const projectMicroservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: projectMicroservices,
      }),
    );

    expect(result.current.selectedMicroservice).toEqual(
      projectMicroservices[0],
    );
  });

  it('uses initialMicroservice when provided', () => {
    const projectMicroservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );
    const initialMicroservice = projectMicroservices[1]; // User Service

    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: projectMicroservices,
        initialMicroservice,
      }),
    );

    expect(result.current.selectedMicroservice).toEqual(initialMicroservice);
  });

  it('changes the selected microservice', () => {
    const projectMicroservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: projectMicroservices,
      }),
    );

    // Select a different microservice
    act(() => {
      result.current.setSelectedMicroservice(projectMicroservices[1]);
    });

    expect(result.current.selectedMicroservice).toEqual(
      projectMicroservices[1],
    );
  });

  it('resets selected microservice when microservices array changes', () => {
    const project1Microservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result, rerender } = renderHook(
      (props) => useMicroserviceNavigation(props),
      {
        initialProps: { microservices: project1Microservices },
      },
    );

    // Initially selects first microservice from project1
    expect(result.current.selectedMicroservice).toEqual(
      project1Microservices[0],
    );

    // Change to project2 microservices
    const project2Microservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project2',
    );
    rerender({ microservices: project2Microservices });

    // Should reset to first microservice in project2
    expect(result.current.selectedMicroservice).toEqual(
      project2Microservices[0],
    );
  });

  it('handles filtering microservices by search query', () => {
    const projectMicroservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: projectMicroservices,
      }),
    );

    // Set search query to filter for "user"
    act(() => {
      result.current.setSearchQuery('user');
    });

    // Should filter microservices to only show User Service
    expect(result.current.filteredMicroservices.length).toBe(1);
    expect(result.current.filteredMicroservices[0].name).toBe('User Service');
  });

  it('navigates to previous microservice', () => {
    const projectMicroservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: projectMicroservices,
      }),
    );

    // Initially selects first microservice (Authentication Service)
    expect(result.current.selectedMicroservice?.name).toBe(
      'Authentication Service',
    );

    // Navigate up (should wrap around to the last item)
    act(() => {
      result.current.navigateMicroservice('up');
    });

    // Should select the last microservice (Payment Service)
    expect(result.current.selectedMicroservice?.name).toBe('Payment Service');
  });

  it('navigates to next microservice', () => {
    const projectMicroservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: projectMicroservices,
      }),
    );

    // Initially selects first microservice (Authentication Service)
    expect(result.current.selectedMicroservice?.name).toBe(
      'Authentication Service',
    );

    // Navigate down
    act(() => {
      result.current.navigateMicroservice('down');
    });

    // Should select the next microservice (User Service)
    expect(result.current.selectedMicroservice?.name).toBe('User Service');
  });

  it('gets previous microservice name', () => {
    const projectMicroservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: projectMicroservices,
      }),
    );

    // Select the middle microservice (User Service)
    act(() => {
      result.current.setSelectedMicroservice(projectMicroservices[1]);
    });

    // Previous should be Authentication Service
    expect(result.current.getPreviousMicroserviceName()).toBe(
      'Authentication Service',
    );
  });

  it('gets next microservice name', () => {
    const projectMicroservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result } = renderHook(() =>
      useMicroserviceNavigation({
        microservices: projectMicroservices,
      }),
    );

    // Select the middle microservice (User Service)
    act(() => {
      result.current.setSelectedMicroservice(projectMicroservices[1]);
    });

    // Next should be Payment Service
    expect(result.current.getNextMicroserviceName()).toBe('Payment Service');
  });

  it('clears search query when microservices change', () => {
    const project1Microservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project1',
    );

    const { result, rerender } = renderHook(
      (props) => useMicroserviceNavigation(props),
      {
        initialProps: { microservices: project1Microservices },
      },
    );

    // Set a search query
    act(() => {
      result.current.setSearchQuery('user');
    });

    expect(result.current.searchQuery).toBe('user');

    // Change microservices
    const project2Microservices = mockMicroservices.filter(
      (ms) => ms.projectId === 'project2',
    );
    rerender({ microservices: project2Microservices });

    // Search query should be cleared
    expect(result.current.searchQuery).toBe('');
  });
});
