import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types';
import { useProject } from '@/context/useProject';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '@/utils/api';

/**
 * Custom hook for managing project selection and data
 * Handles loading, selecting, and updating project data
 */
export function useProjectManagement(activeTab: string) {
  const { setProject } = useProject();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects with React Query
  const {
    data: projects = [],
    isLoading: loading,
    error,
  } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const response = await projectsApi.getProjects();
        if (!response || !response.data)
          throw new Error('Failed to fetch projects');

        // Ensure each project has the MongoDB _id mapped to the 'mongoId' property
        // This will be used for backend calls while keeping 'id' for backward compatibility
        return response.data.map((project: any) => ({
          ...project,
          mongoId: project._id || project.id, // Store MongoDB ID as mongoId
        }));
      } catch (err) {
        console.error('Error fetching projects:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  // Load saved project using fetched projects
  useEffect(() => {
    if (loading) return;
    const savedProjectId = localStorage.getItem('lastSelectedProject');
    if (savedProjectId) {
      const project = projects.find((p) => p.id === savedProjectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [loading, projects]);

  // Update project context when selected project changes
  useEffect(() => {
    if (!selectedProject) return;

    // In a Tauri app, we should always have access to all project data
    // So we'll use the real project microservices data rather than mocked data

    // Get the microservices from the project or other relevant source
    // For now, we're assuming selectedProject might already have microservices
    // If not, we can fetch them or derive them from other project data

    // Set the project with microservices data
    setProject({
      ...selectedProject,
      // If the project already has microservices data, use it
      // Otherwise, we can implement a function to derive or fetch it
      // For now, if it doesn't exist, we'll use an empty array as a fallback
      microservices: selectedProject.microservices || [],
    });
  }, [activeTab, selectedProject, setProject]);

  // Handle project selection
  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    // Store both IDs for compatibility
    localStorage.setItem('lastSelectedProject', project.id);
    localStorage.setItem(
      'lastSelectedProjectMongoId',
      project.mongoId || project._id || project.id,
    );
  }, []);

  return {
    selectedProject,
    setSelectedProject,
    handleSelectProject,
    projects,
    loading,
    error: error ? (error as Error).message : null,
  };
}
