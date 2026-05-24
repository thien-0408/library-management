import { normalizeBookCategory } from '@/lib/book-category';
import { apiFetch, resolveAssetUrl } from '@/lib/api';
import type { IBookCatalogResponse, IBookCatalogParams, IBook } from '../types';

export type BorrowMode = 'OFFLINE' | 'ONLINE';

const searchParamByField = {
  Title: 'title',
  Author: 'author',
  Isbn: 'isbn',
} as const;

type ApiBook = {
  id?: string | number;
  title?: string;
  isbn?: string;
  author?: string | null;
  category?: string | null;
  yearOfPublication?: number | null;
  availableCopies?: number | null;
  imageUrl?: string | null;
  bookOnlineUrl?: string | null;
  documentFileUrl?: string | null;
  documentType?: 'BOOK' | 'DOCUMENT' | string | null;
  status?: 'AVAILABLE' | 'NOT_AVAILABLE' | string | null;
};

type PagedBooksResponse = {
  items?: ApiBook[];
  totalPages?: number;
  totalItems?: number;
};

const mapBook = (b: ApiBook): IBook => ({
  id: b.id || '',
  title: b.title || 'Untitled',
  isbn: b.isbn || '',
  author: b.author || 'Unknown',
  category: normalizeBookCategory(b.category),
  year: b.yearOfPublication || 0,
  description: `${b.documentType || 'BOOK'} • ${b.availableCopies ?? 0} available`,
  coverImage: resolveAssetUrl(b.imageUrl) || 'https://via.placeholder.com/200x300?text=No+Cover',
  isAvailable: (b.availableCopies ?? 0) > 0 && b.status !== 'NOT_AVAILABLE',
  availableCopies: b.availableCopies ?? 0,
  documentType: b.documentType === 'DOCUMENT' ? 'DOCUMENT' : 'BOOK',
  bookOnlineUrl: b.bookOnlineUrl || null,
  documentFileUrl: b.documentFileUrl || null,
  status: b.status === 'NOT_AVAILABLE' ? 'NOT_AVAILABLE' : 'AVAILABLE',
});

export const bookCatalogService = {
  getBooks: async (params: IBookCatalogParams): Promise<IBookCatalogResponse> => {
    const searchTerm = params.searchTerm?.trim();

    const data = await apiFetch<PagedBooksResponse | ApiBook[]>('/api/books', {
      params: {
        page: params.page,
        pageSize: params.limit,
        category: params.category && params.category !== 'ALL' ? params.category : undefined,
        documentType: params.documentType && params.documentType !== 'ALL' ? params.documentType : undefined,
        ...(searchTerm ? { [searchParamByField[params.searchField || 'Title']]: searchTerm } : {}),
      }
    });

    const result = data || {};
    const items = Array.isArray(result) ? result : result.items || [];
    const books = items.map(mapBook);

    return {
      data: books,
      totalPages: Array.isArray(result) ? 1 : result.totalPages || 1,
      totalItems: Array.isArray(result) ? books.length : result.totalItems || books.length,
    };
  },

  requestBook: async (bookIsbn: string, borrowMode: BorrowMode): Promise<void> => {
    await apiFetch('/api/books/requests', {
      method: 'POST',
      body: {
        bookIsbn,
        borrowMode,
      },
    });
  },

  placeHold: async (bookIsbn: string): Promise<void> => {
    await apiFetch('/api/books/holds', {
      method: 'POST',
      body: { bookIsbn },
    });
  }
};
