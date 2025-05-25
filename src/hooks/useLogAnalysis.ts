import { useState } from 'react';

interface LogAnalysisResult {
  project_id: string;
  analysis: string;
  log_count: number;
  success: boolean;
  error?: string;
}

export const useLogAnalysis = (projectId: string) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LogAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const analyzeProjectLogs = async () => {
    if (!projectId) {
      setAnalysisError('No project selected for analysis');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setIsDialogOpen(true);

    try {
      const response = await fetch('http://backend:8000/api/logs/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze logs');
      }

      const data: LogAnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Error analyzing logs:', error);
      setAnalysisError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return {
    analyzeProjectLogs,
    isAnalyzing,
    analysisResult,
    analysisError,
    isDialogOpen,
    closeDialog,
  };
};
