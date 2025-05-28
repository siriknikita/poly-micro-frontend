import { EmptyState } from './EmptyState';
import { useMicroserviceNavigation } from './hooks';
import { TestsTab } from '../tests/TestsTab';
import { useProject } from '@/context/useProject';

export const AutomatedTesting = () => {
  const { project } = useProject();
  if (!project) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <EmptyState
          message="No project selected"
          description="Please select a project to view tests"
        />
      </div>
    );
  }

  if (!project?.microservices || project?.microservices.length === 0) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <EmptyState
          message="No microservices available"
          description="Please add a microservice to view tests"
        />
      </div>
    );
  }

  const microservices = project.microservices;

  const { selectedMicroservice } = useMicroserviceNavigation({
    microservices: microservices,
    initialMicroservice: microservices.length > 0 ? microservices[0] : null,
  });

  if (!selectedMicroservice) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Test Discovery
            </h2>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <TestsTab />
        </div>
      </div>
    </div>
  );
};
