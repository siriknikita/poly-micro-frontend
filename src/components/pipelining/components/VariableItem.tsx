import { memo } from 'react';
import { Trash2 } from 'lucide-react';
import { PipelineVariable } from '../hooks/usePipelineVariables';

interface VariableItemProps {
  variable: PipelineVariable;
  onDelete: () => void;
}

export const VariableItem = memo(({ variable, onDelete }: VariableItemProps) => {
  return (
    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {variable.name}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            variable.scope === 'global'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
          }`}
        >
          {variable.scope}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">{variable.value}</span>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
          type="button"
          aria-label="Delete variable"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
