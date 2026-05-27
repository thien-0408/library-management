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
    <section data-aos="fade-up" data-aos-duration="300" className="mb-10 space-y-5">
      <div className="rounded-[1.75rem] border border-red-100 bg-white p-4 shadow-[0_18px_50px_-38px_rgba(153,27,27,0.45)]">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
          <label className="relative block">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-red-400"></i>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search books and documents..."
              className="w-full rounded-2xl border border-red-100 bg-red-50/50 py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-300 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              type="search"
            />
          </label>

          <select
            value={searchField}
            onChange={(event) => onSearchFieldChange(event.target.value as 'Title' | 'Author' | 'Isbn')}
            className="rounded-2xl border border-red-100 bg-white px-4 py-3.5 text-sm font-black text-red-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10"
            aria-label="Search by"
          >
            <option value="Title">Title</option>
            <option value="Author">Author</option>
            <option value="Isbn">ISBN</option>
          </select>

          <select
            value={documentType}
            onChange={(event) => onDocumentTypeChange(event.target.value as 'ALL' | 'BOOK' | 'DOCUMENT')}
            className="rounded-2xl border border-red-100 bg-white px-4 py-3.5 text-sm font-black text-red-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10"
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
              className="rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-black text-slate-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-3">
          {BOOK_CATEGORY_FILTER_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => onTabChange(option.value)}
              className={activeTab === option.value
                ? "rounded-full bg-red-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5 hover:bg-red-700"
                : "rounded-full border border-red-100 bg-white px-5 py-2.5 text-sm font-black text-slate-500 transition-all hover:-translate-y-0.5 hover:border-red-300 hover:text-red-700"}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 rounded-full border border-red-100 bg-white px-5 py-3 shadow-sm">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="cursor-pointer border-none bg-transparent py-0 text-sm font-black text-red-700 outline-none focus:ring-0"
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
