import { memo } from 'react';
import { X } from 'lucide-react';

interface ConfigFieldProps {
  name: string;
  schema: {
    type: string;
    options?: string[];
    default?: unknown;
    required?: boolean;
    min?: number;
    max?: number;
    label?: string;
  };
  value: string | number | boolean | string[];
  onChange: (name: string, value: string | number | boolean | string[]) => void;
}

export const ConfigField = memo(({ name, schema, value, onChange }: ConfigFieldProps) => {
  const handleChange = (newValue: string | number | boolean | string[]) => {
    onChange(name, newValue);
  };

  const renderFieldInput = () => {
    const fieldValue = value ?? schema.default;

    switch (schema.type) {
      case 'string':
      case 'cron':
      case 'expression':
        return (
          <input
            type="text"
            value={String(fieldValue)}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={String(fieldValue)}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        );

      case 'select':
        return (
          <select
            value={String(fieldValue)}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {schema.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'command':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={String(fieldValue)}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter command or select from suggestions"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <select
              onChange={(e) => handleChange(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select a suggested command</option>
              <option value="npm run build">npm run build</option>
              <option value="npm run test">npm run test</option>
              <option value="docker build .">docker build .</option>
              <option value="./deploy.sh">./deploy.sh</option>
            </select>
          </div>
        );

      case 'array': {
        const arrayValue = Array.isArray(fieldValue) ? fieldValue : [];
        return (
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    handleChange(newArray);
                  }}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    handleChange(newArray);
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleChange([...arrayValue, ''])}
              className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg"
              type="button"
            >
              Add Item
            </button>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {schema.label}
      </label>
      {renderFieldInput()}
    </div>
  );
});
