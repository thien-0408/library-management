import React from 'react';
import { getBookCategoryLabel } from '@/lib/book-category';
import { IBook } from '@/app/bookCatalog/types/interfaceBook';
import type { BorrowMode } from '@/app/bookCatalog/services/api';

interface BookCardProps {
  book: IBook;
  onOpenDetail: (book: IBook) => void;
  onRequestBook?: (book: IBook, borrowMode: BorrowMode) => void;
  onPlaceHold?: (book: IBook) => void;
}

export default function BookCard({ book, onOpenDetail, onRequestBook, onPlaceHold }: BookCardProps) {
  const hasOnlineAccess = Boolean(book.bookOnlineUrl || book.documentFileUrl);

  return (
    <div
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-outline-variant/40 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={() => onOpenDetail(book)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] shadow-sm backdrop-blur ${
            book.isAvailable ? 'bg-white/90 text-primary' : 'bg-surface-container-highest/90 text-on-surface-variant'
          }`}>
            {book.isAvailable ? 'Available' : 'Borrowed'}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant/70">
          <span>{getBookCategoryLabel(book.category)}</span>
          <span className="h-1 w-1 rounded-full bg-outline"></span>
          <span>{book.year}</span>
        </div>

        <h3 className="font-headline line-clamp-2 text-lg font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
          {book.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm font-semibold text-primary">
          {book.author}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-on-surface-variant">
          {book.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-sm text-on-surface-variant">
          <span className="font-medium">{book.documentType}</span>
          <span className="font-semibold text-on-surface">{book.availableCopies} available</span>
        </div>

        <div className="mt-4 grid gap-2">
          {book.isAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRequestBook) onRequestBook(book, 'OFFLINE');
              }}
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-all hover:brightness-110"
            >
              Borrow Offline
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onPlaceHold) onPlaceHold(book);
              }}
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary transition-all hover:brightness-110"
            >
              Place Hold
            </button>
          )}

          {hasOnlineAccess && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRequestBook) onRequestBook(book, 'ONLINE');
              }}
              className="flex w-full items-center justify-center rounded-xl border border-primary px-4 py-3 text-sm font-bold text-primary transition-all hover:bg-primary/5"
            >
              Read Online
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
