import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { QUESTION_CATEGORIES } from './constants/faqData';
import { QUESTION_TEMPLATES } from './constants/questionTemplates';
import { QuestionSubmission } from './types';
import { Dropdown } from '../shared/Dropdown';

interface AskQuestionFormProps {
  onSubmit: (question: QuestionSubmission) => Promise<void>;
  isSubmitting: boolean;
  username?: string;
  userEmail?: string;
}

export const AskQuestionForm: React.FC<AskQuestionFormProps> = ({
  onSubmit,
  isSubmitting,
  username,
  userEmail,
}) => {
  if (!username || !userEmail) {
    return null;
  }

  const [formData, setFormData] = useState<QuestionSubmission>({
    name: username,
    email: userEmail,
    category: '',
    question: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isManualSubmit, setIsManualSubmit] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Ensure we prevent the default form submission
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    // Only allow submission if the submit button was clicked
    if (!isManualSubmit) {
      console.log('Prevented automatic form submission');
      return;
    }
    
    // Reset the manual submit flag
    setIsManualSubmit(false);
    
    // Log submission attempt for debugging
    console.log('Form submission initiated by user');

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setFormData({
        name: username,
        email: userEmail,
        category: '',
        question: '',
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit question:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
          Thank You!
        </h3>
        <p className="text-green-600 dark:text-green-300 mb-4">
          Your question has been submitted successfully. We'll get back to you
          as soon as possible.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Ask Another Question
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white`}
            placeholder="Your name"
            data-testid="question-name-input"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white`}
            placeholder="your.email@example.com"
            data-testid="question-email-input"
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p
              className="mt-1 text-sm text-red-500"
              data-testid="email-error"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Category
        </label>
        <div
          className={errors.category ? 'border border-red-500 rounded-md' : ''}
        >
          <Dropdown
            buttonLabel={
              formData.category
                ? QUESTION_CATEGORIES.find((c) => c.id === formData.category)
                    ?.name || 'Select a category'
                : 'Select a category'
            }
            selectedOption={formData.category}
            sections={[
              {
                options: QUESTION_CATEGORIES.map((category) => ({
                  id: category.id,
                  label: category.name,
                  disabled: false,
                })),
                onSelect: (id: string) => {
                  // Prevent default behavior to ensure form doesn't submit
                  // Update category selection
                  handleChange({
                    target: { name: 'category', value: id },
                    preventDefault: () => {}, // Mock preventDefault to ensure no submission occurs
                  } as React.ChangeEvent<HTMLSelectElement>);
                  
                  // Apply template for the selected category after a short delay
                  // This prevents any potential race condition with form submission
                  setTimeout(() => {
                    if (QUESTION_TEMPLATES[id]) {
                      handleChange({
                        target: { name: 'question', value: QUESTION_TEMPLATES[id] },
                        preventDefault: () => {}, // Mock preventDefault to ensure no submission occurs
                      } as React.ChangeEvent<HTMLTextAreaElement>);
                    }
                  }, 0);
                },
              },
            ]}
            className="w-full"
            buttonClassName="py-3 text-base"
            testId="question-category-select"
          />
        </div>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Your Question
        </label>
        <textarea
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          rows={5}
          className={`w-full p-3 border ${errors.question ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white`}
          placeholder="Please describe your question in detail..."
          data-testid="question-text-input"
        />
        {errors.question && (
          <p className="mt-1 text-sm text-red-500">{errors.question}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-600"
          data-testid="submit-question-button"
          onClick={() => setIsManualSubmit(true)}
        >
          <span>Submit Question</span>
          <Send className="h-4 w-4 ml-2" />
        </button>
      </div>
    </form>
  );
};
