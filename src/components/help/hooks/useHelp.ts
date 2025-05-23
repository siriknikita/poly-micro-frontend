import { useState } from 'react';
import { useToast } from '@/context/useToast';
import { QuestionSubmission } from '../types';

export const useHelp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const submitQuestion = async (question: QuestionSubmission): Promise<void> => {
    setIsSubmitting(true);

    try {
      // In a real application, this would be an API call to submit the question
      // For demo purposes, we're simulating a successful submission after a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log the question to console for demo purposes
      console.log('Question submitted:', question);

      showSuccess('Your question has been submitted successfully!');
      return Promise.resolve();
    } catch (error) {
      console.error('Error submitting question:', error);
      showError('Failed to submit your question. Please try again.');
      return Promise.reject(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuestion,
    isSubmitting,
  };
};
