import { memo, useState, useCallback, FormEvent } from 'react';
import { X, Save } from 'lucide-react';
import { BlockInstance } from '@/types/pipeline';
import { BoxedWrapper } from '@/components/shared';
import { ConfigField, IconButton } from './components';

interface BlockConfigModalProps {
  block: BlockInstance;
  onSave: (
    instanceId: string,
    config: Record<string, string | number | boolean | string[]>,
  ) => void;
  onClose: () => void;
}

export const BlockConfigModal = memo<BlockConfigModalProps>(({ block, onSave, onClose }) => {
  const [config, setConfig] = useState<Record<string, string | number | boolean | string[]>>(
    block.config || {},
  );

  // Handle field change
  const handleFieldChange = useCallback(
    (key: string, value: string | number | boolean | string[]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSave(block.instanceId, config);
    },
    [block.instanceId, config, onSave],
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <BoxedWrapper className="shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Configure {block.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {Object.entries(block.configSchema).map(([key, schema]) => (
            <ConfigField
              key={key}
              name={key}
              schema={schema}
              value={config[key]}
              onChange={handleFieldChange}
            />
          ))}

          <div className="flex justify-end space-x-2 pt-4">
            <IconButton
              type="button"
              onClick={onClose}
              icon={<X className="h-4 w-4" />}
              label="Cancel"
              variant="outline"
            />
            <IconButton
              type="submit"
              icon={<Save className="h-4 w-4" />}
              label="Save"
              variant="primary"
            />
          </div>
        </form>
      </BoxedWrapper>
    </div>
  );
});
