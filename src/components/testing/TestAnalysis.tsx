import React, { useState } from 'react';
import { BrainCircuit, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { testsApi } from '@/utils/api';
import { TestItem } from '@/types';

interface TestAnalysisProps {
  testId: string;
  testRunId?: string;
  onAnalysisComplete?: (analysis: any) => void;
}

export const TestAnalysis: React.FC<TestAnalysisProps> = ({ testId, testRunId, onAnalysisComplete }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const runAnalysis = async () => {
    if (!testRunId) {
      setError('No test run ID available for analysis');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First check if analysis already exists
      try {
        const existingAnalysis = await testsApi.getTestAnalysis(testRunId);
        setAnalysis(existingAnalysis.data);
        if (onAnalysisComplete) {
          onAnalysisComplete(existingAnalysis.data);
        }
        setIsLoading(false);
        return;
      } catch (err) {
        // No existing analysis, continue to generate a new one
        console.log('No existing analysis found, generating new one');
      }

      // Request new analysis
      const response = await testsApi.analyzeTestRun({
        test_run_id: testRunId,
        include_logs: true
      });

      setAnalysis(response.data);
      if (onAnalysisComplete) {
        onAnalysisComplete(response.data);
      }
    } catch (err) {
      console.error('Error analyzing test results:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze test results');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!testRunId) {
    return (
      <div className="mt-2 text-gray-500 text-sm italic">
        Run the test first to enable AI analysis
      </div>
    );
  }

  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-5 w-5 text-indigo-500" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            AI Analysis
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {!analysis && !isLoading && (
            <button
              onClick={runAnalysis}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Test'}
            </button>
          )}
          
          {analysis && (
            <button
              onClick={toggleExpand}
              className="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing test results...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500 flex items-start">
          <Info className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {analysis && (
        <div className={`mt-4 transition-all duration-300 ${isExpanded ? 'max-h-[2000px]' : 'max-h-20 overflow-hidden'}`}>
          {analysis.summary && (
            <div className="mb-3 font-medium text-gray-800 dark:text-gray-200">
              {analysis.summary}
            </div>
          )}
          
          {isExpanded && (
            <>
              {analysis.issues_detected && analysis.issues_detected.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Issues Detected</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {analysis.issues_detected.map((issue: any, index: number) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Suggestions</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {analysis.suggestions.map((suggestion: string, index: number) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detailed Analysis</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {analysis.analysis}
                </div>
              </div>
            </>
          )}

          {!isExpanded && (
            <div className="mt-2 text-gray-500 text-sm text-right">
              Click to expand for full analysis
            </div>
          )}
        </div>
      )}
    </div>
  );
};
