import React, { memo } from 'react';
import { Server } from 'lucide-react';
import { Service } from '@/types';
import { BoxedWrapper, SectionHeader } from '@shared/index';
import StatusBadge from './shared/StatusBadge';
import { ServiceFilters } from './shared/ServiceFilters';
import { useServiceFilters } from './hooks/useServiceFilters';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';

interface ServiceStatusProps {
  services: Service[];
  projectId: string;
}

export const ServiceStatus: React.FC<ServiceStatusProps> = memo(
  ({ services, projectId }) => {
    const {
      filterGroups,
      filteredServices,
      addFilterGroup,
      updateFilterGroup,
      removeFilterGroup,
      clearFilters,
    } = useServiceFilters({ projectId, services });

    return (
      <BoxedWrapper>
        <GuidanceTooltip
          step={OnboardingStep.MICROSERVICES}
          title="Microservices Management"
          description="Monitor and manage your microservices from this panel. You can see their status, health, and performance metrics. Use the filters to find specific services."
          position="left"
          className="flex flex-col services-panel"
        >
          <SectionHeader
            title="Services Status"
            HeaderIcon={Server}
            headerClassName="text-lg font-semibold mb-2 flex items-center text-gray-900 dark:text-gray-100"
            iconClassName="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
          />

          <ServiceFilters
            services={services}
            filterGroups={filterGroups}
            onAddFilterGroup={addFilterGroup}
            onUpdateFilterGroup={updateFilterGroup}
            onRemoveFilterGroup={removeFilterGroup}
            onClearFilters={clearFilters}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredServices && filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <div
                  key={index}
                  className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {service.name}
                  </h4>
                  <div className="space-y-2 mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Port: {service.port}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Version: {service.version}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Uptime: {service.uptime}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status: <StatusBadge status={service.status || ''} />
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Health: <StatusBadge status={service.health || ''} />
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No services match the current filters. Try adjusting your filter
                criteria.
              </div>
            )}
          </div>
        </GuidanceTooltip>
      </BoxedWrapper>
    );
  },
);
