import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { AuthLayout, Button, FormInput } from './components';
import { useAuth, useForm } from './hooks';
import { useEffect, useState } from 'react';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isAuthenticated, refreshAuthState } = useAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Effect to handle navigation after successful login
  useEffect(() => {
    // Check if we've logged in successfully
    if (loginSuccess) {
      // Try to refresh auth state immediately after login success
      refreshAuthState().then(success => {
        console.log('Auth state refresh result:', success, 'isAuthenticated:', isAuthenticated);
        if (success) {
          console.log('Auth state confirmed, navigating to dashboard');
          navigate('/dashboard');
        }
      });
    }
  }, [loginSuccess, refreshAuthState, navigate]);
  
  // Form validation rules
  const validationRules = {
    username: (value: unknown, _formData: { username: string; password: string }) => {
      if (!value || typeof value !== 'string' || !value.trim()) return 'Username is required';
      return undefined;
    },
    password: (value: unknown, _formData: { username: string; password: string }) => {
      if (!value || typeof value !== 'string' || !value.trim()) return 'Password is required';
      return undefined;
    },
  };

  // Handle form submission
  const handleLoginSubmit = async (values: { username: string; password: string }) => {
    try {
      // Login and get the authentication result
      const success = await login(values.username, values.password);
      console.log('Login success:', success);
      
      // If login is successful, set the success flag to trigger our effect
      if (success) {
        console.log('Login successful, setting success flag');
        
        // Set flag to trigger the effect that handles navigation
        setLoginSuccess(true);
        
        // Trigger auth state check after a short delay
        setTimeout(() => {
          // Force auth state refresh
          refreshAuthState().then(refreshSuccess => {
            console.log('Manual refresh result:', refreshSuccess);
            if (refreshSuccess) {
              console.log('Auth confirmed after refresh, navigating...');
              navigate('/dashboard');
            }
          });
        }, 100);
      }
    } catch (error) {
      // Error will be handled by the form submission error handler
      console.error('Login submission error:', error);
      throw error;
    }
  };

  // Use our custom form hook
  const { values, errors, isSubmitting, submitError, handleChange, handleSubmit } = useForm(
    { username: '', password: '' },
    validationRules,
    handleLoginSubmit,
  );

  return (
    <AuthLayout
      title="Sign in to your account"
      icon={<LogIn className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="username"
          name="username"
          label="Username"
          type="text"
          value={values.username}
          onChange={handleChange}
          error={errors.username}
          required
        />

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        {submitError && <div className="text-red-600 dark:text-red-400 text-sm">{submitError}</div>}

        <div>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Sign in
          </Button>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            Don't have an account? Sign up!
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
