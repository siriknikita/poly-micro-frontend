import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { NavigationControls } from '@/components/testing/components';

describe('NavigationControls Component', () => {
  it('renders navigation buttons when showControls is true', async () => {
    const handleNavigate = vi.fn();
    const { user } = render(
      <NavigationControls
        onNavigate={handleNavigate}
        previousItemName="Test Item 1"
        nextItemName="Test Item 3"
        showControls={true}
      />,
    );

    // Check if buttons are rendered
    const upButton = screen.getByLabelText(/Navigate to previous item: Test Item 1/i);
    const downButton = screen.getByLabelText(/Navigate to next item: Test Item 3/i);

    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();

    // Check if tooltips are correct
    expect(upButton).toHaveAttribute('title', 'Previous: Test Item 1');
    expect(downButton).toHaveAttribute('title', 'Next: Test Item 3');

    // Test navigation
    await user.click(upButton);
    expect(handleNavigate).toHaveBeenCalledWith('up');

    await user.click(downButton);
    expect(handleNavigate).toHaveBeenCalledWith('down');
  });

  it('does not render when showControls is false', () => {
    render(
      <NavigationControls
        onNavigate={() => {}}
        previousItemName="Test Item 1"
        nextItemName="Test Item 3"
        showControls={false}
      />,
    );

    // Check that no buttons are rendered
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onNavigate with correct direction when buttons are clicked', async () => {
    const handleNavigate = vi.fn();
    const { user } = render(
      <NavigationControls
        onNavigate={handleNavigate}
        previousItemName="Previous Test"
        nextItemName="Next Test"
        showControls={true}
      />,
    );

    // Find buttons by their accessible names
    const upButton = screen.getByLabelText(/Navigate to previous item/i);
    const downButton = screen.getByLabelText(/Navigate to next item/i);

    // Test up navigation
    await user.click(upButton);
    expect(handleNavigate).toHaveBeenCalledWith('up');

    // Test down navigation
    await user.click(downButton);
    expect(handleNavigate).toHaveBeenCalledWith('down');

    // Verify call count
    expect(handleNavigate).toHaveBeenCalledTimes(2);
  });

  it('renders with correct button icons', () => {
    render(
      <NavigationControls
        onNavigate={() => {}}
        previousItemName="Previous Test"
        nextItemName="Next Test"
        showControls={true}
      />,
    );

    // Verify the buttons have the correct icons by checking the container structure
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);

    // The buttons should contain SVG icons
    buttons.forEach((button) => {
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });
});
