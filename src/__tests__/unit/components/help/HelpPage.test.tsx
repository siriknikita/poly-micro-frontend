import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { HelpPage } from '@/components/help/HelpPage';
import * as useHelpModule from '@/components/help/hooks/useHelp';

describe('HelpPage Component', () => {
  it('renders the help page with search and FAQ sections', () => {
    render(<HelpPage />);

    // Check for main elements
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for help topics...')).toBeInTheDocument();
    expect(screen.getByText("Didn't find what you're looking for?")).toBeInTheDocument();

    // Check for FAQ categories
    expect(screen.getByText('General Questions')).toBeInTheDocument();
    expect(screen.getByText('Microservices')).toBeInTheDocument();
    expect(screen.getByText('CI/CD Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Automated Testing')).toBeInTheDocument();
    // Use getAllByText for text that appears multiple times and check the first one
    expect(screen.getAllByText('Account & Settings')[0]).toBeInTheDocument();
  });

  it('filters FAQs when searching', async () => {
    const { user } = render(<HelpPage />);

    // Search for a specific term
    const searchInput = screen.getByPlaceholderText('Search for help topics...');
    await user.type(searchInput, 'password');

    // Only password-related FAQs should be visible
    expect(screen.getByText('How do I change my account password?')).toBeInTheDocument();

    // Other FAQs should not be visible
    expect(screen.queryByText('What is Poly Micro Manager?')).not.toBeInTheDocument();

    // Clear search to show all FAQs again
    await user.clear(searchInput);
    expect(screen.getByText('What is Poly Micro Manager?')).toBeInTheDocument();
  });

  it('shows no results message when search has no matches', async () => {
    const { user } = render(<HelpPage />);

    // Search for a term that doesn't exist in any FAQ
    const searchInput = screen.getByPlaceholderText('Search for help topics...');
    await user.type(searchInput, 'nonexistentterm123');

    // No results message should be shown
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(
      screen.getByText(
        "We couldn't find any FAQs matching your search. Try a different search term or ask your question below.",
      ),
    ).toBeInTheDocument();
  });

  it('integrates with the useHelp hook', () => {
    // Mock the useHelp hook
    const mockSubmitQuestion = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(useHelpModule, 'useHelp').mockReturnValue({
      submitQuestion: mockSubmitQuestion,
      isSubmitting: false,
    });

    render(<HelpPage />);

    // Verify the hook is being used
    expect(useHelpModule.useHelp).toHaveBeenCalled();
  });
});
