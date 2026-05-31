import React from 'react';
import { BOOK_CATEGORY_FILTER_OPTIONS, type BookCategoryFilter } from '@/lib/book-category';

interface CatalogFilterProps {
  activeTab: BookCategoryFilter;
  onTabChange: (tab: BookCategoryFilter) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchTerm: string;
  searchField: 'Title' | 'Author' | 'Isbn';
  documentType: 'ALL' | 'BOOK' | 'DOCUMENT';
  onSearchChange: (value: string) => void;
  onSearchFieldChange: (value: 'Title' | 'Author' | 'Isbn') => void;
  onDocumentTypeChange: (value: 'ALL' | 'BOOK' | 'DOCUMENT') => void;
  onClearSearch: () => void;
}

const SORT_OPTIONS = ['Recently Added', 'Most Popular', 'Title (A-Z)'];

const CatalogFilter: React.FC<CatalogFilterProps> = ({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  searchTerm,
  searchField,
  documentType,
  onSearchChange,
  onSearchFieldChange,
  onDocumentTypeChange,
  onClearSearch,
}) => {
  const showClear = Boolean(searchTerm || documentType !== 'ALL');

  return (
    <section data-aos="fade-up" data-aos-duration="300" className="space-y-3">
      <div className="flex flex-col gap-3 rounded-[1.15rem] bg-white px-3 py-3 shadow-[0_10px_24px_-20px_rgba(0,0,0,0.2)] sm:flex-row sm:items-center sm:gap-0 sm:px-4">
        <select
          value={activeTab}
          onChange={(event) => onTabChange(event.target.value as BookCategoryFilter)}
          className="rounded-[0.95rem] border-0 bg-transparent px-3 py-2 text-sm font-semibold text-[#6f695f] outline-none sm:min-w-[10rem] sm:border-r sm:border-[#ece5d7] sm:rounded-none"
          aria-label="Category"
        >
          {BOOK_CATEGORY_FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="relative block flex-1 sm:ml-3">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[#a09a8f]"></i>
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="find the book you like...."
            className="w-full border-0 bg-transparent py-2.5 pl-9 pr-3 text-sm font-medium text-[#2a2620] outline-none placeholder:text-[#b8b1a5]"
            type="search"
          />
        </label>

        <button
          type="button"
          onClick={showClear ? onClearSearch : undefined}
          className="rounded-[0.95rem] bg-[#23493d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1d3f34] sm:ml-3"
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-[#8f877a]">
        <select
          value={searchField}
          onChange={(event) => onSearchFieldChange(event.target.value as 'Title' | 'Author' | 'Isbn')}
          className="rounded-full border border-[#ece5d7] bg-white px-3 py-2 font-semibold outline-none"
          aria-label="Search by"
        >
          <option value="Title">Title</option>
          <option value="Author">Author</option>
          <option value="Isbn">ISBN</option>
        </select>

        <select
          value={documentType}
          onChange={(event) => onDocumentTypeChange(event.target.value as 'ALL' | 'BOOK' | 'DOCUMENT')}
          className="rounded-full border border-[#ece5d7] bg-white px-3 py-2 font-semibold outline-none"
          aria-label="Document type"
        >
          <option value="ALL">Books & Documents</option>
          <option value="BOOK">Books</option>
          <option value="DOCUMENT">Documents</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-full border border-[#ece5d7] bg-white px-3 py-2 font-semibold outline-none"
          aria-label="Sort by"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {showClear && (
          <button
            type="button"
            onClick={onClearSearch}
            className="rounded-full border border-[#ece5d7] bg-white px-3 py-2 font-semibold text-[#6f695f] transition hover:bg-[#faf7f1]"
          >
            Reset
          </button>
        )}
      </div>
    </section>
  );
};

export default CatalogFilter;
