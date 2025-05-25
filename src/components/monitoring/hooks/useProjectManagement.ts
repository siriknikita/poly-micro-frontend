import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types';
import { mockTestDataByProject } from '@data/mockTestData';
import { useProject } from '@/context/useProject';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://backend:8000'; // Configure this to match your FastAPI server URL

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
    error
  } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
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

  // Update project context when tab or selected project changes
  useEffect(() => {
    if (!selectedProject) return;

    // If we're on the testing tab, make sure the project has microservices data
    if (activeTab === 'testing') {
      // Get project-specific test data or fallback to an empty array
      const projectTestData = mockTestDataByProject[selectedProject.id] || [];

      const projectWithMicroservices = {
        ...selectedProject,
        microservices: projectTestData,
      };

      setProject(projectWithMicroservices);
    } else {
      // For other tabs, we don't need the microservices data
      setProject({
        ...selectedProject,
        microservices: undefined,
      });
    }
  }, [activeTab, selectedProject, setProject]);

  // Handle project selection
  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    localStorage.setItem('lastSelectedProject', project.id);
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
