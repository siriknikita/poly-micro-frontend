import { useState, useCallback } from 'react';

export interface PipelineVariable {
  name: string;
  value: string;
  scope: 'local' | 'global';
}

interface UsePipelineVariablesOptions {
  initialVariables?: PipelineVariable[];
}

export function usePipelineVariables({ initialVariables = [] }: UsePipelineVariablesOptions = {}) {
  const [variables, setVariables] = useState<PipelineVariable[]>(
    initialVariables.length > 0
      ? initialVariables
      : [
          { name: 'ENVIRONMENT', value: 'production', scope: 'global' },
          { name: 'RETRY_COUNT', value: '3', scope: 'local' },
          { name: 'TIMEOUT', value: '300', scope: 'local' },
        ],
  );

  const [newVariable, setNewVariable] = useState<PipelineVariable>({
    name: '',
    value: '',
    scope: 'local',
  });

  const addVariable = useCallback(
    (variable?: PipelineVariable) => {
      // If a variable is provided, use it; otherwise use the internal newVariable state
      const varToAdd = variable || newVariable;

      if (varToAdd.name && varToAdd.value) {
        setVariables((prev) => [...prev, { ...varToAdd }]);
        // Only reset the internal state if we're using it
        if (!variable) {
          setNewVariable({ name: '', value: '', scope: 'local' });
        }
        return true;
      }
      return false;
    },
    [newVariable],
  );

  const updateNewVariable = useCallback((field: keyof PipelineVariable, value: string) => {
    setNewVariable((prev) => ({
      ...prev,
      [field]: field === 'scope' ? (value as 'local' | 'global') : value,
    }));
  }, []);

  const deleteVariable = useCallback((index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateVariable = useCallback(
    (index: number, field: keyof PipelineVariable, value: string) => {
      setVariables((prev) =>
        prev.map((variable, i) =>
          i === index
            ? {
                ...variable,
                [field]: field === 'scope' ? (value as 'local' | 'global') : value,
              }
            : variable,
        ),
      );
    },
    [],
  );

  return {
    variables,
    newVariable,
    addVariable,
    updateNewVariable,
    deleteVariable,
    updateVariable,
  };
}
