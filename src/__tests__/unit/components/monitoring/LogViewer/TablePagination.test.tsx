import { render, screen, fireEvent } from '@testing-library/react';
import TablePagination from '@/components/monitoring/LogViewer/TablePagination';

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  ChevronLeft: () => <span data-testid="chevron-left">←</span>,
  ChevronRight: () => <span data-testid="chevron-right">→</span>,
}));

describe('TablePagination', () => {
  const mockHandlePageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display current page and total pages when showPageNumbers is false', () => {
    render(
      <TablePagination
        currentPage={2}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
        showPageNumbers={false}
      />,
    );

    // Check for the dropdown button with the correct label
    const dropdownButton = screen.getByRole('button', { name: /page 2/i });
    expect(dropdownButton).toBeInTheDocument();

    // Check that the dropdown has options for all pages
    const pageSelector = screen.getByTestId('page-selector');
    expect(pageSelector).toBeInTheDocument();
  });

  it('should display page number buttons when showPageNumbers is true', () => {
    render(
      <TablePagination
        currentPage={3}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
        showPageNumbers={true}
      />,
    );

    // Should display buttons for pages 1 through 5
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should handle limited number of page buttons with maxPageButtons', () => {
    render(
      <TablePagination
        currentPage={5}
        totalPages={10}
        handlePageChange={mockHandlePageChange}
        showPageNumbers={true}
        maxPageButtons={3}
      />,
    );

    // With maxPageButtons=3 and currentPage=5, should show pages 4,5,6
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();

    // Should not show pages outside the range
    expect(screen.queryByText('3')).not.toBeInTheDocument();
    expect(screen.queryByText('7')).not.toBeInTheDocument();
  });

  it('should call handlePageChange with correct page number when previous button is clicked', () => {
    render(
      <TablePagination currentPage={3} totalPages={5} handlePageChange={mockHandlePageChange} />,
    );

    const prevButton = screen.getByLabelText('Previous page');
    fireEvent.click(prevButton);

    expect(mockHandlePageChange).toHaveBeenCalledWith(2);
  });

  it('should call handlePageChange with correct page number when next button is clicked', () => {
    render(
      <TablePagination currentPage={3} totalPages={5} handlePageChange={mockHandlePageChange} />,
    );

    const nextButton = screen.getByLabelText('Next page');
    fireEvent.click(nextButton);

    expect(mockHandlePageChange).toHaveBeenCalledWith(4);
  });

  it('should disable previous button on first page', () => {
    render(
      <TablePagination currentPage={1} totalPages={5} handlePageChange={mockHandlePageChange} />,
    );

    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(
      <TablePagination currentPage={5} totalPages={5} handlePageChange={mockHandlePageChange} />,
    );

    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('should apply custom className if provided', () => {
    const customClass = 'custom-pagination';
    render(
      <TablePagination
        currentPage={2}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
        className={customClass}
      />,
    );

    const paginationContainer = screen.getByTestId('table-pagination');
    expect(paginationContainer).toHaveClass(customClass);
  });

  it('should handle case when totalPages is 0', () => {
    render(
      <TablePagination currentPage={1} totalPages={0} handlePageChange={mockHandlePageChange} />,
    );

    // When totalPages is 0, the dropdown shouldn't be shown
    expect(screen.queryByTestId('page-selector')).not.toBeInTheDocument();

    // Both buttons should be disabled
    const prevButton = screen.getByLabelText('Previous page');
    expect(prevButton).toBeDisabled();
    const nextButton = screen.getByLabelText('Next page');
    expect(nextButton).toBeDisabled();
  });

  it('should call handlePageChange when a page number button is clicked', () => {
    render(
      <TablePagination
        currentPage={2}
        totalPages={5}
        handlePageChange={mockHandlePageChange}
        showPageNumbers={true}
      />,
    );

    const pageButton = screen.getByText('4');
    fireEvent.click(pageButton);

    expect(mockHandlePageChange).toHaveBeenCalledWith(4);
  });
});
