import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormInput } from '@/components/auth/components';
import userEvent from '@testing-library/user-event';

describe('FormInput', () => {
  it('renders an input with label', () => {
    render(
      <FormInput
        id="test-input"
        name="testInput"
        label="Test Label"
        type="text"
        value=""
        onChange={() => {}}
      />,
    );

    // Check for label
    expect(screen.getByText('Test Label')).toBeInTheDocument();

    // Check for input
    const input = screen.getByLabelText('Test Label');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'testInput');
  });

  it('displays the provided value', () => {
    render(
      <FormInput
        id="test-input"
        name="testInput"
        label="Test Label"
        type="text"
        value="Test Value"
        onChange={() => {}}
      />,
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveValue('Test Value');
  });

  it('calls onChange when the input value changes', async () => {
    const handleChange = vi.fn();

    render(
      <FormInput
        id="test-input"
        name="testInput"
        label="Test Label"
        type="text"
        value=""
        onChange={handleChange}
      />,
    );

    const input = screen.getByLabelText('Test Label');
    await userEvent.type(input, 'a');

    expect(handleChange).toHaveBeenCalled();
  });

  it('displays an error message when error is provided', () => {
    render(
      <FormInput
        id="test-input"
        name="testInput"
        label="Test Label"
        type="text"
        value=""
        onChange={() => {}}
        error="This field is required"
      />,
    );

    // Check for error message
    expect(screen.getByText('This field is required')).toBeInTheDocument();

    // Input should have error styling
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-red-500');
  });

  it('marks the input as required when required prop is true', () => {
    render(
      <FormInput
        id="test-input"
        name="testInput"
        label="Test Label"
        type="text"
        value=""
        onChange={() => {}}
        required
      />,
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('required');
  });

  it('renders a password input when type is password', () => {
    render(
      <FormInput
        id="password-input"
        name="password"
        label="Password"
        type="password"
        value="secret"
        onChange={() => {}}
      />,
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders an email input when type is email', () => {
    render(
      <FormInput
        id="email-input"
        name="email"
        label="Email"
        type="email"
        value="test@example.com"
        onChange={() => {}}
      />,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('applies additional className when provided', () => {
    render(
      <FormInput
        id="test-input"
        name="testInput"
        label="Test Label"
        type="text"
        value=""
        onChange={() => {}}
        className="custom-class"
      />,
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('custom-class');
  });
});
