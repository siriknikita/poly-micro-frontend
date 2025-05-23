# Testing Feature Documentation

## Overview

The Testing feature provides a comprehensive suite of tools for automated testing of microservices.
It allows users to create, manage, and execute tests against their microservices, view test results,
and use AI assistance for test creation. The system includes toast notifications for real-time
feedback on test execution and other key actions. The feature has been recently refactored to
improve code organization, reusability, and performance through custom hooks and reusable UI
components.

## Components Structure

```
src/components/testing/
├── components/                # Reusable UI components specific to testing
│   ├── IconButton.tsx         # Flexible button component with icon support
│   ├── NavigationControls.tsx # Controls for microservice navigation
│   ├── ResizeHandle.tsx       # Component for resizing panels
│   ├── SearchInput.tsx        # Input component for searching microservices
│   ├── TestItem.tsx           # Component for rendering test items
│   ├── TestOutputModal.tsx    # Modal component for test output in components folder
│   └── index.ts               # Export file for easier imports
├── hooks/                     # Custom hooks for testing functionality
│   ├── useMicroserviceNavigation.ts # Hook for navigating between microservices
│   ├── useResizablePanel.ts   # Hook for managing resizable panels
│   ├── useTestItems.ts        # Hook for managing test items and their expanded state
│   └── index.ts               # Export file for easier imports
├── AIPromptModal.tsx          # Modal for AI-assisted test creation
├── AutomatedTesting.tsx       # Main container for the testing feature
├── ChatContainer.tsx          # Container for test chat interactions
├── EmptyState.tsx             # Component shown when no tests are available
├── Header.tsx                 # Header component for the testing section
├── TestChat.tsx               # Component for test chat functionality
├── TestList.tsx               # Component for displaying the list of tests
├── TestListContainer.tsx      # Container for the test list
├── TestOutputModal.tsx        # Modal for displaying test output
├── constants.ts               # Constants used across testing components
└── index.ts                   # Export file for testing components
```

## Key Components

### AutomatedTesting.tsx

The main container component for the testing feature. It integrates all the testing components and
manages the overall state of the testing interface.

**Key Features:**

- Resizable panels for test list and test details
- Navigation between microservices
- Integration with AI for test generation
- Test execution and result viewing

### TestList.tsx

Displays the list of available tests for the selected microservice.

**Key Features:**

- Expandable/collapsible test items
- Test selection and execution
- Filtering and searching tests

### TestChat.tsx

Provides an interactive chat interface for test creation and modification.

**Key Features:**

- AI-assisted test creation
- Test history viewing
- Test execution from chat

### AIPromptModal.tsx

Modal component for creating AI-assisted tests.

**Key Features:**

- Prompt templates for common test scenarios
- Custom prompt input
- Test generation with AI

## Custom Hooks

### useResizablePanel

Manages the state and functionality for resizable panels.

**Usage:**

- Controls panel dimensions
- Handles resize events
- Maintains minimum and maximum sizes

### useTestItems

Manages the state of test items, including expansion state and selection.

**Usage:**

- Tracks expanded/collapsed state of test items
- Handles test selection
- Provides filtering functionality

### useMicroserviceNavigation

Handles navigation between different microservices for testing.

**Usage:**

- Tracks current microservice
- Provides navigation controls
- Maintains navigation history

## Interactions with Other Features

- **Authentication**: Tests are associated with user accounts, requiring authentication
- **Monitoring**: Test results can be viewed in the monitoring dashboard
- **Pipelining**: Tests can be integrated into CI/CD pipelines
- **Notifications**: Toast notifications provide real-time feedback during test execution

## Usage Examples

### Running a Test

1. Navigate to the Testing section from the sidebar
2. Select a microservice from the navigation controls
3. Choose a test from the test list
4. Click the "Run" button to execute the test
5. Toast notifications will appear showing test progress and result
6. View detailed test results in the TestOutputModal

### Creating an AI-Assisted Test

1. Click the "Create with AI" button in the TestList component
2. Enter a prompt describing the test requirements in the AIPromptModal
3. Toast notifications will provide status updates on test generation
4. Review and modify the generated test
5. Save the test to add it to the test list

## Toast Notification System

The Testing feature includes a comprehensive toast notification system that provides real-time
feedback to users on various actions and events.

### Types of Notifications

- **Info notifications**: Provide general information about operations (blue)
- **Success notifications**: Indicate successful completion of actions (green)
- **Error notifications**: Alert users to failures or errors (red)
- **Warning notifications**: Signal potential issues that require attention (yellow)

### Key Toast Notification Events

- **Test Execution**: Notifications on test start, completion, and status (success/partial/failure)
- **Test Generation**: Updates on AI-assisted test generation process
- **Navigation**: Confirmations when navigating between microservices
- **UI Interactions**: Feedback on expanding/collapsing test lists, viewing outputs
- **Error Handling**: Detailed error messages when tests fail or operations encounter issues

### Implementation

The toast system is implemented using React Toastify and integrated throughout the testing
components via a custom context provider. This allows for consistent toast styling and behavior
across the entire testing feature.

```tsx
const { showSuccess, showError, showInfo, showWarning } = useToast();
```

Toast notifications are triggered by key user actions and system events, providing immediate
feedback and improving the overall user experience.

## Service Filters Testing

### Overview

The Service Filters feature allows users to filter microservices based on their status and health.
The testing approach for this feature follows best practices for React component testing, focusing
on component behavior, user interactions, and proper state management.

For detailed implementation information, refer to the
[Service Filters Implementation](../implementation/service-filters-implementation.md) document.

