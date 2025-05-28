# Poly Micro Manager - User Guide

## Introduction

Welcome to the Poly Micro Manager user guide! This document provides
comprehensive guidance on using the application's features, with a focus on the
recently refactored testing components and the new test suite.

## Table of Contents

1. [Testing Feature](#testing-feature)
   - [Navigating the Testing Interface](#navigating-the-testing-interface)
   - [Running Tests](#running-tests)
   - [Creating AI-Assisted Tests](#creating-ai-assisted-tests)
   - [Using Resizable Panels](#using-resizable-panels)
   - [Filtering and Searching Tests](#filtering-and-searching-tests)
   - [Viewing Test Results](#viewing-test-results)
2. [Authentication](#authentication)
   - [Logging In](#logging-in)
   - [Registering a New Account](#registering-a-new-account)
   - [Password Recovery](#password-recovery)
3. [Developer Guide](#developer-guide)
   - [Running the Test Suite](#running-the-test-suite)
   - [Understanding the Component Structure](#understanding-the-component-structure)
   - [Using Custom Hooks](#using-custom-hooks)
   - [Contributing to the Project](#contributing-to-the-project)

## Testing Feature

The Testing feature has been completely refactored to improve usability,
performance, and code organization. This section guides you through using the
enhanced testing interface.

### Navigating the Testing Interface

The testing interface consists of several key areas:

1. **Navigation Bar**: Located at the top, allows you to switch between
   microservices
2. **Test List Panel**: Shows all available tests for the selected microservice
3. **Test Details Panel**: Displays details of the selected test
4. **Action Buttons**: Run, Edit, Delete, and other actions for tests

**How to navigate:**

1. Use the search input in the navigation bar to quickly find microservices
2. Click on a microservice name to select it
3. Use the navigation controls (arrows) to move between recently viewed
   microservices
4. The test list will update automatically when you select a different
   microservice

### Running Tests

To run a test:

1. Select a microservice from the navigation bar
2. Find the test you want to run in the test list
3. Click the "Run" button (play icon) next to the test name
4. A toast notification will appear showing the test progress
5. When the test completes, a notification will show the result
   (success/failure)
6. Click "View Details" in the notification to see the full test output

**Batch Running Tests:**

1. Use the checkboxes to select multiple tests
2. Click the "Run Selected" button at the top of the test list
3. A progress indicator will show the status of all running tests
4. Results will be displayed as each test completes

### Creating AI-Assisted Tests

The AI assistance feature helps you create tests quickly:

1. Click the "Create with AI" button in the test list header
2. In the AI Prompt Modal:
   - Select a template from the dropdown or write a custom prompt
   - Describe what you want the test to do
   - Include any specific assertions or conditions
3. Click "Generate Test"
4. Review the generated test in the preview panel
5. Make any necessary adjustments
6. Click "Save Test" to add it to your test list

**Pro Tip**: For best results, be specific in your prompt about what the test
should verify and any edge cases to consider.

### Using Resizable Panels

The testing interface features resizable panels for a customized workspace:

1. Hover your cursor between panels to see the resize handle (cursor will
   change)
2. Click and drag the handle to resize panels
3. Double-click the handle to reset to the default size
4. The system will remember your preferred panel sizes between sessions

**Panel Collapse:**

- Click the collapse button (double arrow icon) to temporarily hide a panel
- Click again to restore the panel to its previous size

### Filtering and Searching Tests

To find specific tests:

1. Use the search box at the top of the test list to filter by test name
2. Click on the filter icon to open advanced filtering options:
   - Filter by test status (Passed, Failed, Not Run)
   - Filter by test type (Unit, Integration, E2E)
   - Filter by tags
3. Active filters will be displayed as chips below the search box
4. Click the "X" on a filter chip to remove that filter
5. Click "Clear All" to remove all filters

### Viewing Test Results

After running a test:

1. Click on the test name in the test list to view its details
2. The test details panel will show:
   - Test status and duration
   - Test output (console logs, errors)
   - Test coverage information
   - History of previous runs
3. Click the "View Full Output" button to open the Test Output Modal for a
   larger view
4. In the Test Output Modal:
   - Toggle between "Raw Output" and "Formatted" views
   - Copy output to clipboard
   - Export results as JSON or HTML

## Authentication

### Logging In

To log in to the application:

1. Navigate to the login page
2. Enter your username and password
3. Click the "Login" button
4. If successful, you'll be redirected to the dashboard
5. If unsuccessful, error messages will guide you on what went wrong

**Remember Me:**

- Check the "Remember Me" option to stay logged in on the same device
- For security reasons, this option expires after 30 days

### Registering a New Account

To create a new account:

1. Click "Register" on the login page
2. Fill in all required fields:
   - Business name
   - Email address (must be valid format)
   - Username (at least 4 characters)
   - Password (at least 8 characters, including numbers and special characters)
3. Click the "Register" button
4. Verify your email by clicking the link sent to your email address
5. Once verified, you can log in with your new credentials

### Password Recovery

If you forget your password:

1. Click "Forgot Password?" on the login page
2. Enter the email address associated with your account
3. Click "Send Recovery Link"
4. Check your email for a password reset link
5. Click the link and follow instructions to create a new password
6. Use your new password to log in

## Developer Guide

### Running the Test Suite

The application includes a comprehensive test suite for both the testing feature
components and the authentication components:

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

### Understanding the Component Structure

The application follows a modular architecture with components organized by
feature:

1. **Feature-based organization**:

   - Each feature (auth, testing, monitoring, etc.) has its own directory
   - Within each feature directory, components are further organized by type

2. **Component hierarchy**:

   - Container components manage state and data flow
   - Presentation components focus on rendering UI
   - Custom hooks extract and manage logic

3. **Reusable components**:
   - Shared components are in the `components/shared` directory
   - Feature-specific reusable components are in
     `components/[feature]/components`

### Using Custom Hooks

The application provides several custom hooks that you can use in your
components:

1. **Testing hooks**:

   - `useResizablePanel`: Manages resizable panels
   - `useTestItems`: Manages test items and their expanded state
   - `useMicroserviceNavigation`: Handles navigation between microservices

2. **Authentication hooks**:
   - `useAuth`: Manages authentication state and operations
   - `useForm`: Handles form state, validation, and submission

**Example usage**:

```tsx
import { useResizablePanel } from 'components/testing/hooks';

const MyComponent = () => {
  const { panelSize, handleResize, resetSize } = useResizablePanel(
    'leftPanel',
    300,
  );

  return (
    <div style={{ width: `${panelSize}px` }}>
      <ResizeHandle
        onResize={handleResize}
        onDoubleClick={resetSize}
      />
      {/* Panel content */}
    </div>
  );
};
```

### Contributing to the Project

When contributing to the project, please follow these guidelines:

1. **Code organization**:

   - Follow the existing pattern of feature-based organization
   - Create custom hooks for complex logic
   - Use reusable components for UI elements

2. **Testing**:

   - Write tests for all new components and hooks
   - Follow the existing testing patterns
   - Aim for high test coverage

3. **Documentation**:

   - Update documentation when adding or changing features
   - Add JSDoc comments to functions and components
   - Keep the user guide up to date

4. **Pull requests**:
   - Create a feature branch for your changes
   - Reference any relevant issue numbers
   - Provide a clear description of your changes
   - Request reviews from appropriate team members

## Conclusion

This user guide provides an overview of the key features and how to use them
effectively. For more detailed information about specific components, please
refer to the component documentation in the `docs/components/` directory.

If you have any questions or need further assistance, please contact the
development team or open an issue on the project repository.
