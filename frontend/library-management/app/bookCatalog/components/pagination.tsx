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
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all ${currentPage === i
            ? 'vibrant-gradient-bg text-on-primary shadow-md' 
            : 'text-on-surface-variant hover:bg-surface-variant' 
            }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <footer className="mt-20 pt-10 border-t border-outline-variant flex flex-col md:flex-row items-center justify-between gap-8">
      <p className="text-sm font-bold text-on-surface-variant/70">
        Showing page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:text-primary'
            }`}
        >
          <i className="fa-solid fa-chevron-left text-sm"></i>
        </button>

        {renderButtons()}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:text-primary'
            }`}
        >
          <i className="fa-solid fa-chevron-right text-sm"></i>
        </button>
      </div>
    </footer>
  );
};

export default Pagination;
