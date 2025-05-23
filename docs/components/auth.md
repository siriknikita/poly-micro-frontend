# Authentication Feature Documentation

## Overview

The Authentication feature provides user authentication and registration functionality for the Poly
Micro Manager application. It handles user login, registration, and session management to secure
access to the application's features.

## Components Structure

```
src/components/auth/
├── components/                # Reusable UI components specific to authentication
│   ├── AuthLayout.tsx        # Layout wrapper for auth pages
│   ├── Button.tsx            # Customizable button component
│   ├── FormInput.tsx         # Input component with label and error handling
│   └── index.ts              # Export file for auth components
├── hooks/                     # Custom hooks for authentication functionality
│   ├── useAuth.ts            # Authentication state management hook
│   ├── useForm.ts            # Form state and validation hook
│   └── index.ts              # Export file for auth hooks
├── LoginForm.tsx              # Form component for user login
├── RegisterForm.tsx           # Form component for user registration
└── index.ts                   # Export file for authentication components
```

## Key Components

### LoginForm.tsx

Provides a form interface for users to log in to the application.

**Key Features:**

- Username and password input fields
- Form validation using useForm hook
- Error handling and display
- Login submission with loading state
- Navigation to registration page

### RegisterForm.tsx

Provides a form interface for new users to register for the application.

**Key Features:**

- Business name, email, username, and password fields
- Email format validation
- Username and password length validation
- Form validation using useForm hook
- Error handling and display
- Registration submission with loading state

### UI Components

#### AuthLayout.tsx

Provides a consistent layout for authentication pages.

**Key Features:**

- Title and icon display
- Dark mode toggle
- Responsive design with proper spacing
- Card-like appearance for content

#### Button.tsx

A customizable button component used throughout the auth forms.

**Key Features:**

- Multiple variants (primary, secondary, outline)
- Loading state with spinner
- Full-width option
- Disabled state handling

#### FormInput.tsx

A reusable input component with built-in label and error display.

**Key Features:**

- Label integration
- Error message display
- Various input types (text, email, password)
- Proper styling for normal and error states

### Custom Hooks

#### useAuth.ts

Manages authentication state and operations.

**Key Features:**

- User authentication state
- Login functionality
- Registration functionality
- Logout functionality
- Local storage persistence

#### useForm.ts

Handles form state, validation, and submission.

**Key Features:**

- Form values management
- Field validation with custom rules
- Error state handling
- Form submission handling
- Loading state management

## Authentication Flow

1. **User Access**: When a user accesses the application, they are directed to the login page if not
   authenticated
2. **Login/Register**: User enters credentials or registers a new account
3. **Validation**: The application validates the credentials against the backend
4. **Session Management**: Upon successful authentication, a session is created
5. **Access Control**: The authenticated user is granted access to protected features

## Integration with Other Features

- **All Protected Features**: Authentication is required to access testing, monitoring, and
  pipelining features
- **User-specific Data**: User authentication determines what projects and microservices are
  accessible
- **Dark Mode Support**: Authentication components support the application's dark mode toggle

## Security Considerations

- Passwords are never stored in plain text
- Form inputs are validated to prevent injection attacks
- Authentication tokens are securely stored and managed
- Session timeout and automatic logout for security
- Input validation prevents common security issues like XSS

## Testing

The authentication module has comprehensive test coverage using Vitest and React Testing Library:

### Hook Tests

- **useAuth.test.tsx**: Tests for authentication state management, login, registration, and logout
  functionality
- **useForm.test.tsx**: Tests for form state management, validation, submission, and error handling

### Component Tests

- **LoginForm.test.tsx**: Tests for rendering, validation, submission, and error handling
- **RegisterForm.test.tsx**: Tests for rendering, validation, submission, and error handling
- **AuthLayout.test.tsx**: Tests for layout rendering and styling
- **Button.test.tsx**: Tests for button states (default, loading, disabled) and event handling
- **FormInput.test.tsx**: Tests for input rendering, validation, and error states

## Usage Examples

### User Login

1. Navigate to the login page
2. Enter email and password
3. Click "Login" button
4. Upon successful authentication, user is redirected to the dashboard

### User Registration

1. Navigate to the registration page
2. Enter required information (name, email, password)
3. Confirm password
4. Click "Register" button
5. Upon successful registration, user is either logged in automatically or directed to login
