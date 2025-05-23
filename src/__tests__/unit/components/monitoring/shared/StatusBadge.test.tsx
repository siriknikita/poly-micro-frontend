import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/monitoring/shared/StatusBadge';
import { CLASSES_BY_SEVERITY } from '@/helpers/constants';

describe('StatusBadge', () => {
  it('should render the status text', () => {
    render(<StatusBadge status="Online" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });

  it('should use correct styling for known severity levels', () => {
    render(<StatusBadge status="info" />);
    const badge = screen.getByText('INFO');

    // Check that the info severity classes are applied
    const infoClasses = CLASSES_BY_SEVERITY.info.split(' ');
    infoClasses.forEach((className: string) => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply the correct severity classes', () => {
    render(<StatusBadge status="error" />);
    const badge = screen.getByText('ERROR');

    // Check that the error severity classes are applied
    const errorClasses = CLASSES_BY_SEVERITY.error.split(' ');
    errorClasses.forEach((className: string) => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply additional className if provided', () => {
    const customClass = 'custom-test-class';
    render(<StatusBadge status="warn" className={customClass} />);
    const badge = screen.getByText('WARN');

    expect(badge).toHaveClass(customClass);
  });

  it('should apply base classes to all badges', () => {
    render(<StatusBadge status="success" />);
    const badge = screen.getByText('success');

    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    const baseClassList = baseClasses.split(' ');

    baseClassList.forEach((className) => {
      expect(badge).toHaveClass(className);
    });
  });

  it('should apply all severity types correctly', () => {
    const { rerender } = render(<StatusBadge status="debug" />);
    let badge = screen.getByText('DEBUG');
    expect(badge).toHaveClass(...CLASSES_BY_SEVERITY.debug.split(' '));

    rerender(<StatusBadge status="warn" />);
    badge = screen.getByText('WARN');
    expect(badge).toHaveClass(...CLASSES_BY_SEVERITY.warn.split(' '));

    rerender(<StatusBadge status="error" />);
    badge = screen.getByText('ERROR');
    expect(badge).toHaveClass(...CLASSES_BY_SEVERITY.error.split(' '));

    rerender(<StatusBadge status="info" />);
    badge = screen.getByText('INFO');
    expect(badge).toHaveClass(...CLASSES_BY_SEVERITY.info.split(' '));
  });
});
