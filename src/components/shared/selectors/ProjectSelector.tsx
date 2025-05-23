import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Project } from '@/types';
import { GuidanceTooltip } from '@/components/guidance';
import { OnboardingStep } from '@/context/GuidanceContext';
import { Dropdown, DropdownSectionProps } from '../Dropdown';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  loading?: boolean;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  loading = false,
}) => {
  // Convert projects to dropdown options format
  const projectOptions = projects.map((project) => ({
    id: project.id,
    label: project.name,
    disabled: false,
  }));

  // Create dropdown sections
  const sections: DropdownSectionProps[] = [
    {
      options: projectOptions,
      onSelect: (id: string) => {
        const project = projects.find((p) => p.id === id);
        if (project) onSelectProject(project);
      },
    },
  ];

  return (
    <GuidanceTooltip
      step={OnboardingStep.PROJECT_SELECTION}
      title="Project Selection"
      description="Select your project from this dropdown to view and manage its microservices. Each project contains its own set of services and configurations."
      position="bottom"
      className="relative project-selector"
    >
      <div className="relative">
        <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
        <Dropdown
          buttonLabel={loading ? 'Loading projects...' : (selectedProject?.name || 'Select a project')}
          selectedOption={selectedProject?.id}
          sections={sections}
          className="w-full"
          buttonClassName="pl-10 pr-4 py-2"
          testId="selected-project"
          disabled={loading}
        />
      </div>
    </GuidanceTooltip>
  );
};
