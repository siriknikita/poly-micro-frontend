import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ } from './types';

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ title, faqs }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {faqs.map((faq) => (
          <div key={faq.id} className="px-6 py-4" data-testid={`faq-item-${faq.id}`}>
            <button
              onClick={() => toggleItem(faq.id)}
              className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 rounded-md"
              aria-expanded={expandedItems[faq.id]}
              aria-controls={`faq-answer-${faq.id}`}
            >
              <h3 className="text-md font-medium text-gray-900 dark:text-white">{faq.question}</h3>
              <div className="ml-2 flex-shrink-0">
                {expandedItems[faq.id] ? (
                  <ChevronUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </button>
            {expandedItems[faq.id] && (
              <div
                id={`faq-answer-${faq.id}`}
                className="mt-3 text-gray-700 dark:text-gray-200 text-sm bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-100 dark:border-indigo-800/30 shadow-sm"
              >
                <p className="leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
