import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../../utils/test-utils';
import { AskQuestionForm } from '@/components/help/AskQuestionForm';

describe('AskQuestionForm Component', () => {
  const mockSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders the form with all fields', () => {
    render(<AskQuestionForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Check for form fields
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Question')).toBeInTheDocument();
    expect(screen.getByText('Submit Question')).toBeInTheDocument();
  });

  it('validates form fields and shows error messages', async () => {
    const { user } = render(<AskQuestionForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Try to submit without filling in any fields
    await user.click(screen.getByText('Submit Question'));

    // Error messages should be displayed
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Please select a category')).toBeInTheDocument();
    expect(screen.getByText('Question is required')).toBeInTheDocument();

    // Form should not be submitted
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    // Mock the validateForm function to directly test email validation
    const { user } = render(<AskQuestionForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Fill in all required fields with valid data
    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.selectOptions(screen.getByLabelText('Category'), 'general');
    await user.type(
      screen.getByLabelText('Your Question'),
      'This is a test question that is long enough.',
    );

    // Fill in invalid email last
    const emailInput = screen.getByLabelText('Email');
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');

    // Try to submit the form - this should trigger validation
    await user.click(screen.getByTestId('submit-question-button'));

    // Form should not be submitted with invalid email
    expect(mockSubmit).not.toHaveBeenCalled();

    // Now fix the email and try again
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@email.com');

    // Submit again
    await user.click(screen.getByTestId('submit-question-button'));

    // This time the form should be submitted
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'valid@email.com',
      category: 'general',
      question: 'This is a test question that is long enough.',
    });
  });

  it('validates question length', async () => {
    const { user } = render(<AskQuestionForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Fill in required fields except question
    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.selectOptions(screen.getByLabelText('Category'), 'general');

    // Fill in too short question
    await user.type(screen.getByLabelText('Your Question'), 'Short');

    // Try to submit
    await user.click(screen.getByText('Submit Question'));

    // Question length error message should be displayed
    expect(screen.getByText('Question must be at least 10 characters long')).toBeInTheDocument();

    // Form should not be submitted
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits the form when all fields are valid', async () => {
    const { user } = render(<AskQuestionForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Fill in all required fields
    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.selectOptions(screen.getByLabelText('Category'), 'general');
    await user.type(
      screen.getByLabelText('Your Question'),
      'This is a test question that is long enough to pass validation.',
    );

    // Submit the form
    await user.click(screen.getByText('Submit Question'));

    // Form should be submitted with correct data
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      category: 'general',
      question: 'This is a test question that is long enough to pass validation.',
    });
  });

  it('disables the submit button when isSubmitting is true', () => {
    render(<AskQuestionForm onSubmit={mockSubmit} isSubmitting={true} />);

    // Submit button should be disabled
    expect(screen.getByTestId('submit-question-button')).toBeDisabled();
  });

  it('shows success message after form submission', async () => {
    const { user } = render(<AskQuestionForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Fill in all required fields
    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.selectOptions(screen.getByLabelText('Category'), 'general');
    await user.type(
      screen.getByLabelText('Your Question'),
      'This is a test question that is long enough to pass validation.',
    );

    // Submit the form
    await user.click(screen.getByText('Submit Question'));

    // Success message should be displayed
    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
      expect(
        screen.getByText(
          "Your question has been submitted successfully. We'll get back to you as soon as possible.",
        ),
      ).toBeInTheDocument();
    });

    // Ask Another Question button should be visible
    expect(screen.getByText('Ask Another Question')).toBeInTheDocument();
  });

  it('allows asking another question after submission', async () => {
    const { user } = render(<AskQuestionForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Fill in all required fields
    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.selectOptions(screen.getByLabelText('Category'), 'general');
    await user.type(
      screen.getByLabelText('Your Question'),
      'This is a test question that is long enough to pass validation.',
    );

    // Submit the form
    await user.click(screen.getByText('Submit Question'));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
    });

    // Click on Ask Another Question button
    await user.click(screen.getByText('Ask Another Question'));

    // Form should be visible again
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Question')).toBeInTheDocument();
    expect(screen.getByText('Submit Question')).toBeInTheDocument();
  });
});
