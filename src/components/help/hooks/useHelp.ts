import { useState } from 'react';
import { useToast } from '@/context/useToast';
import { QuestionSubmission } from '../types';
import { questionsApi } from '@/utils/api';

export const useHelp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const submitQuestion = async (
    question: QuestionSubmission,
  ): Promise<void> => {
    setIsSubmitting(true);

    try {
      // Transform the frontend QuestionSubmission to match our backend API
      const questionData = {
        title: question.category,
        content: question.question,
        user_email: question.email,
      };

      // Submit question to the backend API
      await questionsApi.submitQuestion(questionData);

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
