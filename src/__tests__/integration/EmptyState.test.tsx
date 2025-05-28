import { describe, it, expect } from 'vitest';
import { render, screen } from '@/__tests__/utils/test-utils.tsx';
import { EmptyState } from '@/components/testing';

describe('EmptyState Integration', () => {
  it('renders with default title and message', () => {
    render(<EmptyState />);

    expect(
      screen.getByText('No logs found for this microservice'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Try triggering a pipeline to generate logs.'),
    ).toBeInTheDocument();
  });

  it('renders with custom title and message', () => {
    render(
      <EmptyState
        message="No Tests Found"
        description="There are no tests available for this microservice."
      />,
    );

    expect(screen.getByText('No Tests Found')).toBeInTheDocument();
    expect(
      screen.getByText('There are no tests available for this microservice.'),
    ).toBeInTheDocument();
  });

  it('renders with an icon', () => {
    render(<EmptyState />);

    // Check for the presence of an icon (SVG)
    // This assumes your EmptyState renders an SVG icon
    expect(screen.getByTestId('empty-state-icon')).toBeInTheDocument();
  });

  it('renders with appropriate ARIA attributes for accessibility', () => {
    render(<EmptyState />);

    // Check the container has appropriate role
    expect(screen.getByTestId('empty-state-container')).toHaveAttribute(
      'role',
      'status',
    );

    // Check if it's properly labeled
    expect(screen.getByTestId('empty-state-container')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });
});
