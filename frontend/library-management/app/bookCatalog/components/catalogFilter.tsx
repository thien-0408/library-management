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
  return (
    <section data-aos="fade-up" data-aos-duration="300" className="mb-12 space-y-5">
      <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
          <label className="relative block">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60"></i>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search books and documents..."
              className="w-full rounded-xl border border-outline-variant py-3 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              type="search"
            />
          </label>

          <select
            value={searchField}
            onChange={(event) => onSearchFieldChange(event.target.value as 'Title' | 'Author' | 'Isbn')}
            className="rounded-xl border border-outline-variant px-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            aria-label="Search by"
          >
            <option value="Title">Title</option>
            <option value="Author">Author</option>
            <option value="Isbn">ISBN</option>
          </select>

          <select
            value={documentType}
            onChange={(event) => onDocumentTypeChange(event.target.value as 'ALL' | 'BOOK' | 'DOCUMENT')}
            className="rounded-xl border border-outline-variant px-4 py-3 text-sm font-bold text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            aria-label="Document type"
          >
            <option value="ALL">Books & Documents</option>
            <option value="BOOK">Books</option>
            <option value="DOCUMENT">Documents</option>
          </select>

          {(searchTerm || documentType !== 'ALL') && (
            <button
              type="button"
              onClick={onClearSearch}
              className="rounded-xl border border-outline-variant px-4 py-3 text-sm font-bold text-on-surface-variant transition hover:border-primary hover:text-primary"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {BOOK_CATEGORY_FILTER_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => onTabChange(option.value)}
              className={activeTab === option.value
                ? "vibrant-gradient-bg text-on-primary px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:brightness-110 transition-all"
                : "bg-white border border-outline-variant text-on-surface-variant px-5 py-2 rounded-lg text-sm font-bold hover:border-primary hover:text-primary transition-all"}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 bg-white border border-outline-variant rounded-lg px-4 py-2">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent border-none py-0 text-sm font-bold text-primary focus:ring-0 cursor-pointer outline-none"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default CatalogFilter;
