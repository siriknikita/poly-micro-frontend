// React is used implicitly in JSX
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ServiceFilterDialog } from '@/components/monitoring/shared/ServiceFilterDialog';
import { Service } from '@/types';
import { FilterGroup } from '@/components/monitoring/hooks/useServiceFilters';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon">+</span>,
  X: () => <span data-testid="x-icon">X</span>,
  ChevronDown: () => <span data-testid="chevron-down-icon">▼</span>,
}));

describe('ServiceFilterDialog', () => {
  // Test data
  const mockServices: Service[] = [
    { id: '1', name: 'API Gateway', status: 'Online', health: 'Healthy' },
    { id: '2', name: 'Auth Service', status: 'Online', health: 'Degraded' },
    { id: '3', name: 'Database Service', status: 'Offline', health: 'Error' },
  ];

  // Mock handler functions
  const mockHandlers = {
    onClose: jest.fn(),
    onApplyFilter: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <ServiceFilterDialog
        isOpen={false}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    expect(screen.queryByText('Add Filter')).not.toBeInTheDocument();
    expect(screen.queryByText('Filter Operator')).not.toBeInTheDocument();
  });

  it('should render with default values when opened for adding', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Check title
    expect(screen.getByText('Add Filter')).toBeInTheDocument();

    // Check operator dropdown
    const operatorDropdown = screen.getByTestId('filter-operator-dropdown');
    const operatorButton = within(operatorDropdown).getByRole('button');
    expect(operatorButton).toHaveTextContent('AND (All conditions must match)');

    // Check field and value selects
    const fieldDropdown = screen.getByTestId('field-dropdown-0');
    const fieldButton = within(fieldDropdown).getByRole('button');
    expect(fieldButton).toHaveTextContent('Status');

    const valueDropdown = screen.getByTestId('value-dropdown-0');
    const valueButton = within(valueDropdown).getByRole('button');
    expect(valueButton).toHaveTextContent('Select a value');

    // Check buttons
    expect(screen.getByText('Add condition')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Apply Filter')).toBeInTheDocument();
  });

  it('should render with initial values when opened for editing', () => {
    const initialFilter: FilterGroup = {
      operator: 'NOT',
      conditions: [{ field: 'health', value: 'Error' }],
    };

    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        initialFilterGroup={initialFilter}
        {...mockHandlers}
      />,
    );

    // Check title
    expect(screen.getByText('Edit Filter')).toBeInTheDocument();

    // Check that values are pre-selected
    const operatorDropdown = screen.getByTestId('filter-operator-dropdown');
    const operatorButton = within(operatorDropdown).getByRole('button');
    expect(operatorButton).toHaveTextContent(
      'NOT (None of the conditions should match)',
    );

    // Check that the field is pre-selected
    const fieldDropdown = screen.getByTestId('field-dropdown-0');
    const fieldButton = within(fieldDropdown).getByRole('button');
    expect(fieldButton).toHaveTextContent('Health');

    // Check that the value is pre-selected
    const valueDropdown = screen.getByTestId('value-dropdown-0');
    const valueButton = within(valueDropdown).getByRole('button');
    expect(valueButton).toHaveTextContent('Error');
  });

  it('should close when X button is clicked', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Click close button
    fireEvent.click(screen.getByLabelText('Close'));
    expect(mockHandlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('should add a new condition when Add condition button is clicked', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Initially should have one field dropdown
    expect(screen.getAllByTestId(/field-dropdown-\d+/)).toHaveLength(1);

    // Click add condition button
    fireEvent.click(screen.getByText('Add condition'));

    // Should now have two field dropdowns
    expect(screen.getAllByTestId(/field-dropdown-\d+/)).toHaveLength(2);
  });

  it('should remove a condition when remove button is clicked', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Add a second condition
    fireEvent.click(screen.getByText('Add condition'));
    expect(screen.getAllByTestId(/field-dropdown-\d+/)).toHaveLength(2);

    // Get all remove buttons by aria-label
    const removeButtons = screen.getAllByLabelText('Remove condition');
    expect(removeButtons).toHaveLength(2);

    // Click the second remove button
    fireEvent.click(removeButtons[1]);

    // Should now have one condition again
    expect(screen.getAllByTestId(/field-dropdown-\d+/)).toHaveLength(1);
  });

  it('should not remove the last condition', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Get the remove button by aria-label
    const removeButton = screen.getByLabelText('Remove condition');

    // Button should be disabled
    expect(removeButton).toBeDisabled();

    // Click the button anyway
    fireEvent.click(removeButton);

    // Should still have one condition
    expect(screen.getAllByTestId(/field-dropdown-\d+/)).toHaveLength(1);
  });

  it('should update operator when changed', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Get the operator dropdown
    const operatorDropdown = screen.getByTestId('filter-operator-dropdown');

    // Change to OR
    fireEvent.click(within(operatorDropdown).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-OR'));
    const operatorButtonAfterOR = within(operatorDropdown).getByRole('button');
    expect(operatorButtonAfterOR).toHaveTextContent(
      'OR (Any condition can match)',
    );

    // Change to NOT
    fireEvent.click(within(operatorDropdown).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-NOT'));
    const operatorButtonAfterNOT = within(operatorDropdown).getByRole('button');
    expect(operatorButtonAfterNOT).toHaveTextContent(
      'NOT (None of the conditions should match)',
    );
  });

  it('should update field and value when changed', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Open the field dropdown and select 'Health'
    const fieldDropdownButton = screen.getByTestId('field-dropdown-0');
    fireEvent.click(within(fieldDropdownButton).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-health'));

    // Open the value dropdown and select 'Healthy'
    const valueDropdownButton = screen.getByTestId('value-dropdown-0');
    fireEvent.click(within(valueDropdownButton).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-Healthy'));

    // Apply the filter
    fireEvent.click(screen.getByText('Apply Filter'));

    // Check that onApplyFilter was called with the right filter
    expect(mockHandlers.onApplyFilter).toHaveBeenCalledWith({
      operator: 'AND',
      conditions: [{ field: 'health', value: 'Healthy' }],
    });
  });

  it('should reset form when Reset button is clicked', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Change operator to NOT
    const operatorDropdown = screen.getByTestId('filter-operator-dropdown');
    fireEvent.click(within(operatorDropdown).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-NOT'));

    // Change field to health
    const fieldDropdown = screen.getByTestId('field-dropdown-0');
    fireEvent.click(within(fieldDropdown).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-health'));

    // Add another condition
    fireEvent.click(screen.getByText('Add condition'));

    // Click reset button
    fireEvent.click(screen.getByText('Reset'));

    // Should reset to default values
    const resetOperatorDropdown = screen.getByTestId(
      'filter-operator-dropdown',
    );
    const resetOperatorButton = within(resetOperatorDropdown).getByRole(
      'button',
    );
    expect(resetOperatorButton).toHaveTextContent(
      'AND (All conditions must match)',
    );
    expect(screen.getAllByTestId(/field-dropdown-\d+/)).toHaveLength(1);
  });

  it('should reset to initial values when editing and Reset is clicked', () => {
    const initialFilter: FilterGroup = {
      operator: 'NOT',
      conditions: [{ field: 'health', value: 'Error' }],
    };

    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        initialFilterGroup={initialFilter}
        {...mockHandlers}
      />,
    );

    // Change operator to AND
    const operatorDropdown = screen.getByTestId('filter-operator-dropdown');
    fireEvent.click(within(operatorDropdown).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-AND'));

    // Click reset button
    fireEvent.click(screen.getByText('Reset'));

    // Should reset to initial values
    const resetOperatorDropdown = screen.getByTestId(
      'filter-operator-dropdown',
    );
    const resetOperatorButton = within(resetOperatorDropdown).getByRole(
      'button',
    );
    expect(resetOperatorButton).toHaveTextContent(
      'NOT (None of the conditions should match)',
    );
  });

  it('should apply filter when Apply Filter button is clicked', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Change operator to OR
    const operatorDropdown = screen.getByTestId('filter-operator-dropdown');
    fireEvent.click(within(operatorDropdown).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-OR'));

    // Field is already 'status' by default, so we don't need to change it

    // Select 'Online' from the value dropdown
    const valueDropdown = screen.getByTestId('value-dropdown-0');
    fireEvent.click(within(valueDropdown).getByRole('button'));
    fireEvent.click(screen.getByTestId('dropdown-option-Online'));

    // Apply the filter
    fireEvent.click(screen.getByText('Apply Filter'));

    // Check that onApplyFilter was called with the right filter
    expect(mockHandlers.onApplyFilter).toHaveBeenCalledWith({
      operator: 'OR',
      conditions: [{ field: 'status', value: 'Online' }],
    });
  });

  it('should not apply filter with empty values', () => {
    render(
      <ServiceFilterDialog
        isOpen={true}
        services={mockServices}
        {...mockHandlers}
      />,
    );

    // Apply the filter without selecting any values
    fireEvent.click(screen.getByText('Apply Filter'));

    // onApplyFilter should not be called
    expect(mockHandlers.onApplyFilter).not.toHaveBeenCalled();
  });
});
