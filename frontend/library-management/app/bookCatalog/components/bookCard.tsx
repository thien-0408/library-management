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
      className="group catalog-panel relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--catalog-border-strong)] hover:shadow-[0_28px_70px_-42px_rgba(72,58,34,0.38)]"
      onClick={() => onOpenDetail(book)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--catalog-panel-muted)]">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm ${
            book.isAvailable ? 'bg-white/95 text-[var(--catalog-accent)]' : 'bg-[rgba(44,38,31,0.82)] text-white'
          }`}>
            {book.isAvailable ? 'Available' : 'Borrowed'}
          </span>
        </div>
      </div>

      <div className="absolute left-4 right-4 top-4 z-20 flex justify-between">
        <span className="rounded-full bg-slate-900/60 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md">
          {getBookCategoryLabel(book.category)}
        </span>
        {book.averageRating !== undefined && book.averageRating > 0 && (
          <span className="rounded-full bg-slate-900/60 px-3 py-1.5 text-xs font-black text-amber-400 backdrop-blur-md flex items-center gap-1">
            <i className="fa-solid fa-star"></i>
            {book.averageRating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--catalog-text-muted)]">
          <span>{getBookCategoryLabel(book.category)}</span>
          <span className="h-1 w-1 rounded-full bg-[var(--catalog-border-strong)]"></span>
          <span>{book.year}</span>
        </div>

        <h3 className="font-headline line-clamp-2 text-[1.25rem] font-black leading-tight tracking-[-0.03em] text-[var(--catalog-text)] transition-colors group-hover:text-[var(--catalog-accent)]">
          {book.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm font-black text-[var(--catalog-accent)]">
          {book.author}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--catalog-text-muted)]">
          {book.description}
        </p>

        <div className="catalog-panel-muted mt-4 flex items-center justify-between rounded-[1.35rem] px-3 py-2.5 text-sm text-[var(--catalog-text-muted)]">
          <span className="font-bold">{book.documentType}</span>
          <span className="font-black text-[var(--catalog-text)]">{book.availableCopies} available</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {book.isAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRequestBook) onRequestBook(book, 'OFFLINE');
              }}
              className={`catalog-accent-button flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-[13px] font-black transition ${hasOnlineAccess ? 'col-span-1' : 'col-span-2'}`}
            >
              Borrow Offline
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onPlaceHold) onPlaceHold(book);
              }}
              className={`catalog-accent-button flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-[13px] font-black transition ${hasOnlineAccess ? 'col-span-1' : 'col-span-2'}`}
            >
              Place Hold
            </button>
          )}

          {hasOnlineAccess && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/reader?url=${encodeURIComponent(book.documentFileUrl || book.bookOnlineUrl || '')}`;
              }}
              className="catalog-outline-button flex w-full col-span-1 items-center justify-center rounded-lg px-3 py-2.5 text-[13px] font-black transition"
            >
              Read Online
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
