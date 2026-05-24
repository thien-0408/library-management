
import type { BookCategory } from '@/lib/book-category';

export interface IBook {
  id: string | number;
  title: string;
  isbn: string;
  author: string;
  category: BookCategory;
  year: number;
  description: string;
  coverImage: string;
  isAvailable: boolean;
  availableCopies: number;
  documentType: 'BOOK' | 'DOCUMENT';
  bookOnlineUrl?: string | null;
  documentFileUrl?: string | null;
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
}
