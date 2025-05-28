import { createContext, useState, ReactNode } from 'react';
import { Project, ProjectContextType } from './projectTypes';

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined,
);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProject] = useState<Project | null>(null);

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
}
