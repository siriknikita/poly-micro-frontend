import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  id: string;
  label: string;
  disabled?: boolean;
  colorClass?: string;
}

export interface DropdownSectionProps {
  options: DropdownOption[];
  onSelect: (id: string) => void;
}

export interface DropdownHeaderProps {
  title?: string;
  subtitle?: string;
}

export interface DropdownProps {
  buttonLabel: string;
  selectedOption?: string;
  sections: DropdownSectionProps[];
  header?: DropdownHeaderProps;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  placement?: 'left' | 'right';
  testId?: string;
  colorMap?: Record<string, string>;
  disabled?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  buttonLabel,
  selectedOption,
  sections,
  header,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  placement = 'right',
  testId = 'dropdown',
  colorMap,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option label and color class
  const getSelectedOption = () => {
    for (const section of sections) {
      const option = section.options.find((opt) => opt.id === selectedOption);
      if (option) {
        return {
          label: option.label,
          colorClass: option.colorClass || (colorMap && colorMap[option.id]),
        };
      }
    }
    return { label: buttonLabel, colorClass: undefined };
  };

  const selectedOptionData = getSelectedOption();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
      data-testid={testId}
    >
      <button
        type="button"
        className={`inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md ${!disabled ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : 'opacity-70 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${buttonClassName}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={selectedOptionData.colorClass}>{selectedOptionData.label}</span>
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      <div
        className={`${
          isOpen
            ? 'opacity-100 visible transform translate-y-0 scale-100'
            : 'opacity-0 invisible transform -translate-y-2 scale-95'
        } transition-all duration-200 absolute ${placement === 'left' ? 'left-0' : 'right-0'} z-10 mt-2 w-56 origin-top-${placement}`}
      >
        <div
          className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 rounded-md shadow-lg outline-none ${menuClassName}`}
          role="menu"
        >
          {header && (
            <div className="px-4 py-3">
              {header.title && (
                <p className="text-sm leading-5 text-gray-500 dark:text-gray-400">{header.title}</p>
              )}
              {header.subtitle && (
                <p className="text-sm font-medium leading-5 text-gray-900 dark:text-gray-100 truncate">
                  {header.subtitle}
                </p>
              )}
            </div>
          )}

          {sections.map((section, sectionIndex) => (
            <div className="py-1" key={`section-${sectionIndex}`}>
              {section.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    if (!option.disabled) {
                      section.onSelect(option.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`${
                    option.disabled
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${
                    option.id === selectedOption
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 font-medium text-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-200'
                  } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                  role="menuitem"
                  tabIndex={option.disabled ? -1 : 0}
                  aria-disabled={option.disabled}
                  data-testid={`dropdown-option-${option.id}`}
                  aria-selected={option.id === selectedOption}
                >
                  <span className={option.colorClass}>{option.label}</span>
                  {option.id === selectedOption && (
                    <svg
                      className="h-4 w-4 text-indigo-500 dark:text-indigo-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
