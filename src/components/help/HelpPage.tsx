import React, { useState, useMemo } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import SectionHeader from '../shared/SectionHeader';
import { useHelp } from './hooks/useHelp';
import { FAQS, FAQ_CATEGORIES } from './constants/faqData';
import { FAQSection } from './FAQSection';
import { AskQuestionForm } from './AskQuestionForm';
import { useAuth } from '../auth/hooks/useAuth';
import { FAQ } from './types';

const renderSearchResults = (filteredFaqs: FAQ[], hasResults: boolean) => {
  if (!hasResults) {
    return (
      <div className="text-center py-12 mb-8 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          No results found
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We couldn't find any FAQs matching your search. Try a different search term or ask your
          question below.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {FAQ_CATEGORIES.map((category) => {
        const categoryFaqs = filteredFaqs.filter((faq) => faq.category === category.id);
        if (categoryFaqs.length === 0) return null;

        return <FAQSection key={category.id} title={category.name} faqs={categoryFaqs} />;
      })}
    </div>
  );
};

const renderSearchQueryInput = (searchQuery: string, setSearchQuery: (query: string) => void) => {
  return (
    <div className="relative mb-8">
      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
        <div className="pl-4">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-300" />
        </div>
        <input
          type="text"
          placeholder="Search for help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-2 bg-transparent focus:outline-none text-gray-800 dark:text-white"
          data-testid="help-search-input"
        />
      </div>
    </div>
  );
};

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { submitQuestion, isSubmitting } = useHelp();
  const { user } = useAuth();

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;

    const query = searchQuery.toLowerCase();
    return FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const hasResults = filteredFaqs.length > 0;

  return (
    <div className="p-6">
      <SectionHeader
        title="Help Center"
        HeaderIcon={HelpCircle}
        headerClassName="text-gray-800 dark:text-white text-xl font-semibold flex items-center gap-2 mb-6"
        iconClassName="h-6 w-6 text-indigo-600 dark:text-indigo-400"
      />

      {renderSearchQueryInput(searchQuery, setSearchQuery)}
      {renderSearchResults(filteredFaqs, hasResults)}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Didn't find what you're looking for?
        </h2>
        <AskQuestionForm 
          onSubmit={submitQuestion} 
          isSubmitting={isSubmitting} 
          username={user?.username || ''} 
          userEmail={user?.email || ''} 
        />
      </div>
    </div>
  );
};
