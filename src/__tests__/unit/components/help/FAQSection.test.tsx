import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { FAQSection } from '@/components/help/FAQSection';
import { FAQ } from '@/components/help/types';

describe('FAQSection Component', () => {
  const mockFaqs: FAQ[] = [
    {
      id: 'test-faq-1',
      category: 'general',
      question: 'Test Question 1',
      answer: 'Test Answer 1',
    },
    {
      id: 'test-faq-2',
      category: 'general',
      question: 'Test Question 2',
      answer: 'Test Answer 2',
    },
  ];

  it('renders the section title and FAQs', () => {
    render(
      <FAQSection
        title="Test Section"
        faqs={mockFaqs}
      />,
    );

    // Check for section title
    expect(screen.getByText('Test Section')).toBeInTheDocument();

    // Check for FAQ questions
    expect(screen.getByText('Test Question 1')).toBeInTheDocument();
    expect(screen.getByText('Test Question 2')).toBeInTheDocument();

    // Answers should not be visible initially
    expect(screen.queryByText('Test Answer 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Answer 2')).not.toBeInTheDocument();
  });

  it('expands and collapses FAQs when clicked', async () => {
    const { user } = render(
      <FAQSection
        title="Test Section"
        faqs={mockFaqs}
      />,
    );

    // Click to expand the first FAQ
    await user.click(screen.getByText('Test Question 1'));

    // Answer should now be visible
    expect(screen.getByText('Test Answer 1')).toBeInTheDocument();

    // Second answer should still be hidden
    expect(screen.queryByText('Test Answer 2')).not.toBeInTheDocument();

    // Click to collapse the first FAQ
    await user.click(screen.getByText('Test Question 1'));

    // Answer should be hidden again
    expect(screen.queryByText('Test Answer 1')).not.toBeInTheDocument();
  });

  it('handles multiple FAQ expansions independently', async () => {
    const { user } = render(
      <FAQSection
        title="Test Section"
        faqs={mockFaqs}
      />,
    );

    // Expand first FAQ
    await user.click(screen.getByText('Test Question 1'));
    expect(screen.getByText('Test Answer 1')).toBeInTheDocument();

    // Expand second FAQ
    await user.click(screen.getByText('Test Question 2'));
    expect(screen.getByText('Test Answer 2')).toBeInTheDocument();

    // First answer should still be visible
    expect(screen.getByText('Test Answer 1')).toBeInTheDocument();

    // Collapse first FAQ
    await user.click(screen.getByText('Test Question 1'));
    expect(screen.queryByText('Test Answer 1')).not.toBeInTheDocument();

    // Second answer should still be visible
    expect(screen.getByText('Test Answer 2')).toBeInTheDocument();
  });

  it('returns null if no FAQs are provided', () => {
    const { queryByText } = render(
      <FAQSection
        title="Empty Section"
        faqs={[]}
      />,
    );
    // Check that the title is not rendered, which means the component returned null
    expect(queryByText('Empty Section')).not.toBeInTheDocument();
  });
});
