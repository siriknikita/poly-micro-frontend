import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { TestItemComponent } from '@/components/testing/components/TestItem';
import { TestItem } from '@/types';

describe('TestItemComponent', () => {
  // Mock test items
  const functionItem: TestItem = {
    id: 'function1',
    name: 'authenticateUser',
    type: 'function',
    children: [
      {
        id: 'test1',
        name: 'Test Valid Login',
        type: 'test-case',
      },
      {
        id: 'test2',
        name: 'Test Invalid Credentials',
        type: 'test-case',
      },
    ],
  };

  const testCaseItem: TestItem = {
    id: 'test1',
    name: 'Test Valid Login',
    type: 'test-case',
  };

  // Mock callbacks
  const mockToggleExpand = vi.fn();
  const mockRunTest = vi.fn();
  const mockGenerateTest = vi.fn();

  it('renders function item correctly', () => {
    render(
      <TestItemComponent
        item={functionItem}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
      />,
    );

    // Check name is rendered
    expect(screen.getByText('authenticateUser')).toBeInTheDocument();

    // Check expand button is rendered (since it has children)
    expect(
      screen.getByRole('expandButton', { name: 'Expand' }),
    ).toBeInTheDocument();

    // Check action buttons are rendered for function type
    expect(
      screen.getByRole('generateButton', {
        name: 'Generate test for authenticateUser',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('runButton', { name: 'Run test for authenticateUser' }),
    ).toBeInTheDocument();
  });

  it('renders test case item correctly', () => {
    render(
      <TestItemComponent
        item={testCaseItem}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
      />,
    );

    // Check name is rendered
    expect(screen.getByText('Test Valid Login')).toBeInTheDocument();

    // Test case doesn't have children, so no expand button
    expect(
      screen.queryByRole('expandButton', { name: 'Expand' }),
    ).not.toBeInTheDocument();

    // Test case doesn't have action buttons
    expect(
      screen.queryByRole('generateButton', { name: /Generate test/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('runButton', { name: /Run test/i }),
    ).not.toBeInTheDocument();
  });

  it('calls onToggleExpand when expand button is clicked', async () => {
    const { user } = render(
      <TestItemComponent
        item={functionItem}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
      />,
    );

    // Click expand button
    await user.click(screen.getByRole('expandButton', { name: 'Expand' }));

    // Check onToggleExpand was called with correct id
    expect(mockToggleExpand).toHaveBeenCalledWith('function1');
  });

  it('calls onRunTest when run button is clicked', async () => {
    const { user } = render(
      <TestItemComponent
        item={functionItem}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
      />,
    );

    // Click run button
    await user.click(
      screen.getByRole('runButton', { name: 'Run test for authenticateUser' }),
    );

    // Check onRunTest was called with correct item
    expect(mockRunTest).toHaveBeenCalledWith(functionItem);
  });

  it('calls onGenerateTest when generate button is clicked', async () => {
    const { user } = render(
      <TestItemComponent
        item={functionItem}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
      />,
    );

    // Click generate button
    await user.click(
      screen.getByRole('generateButton', {
        name: 'Generate test for authenticateUser',
      }),
    );

    // Check onGenerateTest was called with correct item
    expect(mockGenerateTest).toHaveBeenCalledWith(functionItem);
  });

  it('shows test result when showResults is true and result is provided', () => {
    const testResult = 'Test result output';

    render(
      <TestItemComponent
        item={functionItem}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
        result={testResult}
        showResults={true}
      />,
    );

    // Check result is displayed
    expect(screen.getByText(testResult)).toBeInTheDocument();
  });

  it('does not show test result when showResults is false', () => {
    const testResult = 'Test result output';

    render(
      <TestItemComponent
        item={functionItem}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
        result={testResult}
        showResults={false}
      />,
    );

    // Check result is not displayed
    expect(screen.queryByText(testResult)).not.toBeInTheDocument();
  });

  it('changes icon when expanded', () => {
    const { rerender } = render(
      <TestItemComponent
        item={functionItem}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
      />,
    );

    // When not expanded, should show "Expand" button
    expect(
      screen.getByRole('expandButton', { name: 'Expand' }),
    ).toBeInTheDocument();

    // Rerender with isExpanded=true
    rerender(
      <TestItemComponent
        item={functionItem}
        isExpanded={true}
        onToggleExpand={mockToggleExpand}
        onRunTest={mockRunTest}
        onGenerateTest={mockGenerateTest}
      />,
    );

    // When expanded, should show "Collapse" button
    expect(
      screen.getByRole('collapseButton', { name: 'Collapse' }),
    ).toBeInTheDocument();
  });
});
