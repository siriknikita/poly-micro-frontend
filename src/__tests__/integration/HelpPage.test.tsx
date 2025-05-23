import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import { HelpPage } from '@/components/help/HelpPage';
import { useToast } from '@/context/useToast';

// Mock the useToast hook
vi.mock('@/context/useToast', () => ({
  useToast: vi.fn(),
}));

describe('HelpPage Integration', () => {
  const mockShowSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock implementation for useToast
    (useToast as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: vi.fn(),
    });

    // Mock console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('allows users to search for FAQs and view answers', async () => {
    const { user } = render(<HelpPage />);

    // Search for a specific FAQ
    await user.type(screen.getByTestId('help-search-input'), 'microservice');

    // FAQ about microservices should be visible
    expect(screen.getByText('How do I add a new microservice to my project?')).toBeInTheDocument();

    // FAQ from other categories should not be visible
    expect(screen.queryByText('How do I change my account password?')).not.toBeInTheDocument();

    // Click on a FAQ to expand it
    await user.click(screen.getByText('How do I add a new microservice to my project?'));

    // Answer should be visible
    expect(
      screen.getByText(/Navigate to the Microservices tab, click the "Add Service" button/),
    ).toBeInTheDocument();
  });

  it("allows users to submit a question when FAQs don't help", async () => {
    const { user } = render(<HelpPage />);

    // Fill in the question form
    await user.type(screen.getByTestId('question-name-input'), 'Test User');
    await user.type(screen.getByTestId('question-email-input'), 'test@example.com');
    await user.selectOptions(screen.getByTestId('question-category-select'), 'feature');
    await user.type(
      screen.getByTestId('question-text-input'),
      'I would like to request a feature to export all microservice logs at once.',
    );

    // Submit the form
    await user.click(screen.getByTestId('submit-question-button'));

    // Wait for submission to complete
    await waitFor(() => {
      // Success message should be shown
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Your question has been submitted successfully!',
      );

      // Thank you message should be displayed
      expect(screen.getByText('Thank You!')).toBeInTheDocument();
      expect(
        screen.getByText(
          "Your question has been submitted successfully. We'll get back to you as soon as possible.",
        ),
      ).toBeInTheDocument();
    });

    // Question should be logged
    expect(console.log).toHaveBeenCalledWith(
      'Question submitted:',
      expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        category: 'feature',
        question: 'I would like to request a feature to export all microservice logs at once.',
      }),
    );
  });

  it('shows no results and ask question form when search has no matches', async () => {
    const { user } = render(<HelpPage />);

    // Search for a term that doesn't exist in any FAQ
    await user.type(screen.getByTestId('help-search-input'), 'nonexistentterm123');

    // No results message should be shown
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(
      screen.getByText(
        "We couldn't find any FAQs matching your search. Try a different search term or ask your question below.",
      ),
    ).toBeInTheDocument();

    // Ask question form should still be available
    expect(screen.getByTestId('question-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('question-email-input')).toBeInTheDocument();
    expect(screen.getByTestId('question-category-select')).toBeInTheDocument();
    expect(screen.getByTestId('question-text-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-question-button')).toBeInTheDocument();
  });
});
