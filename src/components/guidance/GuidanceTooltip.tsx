import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useGuidance, OnboardingStep } from '@/context/GuidanceContext';
import { createPortal } from 'react-dom';

interface TooltipPosition {
  top: number;
  left: number;
}

interface GuidanceTooltipProps {
  step: OnboardingStep;
  title: string;
  description: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactNode;
  className?: string;
}

export const GuidanceTooltip: React.FC<GuidanceTooltipProps> = ({
  step,
  title,
  description,
  position,
  children,
  className = '',
}) => {
  const {
    shouldShowTooltipForStep,
    nextStep,
    prevStep,
    currentStep,
    totalSteps,
    completeGuidance,
  } = useGuidance();

  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  // Detect dark mode
  useEffect(() => {
    const detectTheme = () => {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    detectTheme();

    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);

  // Calculate tooltip position when the target element changes size or position
  useEffect(() => {
    if (!shouldShowTooltipForStep(step) || !targetRef.current) return;

    const calculatePosition = () => {
      if (!targetRef.current) return;

      const targetRect = targetRef.current.getBoundingClientRect();
      const tooltipWidth = 320; // Width of our tooltip
      const tooltipHeight = 180; // Approximate height of tooltip
      const padding = 15; // Padding between element and tooltip
      const newPosition = { top: 0, left: 0 };

      // Position based on the specified position
      switch (position) {
        case 'left':
          newPosition.top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
          newPosition.left = Math.max(padding, targetRect.left - tooltipWidth - padding);

          // If would go off screen left, flip to right
          if (newPosition.left < padding) {
            newPosition.left = targetRect.right + padding;
          }
          break;

        case 'right':
          newPosition.top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
          newPosition.left = targetRect.right + padding;

          // If would go off screen right, flip to left
          if (newPosition.left + tooltipWidth > window.innerWidth - padding) {
            newPosition.left = Math.max(padding, targetRect.left - tooltipWidth - padding);
          }
          break;

        case 'top':
          newPosition.top = Math.max(padding, targetRect.top - tooltipHeight - padding);
          newPosition.left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

          // If would go off screen top, flip to bottom
          if (newPosition.top < padding) {
            newPosition.top = targetRect.bottom + padding;
          }
          break;

        case 'bottom':
          newPosition.top = targetRect.bottom + padding;
          newPosition.left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;

          // If would go off screen bottom, flip to top
          if (newPosition.top + tooltipHeight > window.innerHeight - padding) {
            newPosition.top = Math.max(padding, targetRect.top - tooltipHeight - padding);
          }
          break;
      }

      // Ensure tooltip stays within viewport bounds
      newPosition.left = Math.max(
        padding,
        Math.min(window.innerWidth - tooltipWidth - padding, newPosition.left),
      );
      newPosition.top = Math.max(
        padding,
        Math.min(window.innerHeight - tooltipHeight - padding, newPosition.top),
      );

      setTooltipPosition(newPosition);
    };

    calculatePosition();

    // Recalculate on resize and scroll
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    // Create a ResizeObserver to detect size changes of the target element
    const resizeObserver = new ResizeObserver(calculatePosition);
    if (targetRef.current) {
      resizeObserver.observe(targetRef.current);
    }

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
      resizeObserver.disconnect();
    };
  }, [shouldShowTooltipForStep, step, position]);

  // Add CSS for tooltips
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .guidance-highlight {
        position: relative;
        z-index: 1000;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4);
        border-radius: 4px;
      }
      
      .guidance-tooltip {
        position: absolute;
        z-index: 1001;
        background: white;
        color: #1f2937;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        padding: 16px;
        max-width: 320px;
        transition: all 0.2s ease-in-out;
      }

      .guidance-tooltip.dark {
        background: #1f2937;
        color: #f3f4f6;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }

      .guidance-tooltip h2 {
        color: #111827;
        margin-bottom: 8px;
      }

      .guidance-tooltip.dark h2 {
        color: #f9fafb;
      }

      .guidance-tooltip p {
        color: #4b5563;
      }

      .guidance-tooltip.dark p {
        color: #d1d5db;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Highlight the target element when the tooltip is shown
  useEffect(() => {
    if (shouldShowTooltipForStep(step) && targetRef.current) {
      const element = targetRef.current;
      element.classList.add('guidance-highlight');

      return () => {
        if (element) {
          element.classList.remove('guidance-highlight');
        }
      };
    }
  }, [shouldShowTooltipForStep, step]);

  // Render tooltip if this step should be shown
  const renderTooltip = () => {
    if (!shouldShowTooltipForStep(step)) return null;

    return createPortal(
      <div
        className={`guidance-tooltip ${isDarkMode ? 'dark' : ''}`}
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">{title}</h2>
          <p className="text-sm">{description}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === currentStep
                    ? 'bg-indigo-600 dark:bg-indigo-400'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className={`flex items-center justify-center px-2 py-1 border rounded-md text-xs font-medium ${isDarkMode ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <ArrowLeft size={12} className="mr-1" />
                Prev
              </button>
            )}

            {currentStep < totalSteps - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center justify-center px-2 py-1 bg-indigo-600 border border-transparent rounded-md text-xs font-medium text-white hover:bg-indigo-700"
              >
                Next
                <ArrowRight size={12} className="ml-1" />
              </button>
            ) : (
              <button
                onClick={completeGuidance}
                className="flex items-center justify-center px-2 py-1 bg-green-600 border border-transparent rounded-md text-xs font-medium text-white hover:bg-green-700"
              >
                Done
                <CheckCircle size={12} className="ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <div ref={targetRef} className={className}>
      {children}
      {renderTooltip()}
    </div>
  );
};

// A welcome modal for the first step that appears in the center of the screen
export const WelcomeGuidance: React.FC = () => {
  const { shouldShowTooltipForStep, nextStep, hideGuidance } = useGuidance();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const detectTheme = () => {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    detectTheme();

    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);

  if (!shouldShowTooltipForStep(OnboardingStep.WELCOME)) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className={`max-w-md p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      >
        <button
          onClick={hideGuidance}
          className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Welcome to Poly Micro Manager!</h2>
        <p className="mb-6">
          This quick tour will help you understand how to use the application effectively. You can
          replay this guide anytime from your user menu.
        </p>

        <div className="flex justify-end">
          <button
            onClick={nextStep}
            className="flex items-center justify-center px-3 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
          >
            Start Tour
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// A completion modal for the last step
export const CompletionGuidance: React.FC = () => {
  const { shouldShowTooltipForStep, completeGuidance } = useGuidance();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const detectTheme = () => {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    detectTheme();

    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);

  if (!shouldShowTooltipForStep(OnboardingStep.COMPLETION)) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className={`max-w-md p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
      >
        <h2 className="text-2xl font-bold mb-4">You're all set!</h2>
        <p className="mb-6">
          You're now ready to use Poly Micro Manager. If you need to see this guide again, click on
          your profile at the bottom of the sidebar and select "Show Guide".
        </p>

        <div className="flex justify-end">
          <button
            onClick={completeGuidance}
            className="flex items-center justify-center px-3 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700"
          >
            Complete
            <CheckCircle size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
