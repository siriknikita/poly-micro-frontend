/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { User, db } from '@/db/db';
import { useNavigate } from 'react-router-dom';

interface GuidanceContextType {
  isGuidanceVisible: boolean;
  isOnboarding: boolean;
  showGuidance: () => void;
  hideGuidance: () => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  completeGuidance: () => Promise<void>;
  shouldShowTooltipForStep: (step: number) => boolean;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(
  undefined,
);

interface GuidanceProviderProps {
  children: React.ReactNode;
  currentUser: User | null;
}

export const TOTAL_GUIDANCE_STEPS = 11;

// Define step IDs for each onboarding step
export enum OnboardingStep {
  WELCOME = 0,
  SIDEBAR = 1,
  PROJECT_SELECTION = 2,
  SYSTEM_METRICS = 3,
  MICROSERVICES = 4,
  LOGS = 5,
  AUTOMATED_TESTING = 6,
  EXPAND_ALL_TESTS = 7,
  RUN_ALL_TESTS = 8,
  TEST_ASSISTANT = 9,
  COMPLETION = 10,
}

export const GuidanceProvider: React.FC<GuidanceProviderProps> = ({
  children,
  currentUser,
}) => {
  const navigate = useNavigate();
  const [isGuidanceVisible, setIsGuidanceVisible] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [needsScroll, setNeedsScroll] = useState<boolean>(false);

  // Check if user is in onboarding mode and handle pending guidance steps
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (currentUser && currentUser.id) {
        const isFirstTimeUser =
          currentUser.hasCompletedOnboarding === undefined;
        setIsOnboarding(isFirstTimeUser);

        // If user is in first-time onboarding, we'll store this information
        if (isFirstTimeUser) {
          localStorage.setItem('onboardingInProgress', 'true');
        }

        // Check URL parameters for guidance navigation
        const urlParams = new URLSearchParams(window.location.search);
        const stepParam = urlParams.get('step');

        if (stepParam) {
          console.log('Found step parameter in URL:', stepParam);
          const stepNumber = parseInt(stepParam, 10);
          if (
            !isNaN(stepNumber) &&
            stepNumber >= 0 &&
            stepNumber < TOTAL_GUIDANCE_STEPS
          ) {
            console.log('Applying step from URL parameter:', stepNumber);
            setCurrentStep(stepNumber);
            setIsGuidanceVisible(true);
            setIsOnboarding(true);

            // Clear the URL parameters without page reload
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
        } else {
          // Check for any pending guidance step from a previous navigation in sessionStorage
          const pendingStep = sessionStorage.getItem('pendingGuidanceStep');
          if (pendingStep) {
            console.log(
              'Found pending guidance step in sessionStorage:',
              pendingStep,
            );
            const stepNumber = parseInt(pendingStep, 10);
            if (
              !isNaN(stepNumber) &&
              stepNumber >= 0 &&
              stepNumber < TOTAL_GUIDANCE_STEPS
            ) {
              // Apply the pending step and ensure guidance is visible
              console.log('Applying pending step:', stepNumber);
              setCurrentStep(stepNumber);
              setIsGuidanceVisible(true);
              setIsOnboarding(true);
            }
            // Clear the pending step
            sessionStorage.removeItem('pendingGuidanceStep');
            console.log('Cleared pending guidance step from sessionStorage');
          }
        }
      }
    };

    checkOnboardingStatus();

    // Clean up onboarding status when component unmounts
    return () => {
      if (!currentUser?.hasCompletedOnboarding) {
        localStorage.removeItem('onboardingInProgress');
        sessionStorage.removeItem('pendingGuidanceStep');
        sessionStorage.removeItem('forceTestingTab');
      }
    };
  }, [currentUser]);

  // Ensure user authentication is preserved during navigation
  useEffect(() => {
    // This effect ensures that the current user is always preserved in localStorage
    // even during navigation between tabs
    if (currentUser && currentUser.id) {
      // Make sure the user is properly stored in localStorage
      const storedUserString = localStorage.getItem('currentUser');
      if (!storedUserString) {
        console.log('Restoring user authentication state');
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    }
  }, [currentUser]);

  const showGuidance = useCallback(() => {
    setCurrentStep(0);
    setIsGuidanceVisible(true);
    setIsOnboarding(true);
    localStorage.setItem('onboardingInProgress', 'true');
  }, []);

  const hideGuidance = useCallback(() => {
    setIsGuidanceVisible(false);
    // Note: We don't set isOnboarding to false here because the user might just be
    // temporarily dismissing the guidance but still in the onboarding process
  }, []);

  const nextStep = useCallback(() => {
    const newStep = Math.min(currentStep + 1, TOTAL_GUIDANCE_STEPS - 1);

    // Always store guidance state in localStorage to ensure it persists
    localStorage.setItem('guidanceCurrentStep', String(newStep));
    localStorage.setItem('guidanceVisible', 'true');
    localStorage.setItem('onboardingInProgress', 'true');

    // Handle special cases for different steps
    switch (currentStep) {
      case OnboardingStep.LOGS:
        if (newStep === OnboardingStep.AUTOMATED_TESTING) {
          // Update the current step first
          setCurrentStep(newStep);

          // Set flag to force testing tab on next render
          sessionStorage.setItem('forceTestingTab', 'true');
          sessionStorage.setItem('pendingGuidanceStep', String(newStep));

          // Force the guidance to be visible
          setIsGuidanceVisible(true);

          console.log(`Navigating to testing tab with step ${newStep}`);

          // Navigate to testing tab
          navigate('/testing', { replace: true });
          return; // Return early to prevent the immediate step change
        }
        break;

      case OnboardingStep.MICROSERVICES:
        if (newStep === OnboardingStep.LOGS) {
          // Set flag to scroll to bottom of page before showing logs tooltip
          setNeedsScroll(true);
          setTimeout(() => setCurrentStep(newStep), 500);
          return;
        }
        break;

      case OnboardingStep.AUTOMATED_TESTING:
        if (newStep === OnboardingStep.EXPAND_ALL_TESTS) {
          // When moving to the expand all tests step, we want to highlight the expand button
          setCurrentStep(newStep);
          return;
        }
        break;

      case OnboardingStep.EXPAND_ALL_TESTS:
        if (newStep === OnboardingStep.RUN_ALL_TESTS) {
          // When moving to the run all tests step, we want to highlight the run all button
          setCurrentStep(newStep);
          return;
        }
        break;

      case OnboardingStep.RUN_ALL_TESTS:
        if (newStep === OnboardingStep.TEST_ASSISTANT) {
          // When moving to the test assistant step, we want to highlight the test assistant button
          setCurrentStep(newStep);
          return;
        }
        break;
    }

    // If we didn't return early from any of the special cases, update the step
    setCurrentStep(newStep);
  }, [currentStep, navigate]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_GUIDANCE_STEPS) {
      setCurrentStep(step);
    }
  }, []);

  const completeGuidance = useCallback(async () => {
    if (currentUser && currentUser.id) {
      try {
        // Update user in database to mark onboarding as completed
        await db.users.update(currentUser.id, { hasCompletedOnboarding: true });

        // Update in localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.hasCompletedOnboarding = true;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }

        // Remove all guidance-related flags and storage
        localStorage.removeItem('onboardingInProgress');
        localStorage.removeItem('guidanceCurrentStep');
        localStorage.removeItem('guidanceVisible');
        sessionStorage.removeItem('forceTestingTab');
        sessionStorage.removeItem('pendingGuidanceStep');

        console.log('Guidance completed successfully');

        // Update state to hide guidance
        setIsGuidanceVisible(false);
        setIsOnboarding(false);
        setCurrentStep(0);
      } catch (error) {
        console.error('Failed to update onboarding status:', error);
      }
    } else {
      // Even if there's no current user, we should still clean up the guidance state
      localStorage.removeItem('onboardingInProgress');
      localStorage.removeItem('guidanceCurrentStep');
      localStorage.removeItem('guidanceVisible');
      sessionStorage.removeItem('forceTestingTab');
      sessionStorage.removeItem('pendingGuidanceStep');

      console.log('Guidance completed (without user)');

      // Update state to hide guidance
      setIsGuidanceVisible(false);
      setIsOnboarding(false);
      setCurrentStep(0);
    }
  }, [currentUser]);

  // Handle scrolling for specific steps
  useEffect(() => {
    if (needsScroll && currentStep === OnboardingStep.LOGS) {
      // Scroll to bottom of page to show logs
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
      setNeedsScroll(false);
    }
  }, [needsScroll, currentStep]);

  // Restore guidance state from localStorage if needed
  useEffect(() => {
    const storedStep = localStorage.getItem('guidanceCurrentStep');
    const storedVisible = localStorage.getItem('guidanceVisible');
    const forceTestingTab = sessionStorage.getItem('forceTestingTab');
    const pendingStep = sessionStorage.getItem('pendingGuidanceStep');

    // Special handling for testing tab
    if (window.location.pathname === '/testing') {
      console.log('On testing tab, checking guidance state...');

      // If we have a pending step or force flag, prioritize that
      if (forceTestingTab === 'true' || pendingStep) {
        const stepToUse = pendingStep
          ? parseInt(pendingStep, 10)
          : storedStep
            ? parseInt(storedStep, 10)
            : OnboardingStep.AUTOMATED_TESTING;

        console.log(
          `Force showing guidance for testing tab with step ${stepToUse}`,
        );

        // Force guidance to be visible with the appropriate step
        setCurrentStep(stepToUse);
        setIsGuidanceVisible(true);
        setIsOnboarding(true);

        // Clear the flags to prevent infinite loops
        sessionStorage.removeItem('forceTestingTab');
        sessionStorage.removeItem('pendingGuidanceStep');
      }
      // Otherwise, check if we should restore from localStorage
      else if (storedVisible === 'true' && storedStep) {
        const stepNumber = parseInt(storedStep, 10);
        if (
          !isNaN(stepNumber) &&
          stepNumber >= 0 &&
          stepNumber < TOTAL_GUIDANCE_STEPS
        ) {
          console.log(
            `Restoring guidance on testing tab with step ${stepNumber}`,
          );
          setCurrentStep(stepNumber);
          setIsGuidanceVisible(true);
          setIsOnboarding(true);
        }
      }
    }
    // Normal restoration for other tabs
    else if (!isGuidanceVisible && storedVisible === 'true' && storedStep) {
      console.log('Restoring guidance state from localStorage');
      const stepNumber = parseInt(storedStep, 10);
      if (
        !isNaN(stepNumber) &&
        stepNumber >= 0 &&
        stepNumber < TOTAL_GUIDANCE_STEPS
      ) {
        setCurrentStep(stepNumber);
        setIsGuidanceVisible(true);
        setIsOnboarding(true);
      }
    }
  }, [isGuidanceVisible]);

  // Helper function to check if a component should show a tooltip for the current step
  const shouldShowTooltipForStep = useCallback(
    (step: number) => {
      // Check both the current state and localStorage as a fallback
      const isVisible =
        isGuidanceVisible || localStorage.getItem('guidanceVisible') === 'true';
      const currentStepValue = currentStep;
      const storedStep = localStorage.getItem('guidanceCurrentStep');
      const storedStepValue = storedStep ? parseInt(storedStep, 10) : -1;

      // Special case for testing tab steps
      if (
        window.location.pathname === '/testing' &&
        (step === OnboardingStep.AUTOMATED_TESTING ||
          step === OnboardingStep.EXPAND_ALL_TESTS ||
          step === OnboardingStep.RUN_ALL_TESTS ||
          step === OnboardingStep.TEST_ASSISTANT)
      ) {
        // If we're on the testing page and the step is one of the testing-related steps,
        // be more lenient about showing the tooltip
        console.log(
          `Checking if should show tooltip for step ${step}, current: ${currentStepValue}, stored: ${storedStepValue}`,
        );

        return (
          isVisible && (currentStepValue === step || storedStepValue === step)
        );
      }

      // Normal case - strict equality check
      return isVisible && currentStepValue === step;
    },
    [isGuidanceVisible, currentStep],
  );

  return (
    <GuidanceContext.Provider
      value={{
        isGuidanceVisible,
        isOnboarding,
        showGuidance,
        hideGuidance,
        currentStep,
        totalSteps: TOTAL_GUIDANCE_STEPS,
        nextStep,
        prevStep,
        goToStep,
        completeGuidance,
        shouldShowTooltipForStep,
      }}
    >
      {children}
    </GuidanceContext.Provider>
  );
};

export const useGuidance = (): GuidanceContextType => {
  const context = useContext(GuidanceContext);
  if (context === undefined) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
};
