import React, { memo } from 'react';
import { CPUChart } from './CPUChart';
import { ServiceStatus } from './ServiceStatus';
import { LogViewer } from './LogViewer/LogViewer';
import { useMonitoringData } from '@hooks/index';
import { CPUData, Project } from '@/types';
import { useServiceSelection } from './hooks';

interface MonitoringDashboardProps {
  selectedProjectId: Project['id'];
  initialServiceName?: string | null;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = memo(
  ({ selectedProjectId, initialServiceName }: MonitoringDashboardProps) => {
    const { cpuData, services, logs, selectedSeverity, setSelectedSeverity } =
      useMonitoringData(selectedProjectId);

    // Use our custom hook for metric service selection
    const { selectedService: selectedMetricService, setSelectedService: setSelectedMetricService } =
      useServiceSelection({
        projectId: selectedProjectId,
        services: services || [],
        initialServiceName,
        storageKey: 'monitoring',
      });

    // Use our custom hook for log service selection
    const { selectedService: selectedLogService, setSelectedService: setSelectedLogService } =
      useServiceSelection({
        projectId: selectedProjectId,
        services: services || [],
        initialServiceName,
        storageKey: 'logs',
      });

    // Find the CPU data by service_name
    const cpuDataByService =
      cpuData.find((data: CPUData) => data.service_name === selectedMetricService)?.data || [];

    return (
      <div className="space-y-6 overflow-visible">
        <CPUChart
          data={cpuDataByService}
          selectedService={selectedMetricService}
          services={services || []}
          onServiceSelect={setSelectedMetricService}
          selectedProjectId={selectedProjectId}
        />
        <ServiceStatus services={services || []} projectId={selectedProjectId} />
        <LogViewer
          logs={logs}
          selectedService={selectedLogService || ''}
          selectedSeverity={selectedSeverity}
          onServiceChange={setSelectedLogService}
          onSeverityChange={setSelectedSeverity}
          services={services || []}
          selectedProjectId={selectedProjectId}
        />
      </div>
    );
  },
);
