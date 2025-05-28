import { memo, useState, useCallback } from 'react';
import { Variable, Plus } from 'lucide-react';
import { usePipelineVariables } from './hooks';
import { IconButton, VariableItem } from './components';

interface PipelineVariable {
  name: string;
  value: string;
  scope: 'local' | 'global';
}

export const VariablesPanel = memo(() => {
  // Use our custom hook for managing pipeline variables
  const { variables, addVariable, deleteVariable } = usePipelineVariables();

  // Local state for new variable form
  const [newVariable, setNewVariable] = useState<PipelineVariable>({
    name: '',
    value: '',
    scope: 'local',
  });

  // Handle adding a new variable
  const handleAdd = useCallback(() => {
    if (newVariable.name && newVariable.value) {
      // Call addVariable with the local newVariable state
      addVariable(newVariable);
      // Reset the form
      setNewVariable({ name: '', value: '', scope: 'local' });
    }
  }, [addVariable, newVariable]);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-l dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b dark:border-gray-700 flex items-center space-x-2">
        <Variable className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Variables
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {variables.map((variable, index) => (
            <VariableItem
              key={index}
              variable={variable}
              onDelete={() => deleteVariable(index)}
            />
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="Variable name"
            value={newVariable.name}
            onChange={(e) =>
              setNewVariable({ ...newVariable, name: e.target.value })
            }
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Variable value"
            value={newVariable.value}
            onChange={(e) =>
              setNewVariable({ ...newVariable, value: e.target.value })
            }
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <select
            value={newVariable.scope}
            onChange={(e) =>
              setNewVariable({
                ...newVariable,
                scope: e.target.value as 'local' | 'global',
              })
            }
            className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="local">Local</option>
            <option value="global">Global</option>
          </select>
          <IconButton
            onClick={handleAdd}
            icon={<Plus className="h-4 w-4" />}
            label="Add Variable"
            variant="primary"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
});
