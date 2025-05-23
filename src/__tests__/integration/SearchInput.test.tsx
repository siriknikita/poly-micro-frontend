import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { SearchInput } from '@/components/testing/components';

describe('SearchInput Integration', () => {
  it('renders the search input with placeholder', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Search microservices" />);

    expect(screen.getByPlaceholderText('Search microservices')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <SearchInput value="" onChange={handleChange} placeholder="Search microservices" />,
    );

    const input = screen.getByPlaceholderText('Search microservices');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4); // One call per character
  });

  it('displays the search icon', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Search microservices" />);

    // Look for the SVG element with the lucide-search class
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('lucide-search');
  });

  it('sets input value correctly', () => {
    render(
      <SearchInput value="test value" onChange={() => {}} placeholder="Search microservices" />,
    );

    expect(screen.getByPlaceholderText('Search microservices')).toHaveValue('test value');
  });
});
