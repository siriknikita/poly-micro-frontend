import { Service } from '@/types';

export interface Project {
  id: string;
  name: string;
  microservices?: Service[];
  // Add other fields as needed
}

export interface ProjectContextType {
  project: Project | null;
  setProject: (project: Project | null) => void;
}
