import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { IconButton } from '../../../../components/testing/components/IconButton';
import { X } from 'lucide-react';

describe('IconButton Component', () => {
  it('renders correctly with icon and text', () => {
    render(<IconButton icon={<X data-testid="x-icon" />} label="Close" />);

    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const mockOnClick = vi.fn();
    const { user } = render(<IconButton icon={<X />} onClick={mockOnClick} label="Close" />);

    await user.click(screen.getByRole('button'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom class names', () => {
    render(<IconButton icon={<X />} onClick={() => {}} label="Close" className="test-class" />);

    expect(screen.getByRole('button')).toHaveClass('test-class');
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<IconButton icon={<X />} onClick={() => {}} label="Close" disabled={true} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders only icon when label is not provided', () => {
    render(<IconButton icon={<X data-testid="x-icon" />} onClick={() => {}} />);

    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<IconButton icon={<X />} onClick={() => {}} variant="primary" />);

    // Should have primary variant class
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');

    // Rerender with outline variant
    rerender(<IconButton icon={<X />} onClick={() => {}} variant="outline" />);
    expect(screen.getByRole('button')).toHaveClass('text-gray-500');

    // Rerender with active variant
    rerender(<IconButton icon={<X />} onClick={() => {}} variant="active" />);
    expect(screen.getByRole('button')).toHaveClass('bg-indigo-100');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<IconButton icon={<X />} onClick={() => {}} size="sm" />);

    // Small size
    expect(screen.getByRole('button')).toHaveClass('p-2');

    // Medium size
    rerender(<IconButton icon={<X />} onClick={() => {}} size="md" />);
    expect(screen.getByRole('button')).toHaveClass('px-4 py-2');

    // Large size
    rerender(<IconButton icon={<X />} onClick={() => {}} size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('px-6 py-3');
  });
});
