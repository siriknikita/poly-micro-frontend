import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { AIPromptModal } from '@/components/testing/AIPromptModal';

describe('AIPromptModal Component', () => {
  it('renders correctly when isOpen is true', () => {
    render(<AIPromptModal isOpen={true} onClose={() => {}} />);

    expect(screen.getByTestId('ai-prompt-modal')).toBeInTheDocument();
    expect(screen.getByText(/generate tests/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your prompt.../i)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<AIPromptModal isOpen={false} onClose={() => {}} />);

    expect(screen.queryByTestId('ai-prompt-modal')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const { user } = render(<AIPromptModal isOpen={true} onClose={handleClose} />);

    await user.click(screen.getByTestId('close-modal-button'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with prompt value when submit button is clicked', async () => {
    const handleSubmit = vi.fn();
    const { user } = render(
      <AIPromptModal isOpen={true} onClose={() => {}} onSubmit={handleSubmit} />,
    );

    const promptInput = screen.getByPlaceholderText(/enter your prompt.../i);
    await user.clear(promptInput);
    await user.type(promptInput, 'Create a test for login functionality');

    await user.click(screen.getByRole('submit-button'));

    expect(handleSubmit).toHaveBeenCalledWith('Create a test for login functionality');
  });

  it('disables submit button when input is empty', () => {
    render(<AIPromptModal isOpen={true} onClose={() => {}} />);

    // The button should be disabled initially since the prompt is empty
    expect(screen.getByRole('submit-button')).toBeDisabled();
  });

  it('enables submit button when input has text', async () => {
    const { user } = render(<AIPromptModal isOpen={true} onClose={() => {}} />);

    const promptInput = screen.getByPlaceholderText(/enter your prompt.../i);
    await user.type(promptInput, 'Test prompt');

    expect(screen.getByRole('submit-button')).toBeEnabled();
  });
});
