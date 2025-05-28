import React, { memo, useMemo } from 'react';
import { Dropdown, DropdownSectionProps } from '@/components/shared/Dropdown';

interface TablePaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
}

export const TablePagination: React.FC<TablePaginationProps> = memo(
  ({
    className = '',
    currentPage,
    totalPages,
    handlePageChange,
    showPageNumbers = false,
    maxPageButtons = 5,
  }) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
      if (!showPageNumbers || totalPages <= 1) return [];

      const pageNumbers = [];
      const halfMaxButtons = Math.floor(maxPageButtons / 2);
      let startPage = Math.max(1, currentPage - halfMaxButtons);
      const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      return pageNumbers;
    };

    const pageNumbers = getPageNumbers();
    const buttonClasses =
      'flex items-center justify-center px-3 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded disabled:opacity-50 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors';

    // Create page options for dropdown
    const pageOptions = useMemo(() => {
      const options = [];
      for (let i = 1; i <= totalPages; i++) {
        options.push({
          id: i.toString(),
          label: `Page ${i}`,
        });
      }
      return options;
    }, [totalPages]);

    // Create dropdown sections
    const dropdownSections: DropdownSectionProps[] = useMemo(
      () => [
        {
          options: pageOptions,
          onSelect: (id) => handlePageChange(parseInt(id)),
        },
      ],
      [pageOptions, handlePageChange],
    );

    return (
      <div
        className={`flex items-center space-x-2 ${className}`}
        data-testid="table-pagination"
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={buttonClasses}
          aria-label="Previous page"
          data-testid="previous-page"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-testid="chevron-left"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {showPageNumbers &&
          pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`${buttonClasses} ${number === currentPage ? 'bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-700' : ''}`}
            >
              {number}
            </button>
          ))}

        {!showPageNumbers && totalPages > 0 && (
          <Dropdown
            buttonLabel={`Page ${currentPage} of ${totalPages}`}
            selectedOption={currentPage.toString()}
            sections={dropdownSections}
            className="mx-2"
            testId="page-selector"
          />
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={buttonClasses}
          aria-label="Next page"
          data-testid="next-page"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-testid="chevron-right"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these props change
    return (
      prevProps.currentPage === nextProps.currentPage &&
      prevProps.totalPages === nextProps.totalPages
    );
  },
);

export default TablePagination;
