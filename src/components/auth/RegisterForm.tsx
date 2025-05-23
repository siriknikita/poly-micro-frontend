import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { User } from '@/db/db';
import { AuthLayout, Button, FormInput } from './components';
import { useAuth, useForm } from './hooks';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Initial form values
  const initialValues: Omit<User, 'id'> = {
    businessName: '',
    email: '',
    username: '',
    password: '',
  };

  // Form validation rules
  const validationRules = {
    businessName: (value: string) => {
      if (!value.trim()) return 'Business name is required';
      return undefined;
    },
    email: (value: string) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email address';
      return undefined;
    },
    username: (value: string) => {
      if (!value.trim()) return 'Username is required';
      if (value.length < 3) return 'Username must be at least 3 characters';
      return undefined;
    },
    password: (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 6) return 'Password must be at least 6 characters';
      return undefined;
    },
  };

  // Handle form submission
  const handleRegisterSubmit = async (values: Omit<User, 'id'>) => {
    await register(values);
    navigate('/login');
  };

  // Use our custom form hook
  const { values, errors, isSubmitting, submitError, handleChange, handleSubmit } = useForm(
    initialValues,
    validationRules,
    handleRegisterSubmit,
  );

  return (
    <AuthLayout
      title="Register your business"
      icon={<UserPlus className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormInput
          id="businessName"
          name="businessName"
          label="Business Name"
          type="text"
          value={values.businessName}
          onChange={handleChange}
          error={errors.businessName}
          required
        />

        <FormInput
          id="email"
          name="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

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
            Register
          </Button>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            Already have an account? Sign in!
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
