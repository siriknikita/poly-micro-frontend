import React, { memo, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { BoxedWrapper, SectionHeader } from '@shared/index';
import { usePagination } from '@hooks/index';
import { Log, Service } from '@/types';
import { DEFAULT_ITEMS_PER_PAGE, LOGS_TABLE_HEADERS } from '@constants';
import { TablePagination } from './TablePagination';
import { ServiceSelector, SeveritySelector, RowsPerPageSelector } from '../shared';
import StatusBadge from '../shared/StatusBadge';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';

interface LogViewerProps {
  logs: Log[];
  selectedService: string;
  selectedSeverity: string;
  onServiceChange: (service: string) => void;
  onSeverityChange: (severity: string) => void;
  services: Service[];
}

export const LogViewer: React.FC<LogViewerProps> = memo(
  ({ logs, selectedService, selectedSeverity, onServiceChange, onSeverityChange, services }) => {
    // Debug log information
    console.log('LogViewer - logs:', logs);
    console.log('LogViewer - services:', services);
    console.log('LogViewer - selectedService:', selectedService);
    
    // Create a mapping of service IDs to names for display purposes
    const serviceIdToNameMap = useMemo(() => {
      const map: Record<string, string> = {};
      services.forEach(service => {
        if (service.id) {
          map[service.id] = service.name;
          console.log(`Mapping service ${service.id} to ${service.name}`);
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
    
    // Filter logs based on selected service and severity
    const filteredLogs = useMemo(() => {
      if (!logs || !Array.isArray(logs)) {
        console.error('Logs is not an array:', logs);
        return [];
      }
      
      return logs.filter((log) => {
        if (!log) return false;
        
        const serviceMatch = selectedService === 'All' || log.service_id === selectedService;
        const severityMatch = selectedSeverity === 'All' || log.severity === selectedSeverity;
        return serviceMatch && severityMatch;
      });
    }, [logs, selectedService, selectedSeverity]);

    const {
      currentPage,
      totalPages,
      itemsPerPage,
      paginatedLogs,
      setLastLogRowRef,
      handlePageChange,
      handleItemsPerPageChange,
    } = usePagination(filteredLogs, DEFAULT_ITEMS_PER_PAGE);

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
                {filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-4 flex flex-wrap gap-4">
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
                      ref={index === paginatedLogs.length - 1 ? setLastLogRowRef : null}
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
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
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
      </BoxedWrapper>
    );
  },
);
