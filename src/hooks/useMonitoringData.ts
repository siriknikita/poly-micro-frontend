import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Log } from '@/types';
import { metricsApi, servicesApi, logsApi } from '@/utils/api';
import { useToast } from '@/context/useToast';

export default function useMonitoringData(selectedProjectId: string) {
  // Get the MongoDB ID from localStorage if available
  const [mongoProjectId, setMongoProjectId] = useState<string>(selectedProjectId);
  const { showError } = useToast();
  
  useEffect(() => {
    // If the selected project ID matches the one saved in localStorage, use the MongoDB ID
    if (selectedProjectId === localStorage.getItem('lastSelectedProject')) {
      const mongoId = localStorage.getItem('lastSelectedProjectMongoId');
      if (mongoId) {
        setMongoProjectId(mongoId);
      }
    } else {
      // Otherwise, use the provided ID (could be either format)
      setMongoProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  const {
    data: cpuData,
    isLoading: cpuLoading,
    error: cpuError,
  } = useQuery({
    queryKey: ['cpuData', selectedProjectId],
    queryFn: async () => {
      try {
        const response = await metricsApi.getCpuMetrics(mongoProjectId);
        if (!response || !response.data) throw new Error('Failed to fetch CPU data');
        return response.data;
      } catch (err) {
        showError('Failed to fetch CPU metrics');
        console.error('Error fetching CPU metrics:', err);
        throw err;
      }
    },
    enabled: !!mongoProjectId,
  });

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ['services', selectedProjectId],
    queryFn: async () => {
      try {
        const response = await servicesApi.getServices(mongoProjectId);
        if (!response || !response.data) throw new Error('Failed to fetch services');
        return response.data;
      } catch (err) {
        showError('Failed to fetch services');
        console.error('Error fetching services:', err);
        throw err;
      }
    },
    enabled: !!mongoProjectId,
  });

  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ['logs', selectedProjectId],
    queryFn: async () => {
      try {
        // If we have a selected project, fetch logs for that project specifically
        const response = await logsApi.getLogs(mongoProjectId);
        if (!response || !response.data) throw new Error('Failed to fetch logs');
        return response.data;
      } catch (err) {
        showError('Failed to fetch logs');
        console.error('Error fetching logs:', err);
        throw err;
      }
    },
    enabled: !!mongoProjectId,
  });

  const loading = cpuLoading || servicesLoading || logsLoading;
  const error =
    cpuError || servicesError || logsError
      ? cpuError?.message || servicesError?.message || logsError?.message
      : null;

  const [selectedLogService, setSelectedLogService] = useState<string>('All');
  const [selectedMetricService, setSelectedMetricService] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');

  const filteredLogs = logsData?.filter(
    (log: Log) =>
      (selectedLogService === 'All' || log.service_id === selectedLogService) &&
      (selectedSeverity === 'All' || log.severity === selectedSeverity),
  );

  return {
    cpuData: cpuData || [],
    services: servicesData || [],
    logs: filteredLogs || [],
    selectedLogService,
    setSelectedLogService,
    selectedMetricService,
    setSelectedMetricService,
    selectedSeverity,
    setSelectedSeverity,
    selectedProjectId,
    loading,
    error,
  };
}