## Comprehensive Test Suite

### Overview

The application includes a comprehensive test suite for both the testing feature components and the
authentication components. This ensures high code quality, reliability, and helps prevent
regressions during development.

### Testing Framework

All tests are implemented using:

- **Vitest**: For test running and assertions
- **React Testing Library**: For rendering and interacting with components
- **userEvent**: For simulating user interactions

### Test Coverage

The test suite provides extensive coverage across multiple areas:

### Test Structure

Tests for the Service Filters feature are organized into three main categories:

1. **Hook Tests** (`useServiceFilters.test.tsx`)

   - Test the custom hook that manages filter state and logic
   - Verify filter persistence in local storage
   - Test filter application logic
   - Ensure proper filter group management (add, update, remove, clear)

2. **Component Tests** (`ServiceFilters.test.tsx`, `ServiceFilterDialog.test.tsx`)

   - Test UI rendering and interactions
   - Verify dialog opening/closing behavior
   - Test filter creation and editing workflows
   - Ensure proper display of active filters

3. **Integration Tests** (`ServiceStatus.test.tsx`)
   - Test integration of filters with the service status display
   - Verify filtered services are correctly displayed
   - Test empty state when no services match filters

### Testing Approach

#### Accessibility-First Testing

Tests are designed to use accessibility-friendly selectors whenever possible:

- Using `getByRole` instead of `getByTestId` where appropriate
- Testing with proper ARIA attributes
- Ensuring keyboard navigation works correctly

```tsx
// Example: Finding a button by its accessible role and name
const applyFilterButton = screen.getByRole('button', { name: /apply filter/i });
```

#### Testing Components

1. **Testing Feature Tests**:

   - **Component Tests**:
     - Individual UI components (IconButton, TestItem, NavigationControls, etc.)
     - Container components (TestList, AutomatedTesting)
     - Modal components (TestOutputModal, AIPromptModal)
   - **Hook Tests**:
     - useResizablePanel: Tests for panel resizing functionality
     - useTestItems: Tests for test item state management
     - useMicroserviceNavigation: Tests for navigation between microservices

2. **Authentication Feature Tests**:
   - **Hook Tests**:
     - useAuth.test.tsx: Tests for authentication state management, login, registration, and logout
       functionality
     - useForm.test.tsx: Tests for form state management, validation, submission, and error handling
   - **Component Tests**:
     - LoginForm.test.tsx: Tests for rendering, validation, submission, and error handling
     - RegisterForm.test.tsx: Tests for rendering, validation, submission, and error handling
     - AuthLayout.test.tsx: Tests for layout rendering and styling
     - Button.test.tsx: Tests for button states (default, loading, disabled) and event handling
     - FormInput.test.tsx: Tests for input rendering, validation, and error states

### Test Best Practices

- **Isolation**: Each test is isolated and does not depend on other tests
- **Mocking**: External dependencies are properly mocked
- **User-centric**: Tests focus on user interactions rather than implementation details
- **Accessibility**: Tests use accessibility-friendly selectors
- **Comprehensive**: Tests cover happy paths, edge cases, and error scenarios

### Running Tests

To run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run tests for a specific file
npm test -- components/testing/hooks/useResizablePanel.test.tsx
```

#### Mock Implementation

For component testing, we use Jest mocks to isolate components and test their behavior:

```tsx
// Example: Mocking a child component
jest.mock('@/components/monitoring/shared/ServiceFilterDialog', () => ({
  ServiceFilterDialog: ({ isOpen, onClose, onApplyFilter, initialFilterGroup }) => {
    // Mock implementation
  },
}));
```

#### Test Coverage

The test suite aims to cover:

- **User Interactions**: Clicking buttons, opening dialogs, applying filters
- **State Management**: Proper state updates when filters change
- **Edge Cases**: Empty states, invalid filters, persistence issues
- **Accessibility**: Ensuring components are accessible

### Best Practices

1. **Isolated Tests**: Each test focuses on a specific behavior or feature
2. **Realistic User Interactions**: Tests simulate actual user behavior
3. **Minimal Test Coupling**: Tests don't depend on each other
4. **Clear Assertions**: Each test has clear, specific assertions
5. **Proper Cleanup**: Tests clean up after themselves

### Common Testing Patterns

#### Testing Filter Application

```tsx
it('should filter services based on status', () => {
  const { result } = renderHook(() => useServiceFilters('test-project'));

  act(() => {
    result.current.addFilterGroup({
      operator: 'AND',
      conditions: [{ field: 'status', value: 'Online' }],
    });
  });

  const filteredServices = result.current.filterServices(mockServices);
  expect(filteredServices.length).toBe(1);
  expect(filteredServices[0].status).toBe('Online');
});
```

#### Testing UI Interactions

```tsx
it('should open filter dialog when add filter button is clicked', () => {
  render(<ServiceFilters services={mockServices} filterGroups={[]} {...mockHandlers} />);

  fireEvent.click(screen.getByText('Add Filter'));
  expect(screen.getByTestId('filter-dialog')).toBeInTheDocument();
});
```

### Troubleshooting Common Test Issues

1. **Selector Issues**: If tests can't find elements, check if the component structure has changed.
   Prefer role-based selectors over test IDs when possible.

2. **Mock Function Calls**: Ensure mock functions are properly set up and that the component is
   correctly calling them.

3. **Asynchronous Updates**: Use `act()` for state updates and `waitFor()` for asynchronous
   operations.

4. **Local Storage Issues**: Mock localStorage for consistent test behavior across environments.

5. **Component Isolation**: Use proper mocking to isolate the component under test from its
   dependencies.
