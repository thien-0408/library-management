import { useState, useEffect, useCallback, useDeferredValue } from 'react';
import type { BookCategoryFilter } from '@/lib/book-category';
import { IBook } from '../types';
import { bookCatalogService, type BorrowMode } from '../services/api';

export const useBookCatalog = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('Recently Added');
  const [activeTab, setActiveTab] = useState<BookCategoryFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'Title' | 'Author' | 'Isbn'>('Title');
  const [documentType, setDocumentType] = useState<'ALL' | 'BOOK' | 'DOCUMENT'>('ALL');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookCatalogService.getBooks({
        page: currentPage,
        limit: 6, // Hiển thị 6 sách mỗi trang
        sortBy,
        category: activeTab,
        searchTerm: deferredSearchTerm,
        searchField,
        documentType,
      });

      setBooks(response.data || []);
      setTotalPages(response.totalPages || 0);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải danh sách sách. Vui lòng kiểm tra lại kết nối Backend.";
      setError(message);
      console.error("fetchBooks error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortBy, activeTab, deferredSearchTerm, searchField, documentType]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleTabChange = (tab: BookCategoryFilter) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSearchFieldChange = (value: 'Title' | 'Author' | 'Isbn') => {
    setSearchField(value);
    setCurrentPage(1);
  };

  const handleDocumentTypeChange = (value: 'ALL' | 'BOOK' | 'DOCUMENT') => {
    setDocumentType(value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchField('Title');
    setDocumentType('ALL');
    setCurrentPage(1);
  };

  const handleRequestBook = async (book: IBook, borrowMode: BorrowMode = 'OFFLINE'): Promise<boolean> => {
    try {
      await bookCatalogService.requestBook(book.isbn, borrowMode);
      await fetchBooks();
      return true;
    } catch (err: unknown) {
      console.error("requestBook error:", err);
      return false;
    }
  };

  const handlePlaceHold = async (book: IBook): Promise<boolean> => {
    try {
      await bookCatalogService.placeHold(book.isbn);
      await fetchBooks();
      return true;
    } catch (err: unknown) {
      console.error("placeHold error:", err);
      return false;
    }
  };

  return {
    books,
    isLoading,
    error,
    currentPage,
    totalPages,
    sortBy,
    activeTab,
    searchTerm,
    searchField,
    documentType,
    handleTabChange,
    handleSortChange,
    handlePageChange,
    handleSearchChange,
    handleSearchFieldChange,
    handleDocumentTypeChange,
    clearSearch,
    handleRequestBook,
    handlePlaceHold,
    refreshData: fetchBooks
  };
};
