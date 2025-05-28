import React, { useEffect, useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { useGuidance } from '@/context/GuidanceContext';
import { createPortal } from 'react-dom';

interface GuidanceStepProps {
  title: string;
  description: string;
  image?: string;
  position: 'left' | 'right' | 'top' | 'bottom' | 'center';
  targetSelector: string;
  elementId: string;
}

const guidanceSteps: GuidanceStepProps[] = [
  {
    title: 'Welcome to Poly Micro Manager!',
    description:
      'This quick tour will help you understand how to use the application effectively. You can replay this guide anytime from your user menu.',
    position: 'center',
    targetSelector: 'body',
    elementId: 'welcome',
  },
  {
    title: 'Navigation Sidebar',
    description:
      'Use the sidebar to navigate between different sections of the application: Dashboard, Microservices, CI/CD Pipeline, and Automated Testing.',
    position: 'right',
    targetSelector: '.sidebar-tabs',
    elementId: 'sidebar-navigation',
  },
  {
    title: 'Project Selection',
    description:
      'Select your project from the dropdown in the top bar to view and manage its microservices.',
    position: 'bottom',
    targetSelector: '.project-selector',
    elementId: 'project-selector',
  },
  {
    title: 'Microservices Management',
    description:
      'Monitor and manage your microservices from this panel. You can see their status, health, and performance metrics.',
    position: 'left',
    targetSelector: '.services-panel',
    elementId: 'services-panel',
  },
  {
    title: "You're all set!",
    description:
      'You\'re now ready to use Poly Micro Manager. If you need to see this guide again, click on your profile at the bottom of the sidebar and select "Show Guide".',
    position: 'center',
    targetSelector: 'body',
    elementId: 'completion',
  },
];

// Helper component to add tooltip triggers to elements
export const GuidanceTrigger: React.FC = () => {
  const { showGuidance } = useGuidance();
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);

  useEffect(() => {
    // Check if this is a first-time user
    const firstTimeUserValue = localStorage.getItem('isFirstTimeUser');
    if (firstTimeUserValue) {
      setIsFirstTimeUser(JSON.parse(firstTimeUserValue));
    }

    // Add data attributes to elements that need tooltips
    guidanceSteps.forEach((step) => {
      if (step.targetSelector !== 'body') {
        const elements = document.querySelectorAll(step.targetSelector);
        elements.forEach((element) => {
          element.setAttribute('data-guidance-id', step.elementId);

          // For first-time users, we'll add a small indicator
          if (isFirstTimeUser) {
            const indicator = document.createElement('div');
            indicator.className = 'guidance-indicator';
            indicator.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
            indicator.style.cssText =
              'position: absolute; top: -5px; right: -5px; background: #6366f1; color: white; border-radius: 50%; padding: 2px; cursor: pointer; z-index: 50;';

            // Position the indicator relative to the element
            const elementPosition = window.getComputedStyle(element).position;
            if (elementPosition === 'static') {
              (element as HTMLElement).style.position = 'relative';
            }

            indicator.addEventListener('click', (e) => {
              e.stopPropagation();
              showGuidance();
            });

            element.appendChild(indicator);
          }
        });
      }
    });

    // Add CSS for highlighted elements and tooltips with dark mode support
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

      .guidance-indicator {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #6366f1;
        color: white;
        border-radius: 50%;
        padding: 2px;
        cursor: pointer;
        z-index: 50;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease;
      }

      .guidance-indicator:hover {
        transform: scale(1.2);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [showGuidance, isFirstTimeUser]);

  return null;
};

export const GuidanceOverlay: React.FC = () => {
  const {
    isGuidanceVisible,
    hideGuidance,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    completeGuidance,
  } = useGuidance();

  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode
  useEffect(() => {
    const detectTheme = () => {
      // Check for dark mode in HTML element or via media query
      const isDark =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    detectTheme();

    // Set up an observer to detect theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Also listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);
  const currentGuidance = guidanceSteps[currentStep];

  useEffect(() => {
    // Handle escape key to close guidance
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideGuidance();
      }
    };

    if (isGuidanceVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGuidanceVisible, hideGuidance]);

  useEffect(() => {
    // Highlight target element and position tooltip
    if (isGuidanceVisible && currentGuidance.targetSelector) {
      const targetElement = document.querySelector(
        currentGuidance.targetSelector,
      );
      if (targetElement) {
        targetElement.classList.add('guidance-highlight');

        // Calculate position for the tooltip
        const rect = targetElement.getBoundingClientRect();
        const tooltipWidth = 320; // Width of our tooltip
        const tooltipHeight = 180; // Approximate height of tooltip
        const padding = 15; // Padding between element and tooltip
        const position = { top: 0, left: 0 };

        // Position based on the specified position
        switch (currentGuidance.position) {
          case 'left':
            position.top = rect.top + rect.height / 2 - tooltipHeight / 2;
            position.left = Math.max(
              padding,
              rect.left - tooltipWidth - padding,
            );

            // If would go off screen left, flip to right
            if (position.left < padding) {
              position.left = rect.right + padding;
            }
            break;

          case 'right':
            position.top = rect.top + rect.height / 2 - tooltipHeight / 2;
            position.left = rect.right + padding;

            // If would go off screen right, flip to left
            if (position.left + tooltipWidth > window.innerWidth - padding) {
              position.left = Math.max(
                padding,
                rect.left - tooltipWidth - padding,
              );
            }
            break;

          case 'top':
            position.top = Math.max(
              padding,
              rect.top - tooltipHeight - padding,
            );
            position.left = rect.left + rect.width / 2 - tooltipWidth / 2;

            // If would go off screen top, flip to bottom
            if (position.top < padding) {
              position.top = rect.bottom + padding;
            }
            break;

          case 'bottom':
            position.top = rect.bottom + padding;
            position.left = rect.left + rect.width / 2 - tooltipWidth / 2;

            // If would go off screen bottom, flip to top
            if (position.top + tooltipHeight > window.innerHeight - padding) {
              position.top = Math.max(
                padding,
                rect.top - tooltipHeight - padding,
              );
            }
            break;

          case 'center':
          default:
            position.top = window.innerHeight / 2 - tooltipHeight / 2;
            position.left = window.innerWidth / 2 - tooltipWidth / 2;
            break;
        }

        // Ensure tooltip stays within viewport bounds
        position.left = Math.max(
          padding,
          Math.min(window.innerWidth - tooltipWidth - padding, position.left),
        );
        position.top = Math.max(
          padding,
          Math.min(window.innerHeight - tooltipHeight - padding, position.top),
        );

        setTooltipPosition(position);
      }

      return () => {
        if (targetElement) {
          targetElement.classList.remove('guidance-highlight');
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, currentGuidance.targetSelector, isGuidanceVisible]);

  if (!isGuidanceVisible) {
    return null;
  }

  const handleComplete = () => {
    completeGuidance();
  };

  // Use createPortal to render the tooltip at the document level
  return createPortal(
    <div
      className={`guidance-tooltip ${isDarkMode ? 'dark' : ''}`}
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
      }}
    >
      <button
        onClick={hideGuidance}
        className={`absolute top-2 right-2 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
      >
        <X size={16} />
      </button>

      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">{currentGuidance.title}</h2>
        <p className="text-sm">{currentGuidance.description}</p>
      </div>

      {currentGuidance.image && (
        <div className="mb-4">
          <img
            src={currentGuidance.image}
            alt={currentGuidance.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

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
              <ArrowLeft
                size={12}
                className="mr-1"
              />
              Prev
            </button>
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center justify-center px-2 py-1 bg-indigo-600 border border-transparent rounded-md text-xs font-medium text-white hover:bg-indigo-700"
            >
              Next
              <ArrowRight
                size={12}
                className="ml-1"
              />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center justify-center px-2 py-1 bg-green-600 border border-transparent rounded-md text-xs font-medium text-white hover:bg-green-700"
            >
              Done
              <CheckCircle
                size={12}
                className="ml-1"
              />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

// Export a Help Button component that can be used to trigger the guidance manually
export const HelpButton: React.FC = () => {
  const { showGuidance } = useGuidance();
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
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', detectTheme);
    };
  }, []);

  return (
    <button
      onClick={showGuidance}
      className={`flex items-center justify-center p-2 text-white rounded-full shadow-lg transition-colors ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      aria-label="Show guidance"
    >
      <HelpCircle size={20} />
    </button>
  );
};
