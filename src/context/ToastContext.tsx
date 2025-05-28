import React, { createContext } from 'react';
import { toast } from 'react-toastify';
import { ToastContextType, defaultOptions } from './toastTypes';

// Create the context with a default value
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

// Toast provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  // Toast functions
  const showSuccess = (message: string, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  };

  const showError = (message: string, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  };

  const showInfo = (message: string, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  };

  const showWarning = (message: string, options = {}) => {
    toast.warning(message, { ...defaultOptions, ...options });
  };

  return (
    <ToastContext.Provider
      value={{ showSuccess, showError, showInfo, showWarning }}
    >
      {children}
    </ToastContext.Provider>
  );
}
