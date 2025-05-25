import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Log } from '@/types';

const API_BASE_URL = 'http://backend:8000/api';

export default function useMonitoringData(selectedProjectId: string) {
  const {
    data: cpuData,
    isLoading: cpuLoading,
    error: cpuError,
  } = useQuery({
    queryKey: ['cpuData', selectedProjectId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/metrics/cpu/project/${selectedProjectId}`);
      if (!response.ok) throw new Error('Failed to fetch CPU data');
      return response.json();
    },
    enabled: !!selectedProjectId,
  });
  console.log('cpuData', cpuData);

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ['services', selectedProjectId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/services/project/${selectedProjectId}`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    },
    enabled: !!selectedProjectId,
  });
  console.log('servicesData', servicesData);

  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ['logs', selectedProjectId],
    queryFn: async () => {
      // If we have a selected project, fetch logs for that project specifically
      const url = selectedProjectId
        ? `${API_BASE_URL}/logs/project/${selectedProjectId}`
        : `${API_BASE_URL}/logs`;
      console.log('url', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
    enabled: !!selectedProjectId,
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
  console.log('logsData', logsData);
  console.log('filteredLogs FUCK ME SIDEWAYS', filteredLogs);

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
