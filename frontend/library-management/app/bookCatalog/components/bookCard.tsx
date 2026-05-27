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
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-red-100 bg-white shadow-[0_18px_50px_-40px_rgba(153,27,27,0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-[0_24px_70px_-42px_rgba(153,27,27,0.6)]"
      onClick={() => onOpenDetail(book)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-red-50">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3">
          <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] shadow-sm backdrop-blur ${
            book.isAvailable ? 'bg-white/95 text-red-700' : 'bg-slate-950/80 text-white'
          }`}>
            {book.isAvailable ? 'Available' : 'Borrowed'}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          <span>{getBookCategoryLabel(book.category)}</span>
          <span className="h-1 w-1 rounded-full bg-red-200"></span>
          <span>{book.year}</span>
        </div>

        <h3 className="font-headline line-clamp-2 text-lg font-black leading-snug text-slate-950 transition-colors group-hover:text-red-700">
          {book.title}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm font-black text-red-700">
          {book.author}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {book.description}
        </p>

        <div className="mt-3 flex items-center justify-between rounded-2xl bg-red-50 px-3 py-2 text-sm text-slate-500">
          <span className="font-bold">{book.documentType}</span>
          <span className="font-black text-slate-900">{book.availableCopies} available</span>
        </div>

        <div className="mt-4 grid gap-2">
          {book.isAvailable ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onRequestBook) onRequestBook(book, 'OFFLINE');
              }}
              className="flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition-all hover:bg-red-700"
            >
              Borrow Offline
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onPlaceHold) onPlaceHold(book);
              }}
              className="flex w-full items-center justify-center rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition-all hover:bg-red-700"
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
              className="flex w-full items-center justify-center rounded-2xl border border-red-200 px-4 py-3 text-sm font-black text-red-700 transition-all hover:bg-red-50"
            >
              Read Online
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
