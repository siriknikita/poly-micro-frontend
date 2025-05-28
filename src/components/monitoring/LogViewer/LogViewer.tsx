import React, { memo, useMemo } from 'react';
import { AlertCircle, Zap } from 'lucide-react';
import { BoxedWrapper, SectionHeader } from '@shared/index';
import { usePagination } from '@hooks/index';
import { Log, Service } from '@/types';
import { DEFAULT_ITEMS_PER_PAGE, LOGS_TABLE_HEADERS } from '@constants';
import { TablePagination } from './TablePagination';
import {
  ServiceSelector,
  SeveritySelector,
  RowsPerPageSelector,
} from '../shared';
import StatusBadge from '../shared/StatusBadge';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';
import { useLogAnalysis } from '@/hooks/useLogAnalysis';
import { LogAnalysisDialog } from './LogAnalysisDialog';

interface LogViewerProps {
  logs: Log[];
  selectedService: string;
  selectedSeverity: string;
  onServiceChange: (service: string) => void;
  onSeverityChange: (severity: string) => void;
  services: Service[];
  selectedProjectId: string;
}

export const LogViewer: React.FC<LogViewerProps> = memo(
  ({
    logs,
    selectedService,
    selectedSeverity,
    onServiceChange,
    onSeverityChange,
    services,
    selectedProjectId,
  }) => {
    // Create a mapping of service IDs to names for display purposes
    const serviceIdToNameMap = useMemo(() => {
      const map: Record<string, string> = {};
      services.forEach((service) => {
        if (service.id) {
          map[service.id] = service.name;
        }
      });
      return map;
    }, [services]);

    // Function to get service name from ID
    const getServiceName = (serviceId: string | undefined): string => {
      if (!serviceId) return 'Unknown Service';
      const name = serviceIdToNameMap[serviceId] || serviceId;
      return name;
    };

    // Find the service ID corresponding to the selected service name
    const selectedServiceId = useMemo(() => {
      if (selectedService === 'All') return 'All';
      // Find the service object that matches the selected service name
      const service = services.find((svc) => svc.name === selectedService);
      return service?.id || selectedService; // Return the ID if found, otherwise the name itself
    }, [selectedService, services]);

    // Filter logs based on selected service and severity
    const filteredLogs = useMemo(() => {
      if (!logs || !Array.isArray(logs)) {
        return [];
      }

      return logs.filter((log) => {
        if (!log) return false;

        const serviceMatch =
          selectedServiceId === 'All' || log.service_id === selectedServiceId;
        const severityMatch =
          selectedSeverity === 'All' || log.severity === selectedSeverity;
        return serviceMatch && severityMatch;
      });
    }, [logs, selectedServiceId, selectedSeverity]);

    const {
      currentPage,
      totalPages,
      itemsPerPage,
      paginatedLogs,
      setLastLogRowRef,
      handlePageChange,
      handleItemsPerPageChange,
    } = usePagination(filteredLogs, DEFAULT_ITEMS_PER_PAGE);

    // Log analysis state and handlers
    const {
      analyzeProjectLogs,
      isAnalyzing,
      analysisResult,
      analysisError,
      isDialogOpen,
      closeDialog,
    } = useLogAnalysis(selectedProjectId);

    return (
      <BoxedWrapper>
        <GuidanceTooltip
          step={OnboardingStep.LOGS}
          title="Log Monitoring"
          description="View and filter logs from all your microservices. You can filter by service, severity level, and adjust how many entries to display per page. Use this to troubleshoot issues and monitor application behavior."
          position="right"
          className="flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              title="Logs"
              HeaderIcon={AlertCircle}
              headerClassName="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100"
              iconClassName="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
            />
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredLogs.length}{' '}
                {filteredLogs.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>
          </div>

          {/* Filter and Actions */}
          <div className="mb-4 flex flex-wrap gap-4 justify-between">
            <div className="flex flex-wrap gap-4">
              <ServiceSelector
                selectedService={selectedService}
                services={services}
                onServiceSelect={onServiceChange}
                showAllOption={true}
              />

              <SeveritySelector
                selectedSeverity={selectedSeverity}
                onSeverityChange={onSeverityChange}
              />

              <RowsPerPageSelector
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>

            {/* AI Analysis Button */}
            <button
              onClick={analyzeProjectLogs}
              disabled={
                !selectedProjectId || filteredLogs.length === 0 || isAnalyzing
              }
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Zap className="h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Logs'}
            </button>
          </div>

          {/* Logs Table */}
          <div className="w-full">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {LOGS_TABLE_HEADERS.map((header) => (
                    <th
                      key={header.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedLogs && paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log, index) => (
                    <tr
                      key={log.id || index}
                      ref={
                        index === paginatedLogs.length - 1
                          ? setLastLogRowRef
                          : null
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {log.timestamp || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {getServiceName(log.service_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={log.severity || 'info'} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {log.message || 'No message'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {log.source || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      No logs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {paginatedLogs.length > 0 ? (
            <TablePagination
              className="flex justify-between items-center mt-4"
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              showPageNumbers={true}
            />
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No logs found matching the current filters
            </div>
          )}
        </GuidanceTooltip>

        {/* Log Analysis Dialog */}
        <LogAnalysisDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          analysis={analysisResult?.analysis || null}
          loading={isAnalyzing}
          error={analysisError}
          logCount={analysisResult?.log_count || 0}
        />
      </BoxedWrapper>
    );
  },
);
