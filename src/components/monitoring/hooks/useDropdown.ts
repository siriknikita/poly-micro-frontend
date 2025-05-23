import { useState, useRef, useEffect } from 'react';

interface UseDropdownProps {
  onOpen?: () => void;
  onClose?: () => void;
}

/**
 * Custom hook for managing dropdown state and behavior
 */
export const useDropdown = ({ onOpen, onClose }: UseDropdownProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    onClose?.();
  };

  return {
    isOpen,
    dropdownRef,
    toggleDropdown,
    closeDropdown,
  };
};
