import { memo, ChangeEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Reusable search input component
 */
export const SearchInput = memo<SearchInputProps>(
  ({ value, onChange, placeholder = 'Search...', className = '' }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className={`relative ${className}`}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
          aria-label={placeholder}
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 lucide-search"
          aria-hidden="true"
          role="img"
        />
      </div>
    );
  },
);
