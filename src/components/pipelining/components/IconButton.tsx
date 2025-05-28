import { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const IconButton = ({
  icon,
  label,
  variant = 'secondary',
  size = 'md',
  active = false,
  className = '',
  ...props
}: IconButtonProps) => {
  const baseClasses =
    'flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900';

  const variantClasses = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary:
      'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
    outline:
      'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800',
    danger:
      'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
    success:
      'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const activeClasses = active
    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
    : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${activeClasses} ${className}`}
      title={props.title || label}
      {...props}
    >
      {icon}
      {label && (
        <span
          className={`${size === 'sm' ? 'ml-1' : 'ml-2'} ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
        >
          {label}
        </span>
      )}
    </button>
  );
};
