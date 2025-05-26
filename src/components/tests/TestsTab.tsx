import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/useProject';
import { ServiceTestsList } from './ServiceTestsList';
import { ChevronDown } from 'lucide-react';

export const TestsTab: React.FC = () => {
  const { project } = useProject();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Reset selected service when project changes
  useEffect(() => {
    setSelectedService(null);
  }, [project?.id]);
  
  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsDropdownOpen(false);
  };
  
  if (!project) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
          Please select a project to view tests
        </p>
      </div>
    );
  }
  
  const microservices = project.microservices || [];
  const selectedServiceName = microservices.find(s => s.id === selectedService)?.name || 'Select Service';
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Tests Management
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        View and run tests for your microservices. Select a service to see its available tests.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Service Selection
          </h3>
          
          <div className="relative mb-4">
            <div 
              className="flex items-center justify-between p-2 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer bg-white dark:bg-gray-700"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-gray-800 dark:text-gray-200">{selectedServiceName}</span>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                {microservices.map(service => (
                  <div 
                    key={service.id} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-gray-800 dark:text-gray-200"
                    onClick={() => handleServiceChange(service.id)}
                  >
                    {service.name}
                  </div>
                ))}
                {microservices.length === 0 && (
                  <div className="p-2 text-gray-500 dark:text-gray-400">
                    No services available
                  </div>
                )}
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The selected service's tests will be discovered using pytest's collection functionality.
          </p>
        </div>
      </div>
      
      {selectedService && (
        <div className="mt-6">
          <ServiceTestsList 
            serviceId={selectedService} 
            serviceName={microservices.find(s => s.id === selectedService)?.name || 'Unknown Service'} 
          />
        </div>
      )}
      
      {!selectedService && microservices.length > 0 && (
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Select a service to view its tests
          </p>
        </div>
      )}
    </div>
  );
};
