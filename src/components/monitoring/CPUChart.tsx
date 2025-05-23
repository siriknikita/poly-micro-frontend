import React, { memo, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Activity } from 'lucide-react';
import { CPUData, Service, Metric } from '@/types';
import { BoxedWrapper, SectionHeader } from '@shared/index';
import { ServiceSelector } from './shared';
import { MetricsSelector } from './shared/MetricsSelector';
import { useMetricsSelection } from './hooks';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';

const CustomTooltip = memo(
  ({ active, payload, label }: Partial<TooltipProps<ValueType, NameType>>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 rounded text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600">
          <p className="label">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }

    return null;
  },
);

interface CPUChartProps {
  data: CPUData[] | null;
  selectedService: string | null;
  services: Service[];
  onServiceSelect: (service: string) => void;
  selectedProjectId: string;
}

export const CPUChart: React.FC<CPUChartProps> = memo(
  ({ data, selectedService, services, onServiceSelect, selectedProjectId }) => {
    // Define default metrics
    const defaultMetrics = useMemo<Metric[]>(
      () => [
        { id: 'load', name: 'CPU Load %', dataKey: 'load', color: '#4f46e5', selected: true },
        {
          id: 'memory',
          name: 'Memory Usage %',
          dataKey: 'memory',
          color: '#059669',
          selected: true,
        },
        {
          id: 'threads',
          name: 'Active Threads',
          dataKey: 'threads',
          color: '#db2777',
          selected: true,
        },
      ],
      [],
    );

    // Use our custom hook for metrics selection with persistence
    const { metrics, updateMetricSelection } = useMetricsSelection({
      projectId: selectedProjectId,
      serviceName: selectedService,
      defaultMetrics,
    });
    return (
      <BoxedWrapper className="mt-4">
        <GuidanceTooltip
          step={OnboardingStep.SYSTEM_METRICS}
          title="System Metrics"
          description="Monitor your microservices' performance metrics in real-time. You can track CPU load, memory usage, and active threads for each service. Select different metrics to visualize using the checkboxes."
          position="top"
          className="flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <SectionHeader
                title="System Metrics"
                HeaderIcon={Activity}
                headerClassName="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100"
                iconClassName="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400"
              />
              {selectedService && data && (
                <MetricsSelector metrics={metrics} onMetricsChange={updateMetricSelection} />
              )}
            </div>
            <ServiceSelector
              selectedService={selectedService}
              services={services}
              onServiceSelect={onServiceSelect}
            />
          </div>

          {!selectedService ? (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Please select a microservice to view its metrics
            </div>
          ) : !data ? (
            <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No metrics available for this service
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
                  <XAxis
                    dataKey="time"
                    className="text-gray-900 dark:text-gray-400"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    className="text-gray-900 dark:text-gray-400"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {metrics.map(
                    (metric) =>
                      metric.selected && (
                        <Line
                          key={metric.id}
                          type="monotone"
                          dataKey={metric.dataKey}
                          stroke={metric.color}
                          name={metric.name}
                        />
                      ),
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </GuidanceTooltip>
      </BoxedWrapper>
    );
  },
);
