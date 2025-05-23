import { memo, useState, useCallback } from 'react';
import { PipelineToolbox } from './PipelineToolbox';
import { PipelineCanvas } from './PipelineCanvas';
import { NavigationControls } from './NavigationControls';
import { VariablesPanel } from './VariablesPanel';
import { Save, Download, Play, Grid3X3 } from 'lucide-react';
import { mockServices } from '@data/mockData';
import { Project } from '@/types';
import { useServiceNavigation } from './hooks';
import { IconButton } from './components';

interface CICDPipelineProps {
  selectedProjectId: Project['id'];
  initialServiceName?: string | null;
}

export const CICDPipeline = memo<CICDPipelineProps>(({ selectedProjectId, initialServiceName }) => {
  // Use our custom hook for service navigation
  const { selectedService, navigateService } = useServiceNavigation({
    projectId: selectedProjectId,
    services: mockServices[selectedProjectId],
    initialServiceName,
  });

  // Local state
  const [showGrid, setShowGrid] = useState(true);
  const [toolboxPosition] = useState<'left' | 'right' | 'float'>('left');
  const [isSimulating, setIsSimulating] = useState(false);

  // Handle service navigation
  const handleServiceChange = useCallback(
    (direction: 'up' | 'down') => {
      navigateService(direction);
    },
    [navigateService],
  );

  // Handle pipeline export
  const handleExport = useCallback(() => {
    // Mock export functionality
    const pipeline = {
      service: selectedService?.name || '',
      blocks: [], // Would contain actual pipeline configuration
      variables: {},
    };
    const blob = new Blob([JSON.stringify(pipeline, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-${(selectedService?.name || '').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selectedService?.name]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Pipeline: {selectedService?.name || ''}
            </h2>
            <div className="flex items-center space-x-2">
              <IconButton
                onClick={() => setShowGrid(!showGrid)}
                icon={<Grid3X3 className="h-5 w-5" />}
                variant={showGrid ? 'primary' : 'outline'}
                title="Toggle grid"
                aria-label="Toggle grid visibility"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <IconButton
              onClick={() => setIsSimulating(!isSimulating)}
              icon={<Play className="h-4 w-4" />}
              label={isSimulating ? 'Stop Simulation' : 'Start Simulation'}
              variant={isSimulating ? 'success' : 'primary'}
              size="md"
            />
            <IconButton
              onClick={() => {
                /* Save functionality */
              }}
              icon={<Save className="h-5 w-5" />}
              variant="outline"
              title="Save pipeline"
              aria-label="Save pipeline"
            />
            <IconButton
              onClick={handleExport}
              icon={<Download className="h-5 w-5" />}
              variant="outline"
              title="Export pipeline"
              aria-label="Export pipeline"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <PipelineToolbox
          position={toolboxPosition}
          // onPositionChange={setToolboxPosition}
          isSimulating={isSimulating}
        />

        <div className="flex-1 relative">
          <PipelineCanvas showGrid={showGrid} isSimulating={isSimulating} />

          <NavigationControls
            onNavigate={handleServiceChange}
            currentService={selectedService || mockServices[selectedProjectId][0]}
            services={mockServices[selectedProjectId]}
          />
        </div>

        <VariablesPanel />
      </div>
    </div>
  );
});
