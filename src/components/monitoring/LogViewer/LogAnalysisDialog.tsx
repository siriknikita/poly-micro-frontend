import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LogAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string | null;
  loading: boolean;
  error: string | null;
  logCount: number;
}

export const LogAnalysisDialog: React.FC<LogAnalysisDialogProps> = ({
  isOpen,
  onClose,
  analysis,
  loading,
  error,
  logCount,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
            Log Analysis Report
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          <p className="text-gray-800 dark:text-gray-200">
            Analyze the logs to identify potential issues and suggest solutions.
          </p>
        </DialogDescription>

        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500 dark:text-indigo-400" />
              <p className="mt-2 text-gray-800 dark:text-gray-200">
                Analyzing logs, please wait...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-600 dark:text-red-400">
              <p className="font-medium">Analysis Error</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-800 dark:text-gray-200">
                Analysis based on {logCount} {logCount === 1 ? 'log' : 'logs'}
              </div>

              <div className="prose dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-200">
                {analysis ? (
                  <div className="text-gray-800 dark:text-gray-200">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {analysis}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-800 dark:text-gray-200">
                    No analysis available. Try again with more logs.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
