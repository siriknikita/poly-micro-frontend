import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '@/components/auth/hooks/useForm';

describe('useForm', () => {
  // Test initial values
  it('initializes with provided values', () => {
    const initialValues = { username: '', password: '' };
    const { result } = renderHook(() => useForm(initialValues));

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.submitError).toBe(null);
  });

  // Test form field changes
  it('updates values when handleChange is called', () => {
    const initialValues = { username: '', password: '' };
    const { result } = renderHook(() => useForm(initialValues));

    // Create a mock event
    const mockEvent = {
      target: {
        name: 'username',
        value: 'testuser',
      },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(mockEvent);
    });

    expect(result.current.values).toEqual({
      username: 'testuser',
      password: '',
    });
  });

  // Test field validation
  it('validates fields according to validation rules', () => {
    const initialValues = { username: '', password: '' };
    const validationRules = {
      username: (value: unknown) => {
        if (!(value as string).trim()) return 'Username is required';
        return undefined;
      },
      password: (value: unknown) => {
        if (!value) return 'Password is required';
        if ((value as string).length < 6)
          return 'Password must be at least 6 characters';
        return undefined;
      },
    };

    const { result } = renderHook(() =>
      useForm(initialValues, validationRules),
    );

    // Submit the form to trigger validation
    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    // Check validation errors
    expect(result.current.errors).toEqual({
      username: 'Username is required',
      password: 'Password is required',
    });
  });

  // Test error clearing on input change
  it('clears field error when user types in the field', () => {
    const initialValues = { username: '', password: '' };
    const validationRules = {
      username: (value: unknown) => {
        if (!(value as string).trim()) return 'Username is required';
        return undefined;
      },
    };

    const { result } = renderHook(() =>
      useForm(initialValues, validationRules),
    );

    // Submit to trigger validation and set errors
    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    // Verify error is set
    expect(result.current.errors.username).toBe('Username is required');

    // Type in the field
    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'testuser' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Error should be cleared
    expect(result.current.errors.username).toBeUndefined();
  });

  // Test form submission
  it('calls onSubmit with form values when validation passes', async () => {
    const initialValues = { username: 'testuser', password: 'password123' };
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useForm(initialValues, undefined, onSubmit),
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(onSubmit).toHaveBeenCalledWith(initialValues);
    expect(result.current.isSubmitting).toBe(false);
  });

  // Test form submission error handling
  it('handles submission errors', async () => {
    const initialValues = { username: 'testuser', password: 'password123' };
    const errorMessage = 'Submission failed';
    const onSubmit = vi.fn().mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() =>
      useForm(initialValues, undefined, onSubmit),
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent);
    });

    expect(onSubmit).toHaveBeenCalledWith(initialValues);
    expect(result.current.submitError).toBe(errorMessage);
    expect(result.current.isSubmitting).toBe(false);
  });

  // Test form reset
  it('resets form to initial values', () => {
    const initialValues = { username: '', password: '' };
    const { result } = renderHook(() => useForm(initialValues));

    // Change form values
    act(() => {
      result.current.handleChange({
        target: { name: 'username', value: 'testuser' },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.handleChange({
        target: { name: 'password', value: 'password123' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Verify values changed
    expect(result.current.values).toEqual({
      username: 'testuser',
      password: 'password123',
    });

    // Reset form
    act(() => {
      result.current.reset();
    });

    // Verify values reset
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.submitError).toBe(null);
  });

  // Test clearing submit error when input changes
  it('clears submit error when form values change', () => {
    const initialValues = { username: 'testuser', password: 'password123' };
    const { result } = renderHook(() => useForm(initialValues));

    // Set a submit error manually
    act(() => {
      result.current.setSubmitError('Authentication failed');
    });

    expect(result.current.submitError).toBe('Authentication failed');

    // Change a form value
    act(() => {
      result.current.handleChange({
        target: { name: 'password', value: 'newpassword' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Submit error should be cleared
    expect(result.current.submitError).toBe(null);
  });

  // Test setValues function
  it('allows direct setting of form values', () => {
    const initialValues = { username: '', password: '' };
    const { result } = renderHook(() => useForm(initialValues));

    const newValues = { username: 'admin', password: 'admin123' };

    act(() => {
      result.current.setValues(newValues);
    });

    expect(result.current.values).toEqual(newValues);
  });
});
