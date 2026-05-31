import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 0) return null;

  const renderButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`flex h-10 w-10 items-center justify-center rounded-full font-black transition-all ${
            currentPage === i
              ? 'catalog-accent-button shadow-none'
              : 'text-[var(--catalog-text-muted)] hover:bg-white hover:text-[var(--catalog-text)]'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-[var(--catalog-border)] pt-8 md:flex-row">
      <p className="text-sm font-black text-[var(--catalog-text-muted)]">
        Showing page {currentPage} of {totalPages}
      </p>
      <div className="catalog-panel flex items-center gap-2 rounded-full p-2 shadow-none">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--catalog-border)] transition-all ${
            currentPage === 1
              ? 'cursor-not-allowed opacity-50'
              : 'hover:border-[var(--catalog-border-strong)] hover:bg-white hover:text-[var(--catalog-text)]'
          }`}
        >
          <i className="fa-solid fa-chevron-left text-sm"></i>
        </button>

        {renderButtons()}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--catalog-border)] transition-all ${
            currentPage === totalPages
              ? 'cursor-not-allowed opacity-50'
              : 'hover:border-[var(--catalog-border-strong)] hover:bg-white hover:text-[var(--catalog-text)]'
          }`}
        >
          <i className="fa-solid fa-chevron-right text-sm"></i>
        </button>
      </div>
    </footer>
  );
};

export default Pagination;
