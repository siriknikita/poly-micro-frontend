import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ServiceSelector } from '@/components/monitoring/shared/ServiceSelector';
import { Service } from '@/types';

describe('ServiceSelector', () => {
  const mockServices: Service[] = [
    { id: '1', name: 'Service 1', url: 'http://service1.com' },
    { id: '2', name: 'Service 2', url: 'http://service2.com' },
    { id: '3', name: 'Service 3', url: 'http://service3.com' },
  ];

  const mockOnServiceSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default label', () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
      />,
    );

    // Get the button that shows the dropdown label
    const dropdownButton = screen.getByRole('button', {
      name: /select a service/i,
    });
    expect(dropdownButton).toBeInTheDocument();
    expect(
      within(dropdownButton).getByText('Select a service'),
    ).toBeInTheDocument();
  });

  it('should render with custom label', () => {
    const customLabel = 'Choose a microservice';
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        label={customLabel}
      />,
    );

    // Get the button that shows the dropdown label
    const dropdownButton = screen.getByRole('button', {
      name: new RegExp(customLabel, 'i'),
    });
    expect(dropdownButton).toBeInTheDocument();
    expect(within(dropdownButton).getByText(customLabel)).toBeInTheDocument();
  });

  it('should render all provided services as options', async () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
      />,
    );

    // Open the dropdown
    const dropdownButton = screen.getByRole('button');
    await userEvent.click(dropdownButton);

    // Check if all services are in the dropdown
    mockServices.forEach((service) => {
      expect(screen.getByText(service.name)).toBeInTheDocument();
    });
  });

  it('should show "All Services" option when showAllOption is true', async () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        showAllOption={true}
      />,
    );

    // Open the dropdown
    const dropdownButton = screen.getByRole('button');
    await userEvent.click(dropdownButton);

    expect(screen.getByText('All Services')).toBeInTheDocument();
  });

  it('should not show "All Services" option when showAllOption is false', async () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        showAllOption={false}
      />,
    );

    // Open the dropdown
    const dropdownButton = screen.getByRole('button');
    await userEvent.click(dropdownButton);

    expect(screen.queryByText('All Services')).not.toBeInTheDocument();
  });

  it('should select the provided selectedService', () => {
    render(
      <ServiceSelector
        selectedService="Service 2"
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
      />,
    );

    // The dropdown button should show the selected service
    const dropdownButton = screen.getByRole('button');
    expect(within(dropdownButton).getByText('Service 2')).toBeInTheDocument();
  });

  it('should call onServiceSelect with the selected service name', async () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
      />,
    );

    // Open the dropdown
    const dropdownButton = screen.getByRole('button');
    await userEvent.click(dropdownButton);

    // Click on a service option
    const serviceOption = screen.getByText('Service 3');
    await userEvent.click(serviceOption);

    expect(mockOnServiceSelect).toHaveBeenCalledWith('Service 3');
  });

  it('should apply custom className if provided', () => {
    const customClass = 'custom-test-class';
    render(
      <ServiceSelector
        selectedService={null}
        services={mockServices}
        onServiceSelect={mockOnServiceSelect}
        className={customClass}
      />,
    );

    // The dropdown container should have the custom class
    const dropdownContainer = screen.getByTestId('service-selector');
    expect(dropdownContainer).toHaveClass(customClass);
  });

  it('should handle empty services array', async () => {
    render(
      <ServiceSelector
        selectedService={null}
        services={[]}
        onServiceSelect={mockOnServiceSelect}
      />,
    );

    // Should just render the default option in the button
    const dropdownButton = screen.getByRole('button');
    expect(
      within(dropdownButton).getByText('Select a service'),
    ).toBeInTheDocument();

    // Open the dropdown
    await userEvent.click(dropdownButton);

    // Should only have the placeholder option
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBe(1);
    expect(
      within(menuItems[0]).getByText('Select a service'),
    ).toBeInTheDocument();
  });
});
