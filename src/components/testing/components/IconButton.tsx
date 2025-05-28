import { memo, ButtonHTMLAttributes, ReactNode } from 'react';
import { BUTTON_VARIANTS } from '../constants';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label?: string;
  variant?: 'primary' | 'outline' | 'active';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

/**
 * Reusable icon button component
 */
export const IconButton = memo<IconButtonProps>(
  ({
    icon,
    label,
    variant = 'outline',
    size = 'sm',
    className = '',
    disabled = false,
    ...props
  }) => {
    // Get the variant class
    const variantClass =
      BUTTON_VARIANTS[variant.toUpperCase() as keyof typeof BUTTON_VARIANTS] ||
      BUTTON_VARIANTS.OUTLINE;

    // Get the size class
    const sizeClass =
      size === 'sm' ? 'p-2' : size === 'md' ? 'px-4 py-2' : 'px-6 py-3';

    // Determine if it's an icon-only button or icon with label
    const isIconOnly = !label;

    // Add disabled styling
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <button
        className={`rounded-lg ${sizeClass} ${variantClass} ${isIconOnly ? '' : 'flex items-center space-x-2'} ${disabledClass} ${className}`}
        disabled={disabled}
        {...props}
      >
        {icon}
        {label && <span>{label}</span>}
      </button>
    );
  },
);
