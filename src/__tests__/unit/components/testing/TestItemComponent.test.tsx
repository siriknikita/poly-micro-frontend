import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { TestItemComponent } from '@/components/testing/components/TestItem';
import { TestItem } from '@/types/testing';

// Mock test item data
const mockTestItem: TestItem = {
  id: 'test1',
  name: 'Test Item 1',
  type: 'function', // Using one of the valid types from the TestItem interface
};

describe('TestItemComponent', () => {
  it('renders test item with correct name', () => {
    render(
      <TestItemComponent
        item={mockTestItem}
        isExpanded={false}
        onToggleExpand={() => {}}
        onRunTest={() => {}}
        onGenerateTest={() => {}}
      />,
    );

    expect(screen.getByText('Test Item 1')).toBeInTheDocument();
  });

  it('expands when clicked', async () => {
    const mockToggleExpand = vi.fn();
    const testItemWithChildren: TestItem = {
      ...mockTestItem,
      children: [
        { id: 'child1', name: 'Child Test', type: 'function' as const },
      ],
    };

    const { user } = render(
      <TestItemComponent
        item={testItemWithChildren}
        isExpanded={false}
        onToggleExpand={mockToggleExpand}
        onRunTest={() => {}}
        onGenerateTest={() => {}}
      />,
    );

    // Click on the expand button which has the aria-label "Expand"
    await user.click(screen.getByLabelText('Expand'));

    expect(mockToggleExpand).toHaveBeenCalledWith('test1');
  });

  it('calls onRunTest when run button is clicked', async () => {
    const mockRunTest = vi.fn();
    const { user } = render(
      <TestItemComponent
        item={mockTestItem}
        isExpanded={true}
        onToggleExpand={() => {}}
        onRunTest={mockRunTest}
        onGenerateTest={() => {}}
      />,
    );

    await user.click(screen.getByRole('runButton', { name: /run test/i }));

    expect(mockRunTest).toHaveBeenCalledWith(mockTestItem);
  });

  it('calls onGenerateTest when generate button is clicked', async () => {
    const mockGenerateTest = vi.fn();
    const { user } = render(
      <TestItemComponent
        item={mockTestItem}
        isExpanded={true}
        onToggleExpand={() => {}}
        onRunTest={() => {}}
        onGenerateTest={mockGenerateTest}
      />,
    );

    await user.click(
      screen.getByRole('generateButton', { name: /generate test/i }),
    );

    expect(mockGenerateTest).toHaveBeenCalledWith(mockTestItem);
  });
});
