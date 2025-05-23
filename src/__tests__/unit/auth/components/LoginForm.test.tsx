import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppRouter } from '@/components/shared/AppRouter';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/components/auth/hooks/useAuth';
import userEvent from '@testing-library/user-event';

// Mock the useAuth hook
vi.mock('@/components/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('LoginForm', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup the useAuth mock
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  });

  const renderLoginForm = () => {
    return render(
      <AppRouter>
        <LoginForm />
      </AppRouter>,
    );
  };

  it('renders the login form correctly', () => {
    renderLoginForm();

    // Check for form elements
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\? sign up!/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderLoginForm();

    // Submit the form without filling in any fields
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Login should not be called with empty fields
    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  it('submits the form with valid data', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    // Fill in the form
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Check that login was called with correct values
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
    });
  });

  it('displays an error message when login fails', async () => {
    // Setup login to fail
    mockLogin.mockRejectedValueOnce(new Error('Invalid username or password'));

    renderLoginForm();
    const user = userEvent.setup();

    // Fill in the form
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');

    // Submit the form
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

  it('allows typing in form fields', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    // Type in the username field
    await user.type(screen.getByLabelText(/username/i), 'testuser');

    // Verify input value is updated
    expect(screen.getByLabelText(/username/i)).toHaveValue('testuser');
  });

  it('has a working link to the registration page', () => {
    renderLoginForm();

    const registerLink = screen.getByText(/don't have an account\? sign up!/i);
    expect(registerLink.getAttribute('href')).toBe('/register');
  });
});
