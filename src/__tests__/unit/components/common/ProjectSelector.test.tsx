import { render, screen } from '@testing-library/react';
import { ProjectSelector } from '@/components/shared/selectors/ProjectSelector';
import { Project } from '@/types';
import userEvent from '@testing-library/user-event';

describe('ProjectSelector Component', () => {
  // Mock data
  const mockProjects: Project[] = [
    { id: 'proj1', name: 'E-Commerce Platform', path: '/e-commerce' },
    { id: 'proj2', name: 'Banking System', path: '/banking' },
    { id: 'proj3', name: 'Healthcare Portal', path: '/healthcare' },
  ];

  const mockOnSelectProject = vi.fn();

  // Reset mock function before each test
  beforeEach(() => {
    mockOnSelectProject.mockClear();
  });

  test('renders with all projects in dropdown', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={null}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Get the select element
    const selectElement = screen.getByTestId('selected-project');
    expect(selectElement).toBeInTheDocument();

    // Check if all projects are in the dropdown
    mockProjects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });

    // Check if default option is present
    expect(screen.getByText('Select a project')).toBeInTheDocument();
  });

  test('displays the selected project', () => {
    const selectedProject = mockProjects[1]; // Banking System

    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={selectedProject}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Check if the correct project is displayed in the dropdown button
    const dropdownElement = screen.getByTestId('selected-project');
    const dropdownButton = dropdownElement.querySelector('button');
    expect(dropdownButton).not.toBeNull();
    expect(dropdownButton).toHaveTextContent(selectedProject.name);
  });

  test('calls onSelectProject when a project is selected', async () => {
    const user = userEvent.setup();

    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={null}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Open the dropdown
    const dropdownElement = screen.getByTestId('selected-project');
    const dropdownButton = dropdownElement.querySelector('button');
    expect(dropdownButton).not.toBeNull();
    await user.click(dropdownButton as HTMLElement);

    // Select a project option
    const projectOption = screen.getByTestId('dropdown-option-proj3');
    await user.click(projectOption as HTMLElement);

    // Check if onSelectProject was called with the correct project
    expect(mockOnSelectProject).toHaveBeenCalledTimes(1);
    expect(mockOnSelectProject).toHaveBeenCalledWith(mockProjects[2]);
  });

  test('dropdown button toggles menu visibility', async () => {
    const user = userEvent.setup();

    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={mockProjects[0]}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Get the dropdown elements
    const dropdownElement = screen.getByTestId('selected-project');
    const dropdownButton = dropdownElement.querySelector('button');
    expect(dropdownButton).not.toBeNull();

    // Initial state - check that dropdown button shows the selected project
    expect(dropdownButton).toHaveTextContent(mockProjects[0].name);

    // Open the dropdown
    await user.click(dropdownButton as HTMLElement);

    // After clicking, dropdown menu should be visible - verify by checking for menu role
    const menuElement = dropdownElement.querySelector('[role="menu"]');
    expect(menuElement).not.toBeNull();
    expect(menuElement).toBeVisible();

    // Verify at least one option is visible
    const options = dropdownElement.querySelectorAll('[role="menuitem"]');
    expect(options.length).toBeGreaterThan(0);
  });

  test('handles empty projects array', () => {
    render(
      <ProjectSelector
        projects={[]}
        selectedProject={null}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Check if the default label is shown
    const dropdownElement = screen.getByTestId('selected-project');
    const dropdownButton = dropdownElement.querySelector('button');
    expect(dropdownButton).not.toBeNull();
    expect(dropdownButton).toHaveTextContent('Select a project');
  });

  test('renders with correct styling', () => {
    render(
      <ProjectSelector
        projects={mockProjects}
        selectedProject={null}
        onSelectProject={mockOnSelectProject}
      />,
    );

    // Check if the component has the expected classes
    const selectElement = screen.getByTestId('selected-project');
    expect(selectElement).toHaveClass('relative');
    expect(selectElement).toHaveClass('inline-block');
    expect(selectElement).toHaveClass('text-left');
    expect(selectElement).toHaveClass('w-full');

    // Check if the folder icon is present
    const folderIcon = document.querySelector('.text-gray-400');
    expect(folderIcon).toBeInTheDocument();
  });
});
