export * from './interfaceBook';
import type { BookCategoryFilter } from '@/lib/book-category';
import { IBook } from './interfaceBook';

export interface IBookCatalogResponse {
  data: IBook[];
  totalPages: number;
  totalItems?: number;
}

export interface IBookCatalogParams {
  page: number;
  limit: number;
  sortBy?: string;
  category?: BookCategoryFilter;
  searchTerm?: string;
  searchField?: 'Title' | 'Author' | 'Isbn';
  documentType?: 'ALL' | 'BOOK' | 'DOCUMENT';
}
