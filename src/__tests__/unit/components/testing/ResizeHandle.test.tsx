import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { ResizeHandle } from '../../../../components/testing/components/ResizeHandle';

describe('ResizeHandle Component', () => {
  it('renders correctly', () => {
    render(<ResizeHandle onResizeStart={() => {}} />);

    const handle = screen.getByRole('separator');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('calls onMouseDown when mouse down event occurs', async () => {
    const handleMouseDown = vi.fn();
    const { user } = render(<ResizeHandle onResizeStart={handleMouseDown} />);

    await user.pointer({ target: screen.getByRole('separator'), keys: '[MouseLeft>]' });

    expect(handleMouseDown).toHaveBeenCalled();
  });

  it('renders with custom className when provided', () => {
    render(<ResizeHandle onResizeStart={() => {}} className="custom-class" />);

    expect(screen.getByRole('separator')).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<ResizeHandle onResizeStart={() => {}} />);

    const handle = screen.getByRole('separator');
    expect(handle).toHaveAttribute('aria-label', 'Resize panel');
    expect(handle).toHaveAttribute('aria-orientation', 'vertical');
  });
});
