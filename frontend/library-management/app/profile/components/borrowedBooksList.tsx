import React from 'react';
import { resolveAssetUrl } from '@/lib/api';
import { BorrowedBook } from '../types';

interface BorrowedBooksListProps {
  books: BorrowedBook[];
  returningBookId?: string | null;
  onReturnBook?: (book: BorrowedBook) => void;
}

const BorrowedBooksList: React.FC<BorrowedBooksListProps> = ({ books, returningBookId, onReturnBook }) => {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between border-b border-outline-variant pb-3">
        <h2 className="flex items-center gap-3 font-headline text-2xl font-black text-on-surface">
          <span className="grid h-8 w-8 place-items-center rounded bg-primary-container text-sm text-primary"><i className="fa-solid fa-book-open"></i></span> 
          My Borrowed Books
        </h2>
        <a href="#" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">View History</a>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {books.map((book) => (
          <div key={book.id} className="group flex cursor-pointer gap-5 rounded-xl border border-outline-variant bg-[var(--catalog-panel)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
            <div className="h-32 w-24 shrink-0 overflow-hidden rounded bg-surface-variant shadow-sm ring-1 ring-outline-variant">
              <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-between py-1">
              <div>
                <h3 className="line-clamp-2 text-sm font-black leading-tight text-on-surface transition-colors group-hover:text-primary">
                  {book.title}
                </h3>
                <p className="mt-1.5 text-xs font-medium text-on-surface-variant">{book.author}</p>
                {book.isbn && <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70">ISBN {book.isbn}</p>}
                {book.borrowMode && <p className="mt-1 text-[11px] font-black uppercase text-primary">{book.borrowMode}</p>}
              </div>
              <div className="mt-4 space-y-2.5">
                {book.offlineBorrowCode && (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Borrow Code</p>
                    <p className="mt-0.5 text-sm font-black text-primary">{book.offlineBorrowCode}</p>
                  </div>
                )}
                {book.onlineAccessUrl && (
                  <a href={resolveAssetUrl(book.onlineAccessUrl) || book.onlineAccessUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-on-primary transition-colors hover:bg-[#274c42]">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Open Access
                  </a>
                )}
                {book.borrowMode === 'OFFLINE' && onReturnBook && (
                  <button
                    type="button"
                    disabled={returningBookId === book.id}
                    onClick={() => onReturnBook(book)}
                    className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-primary transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <i className="fa-solid fa-arrow-rotate-left"></i>
                    {returningBookId === book.id ? 'Returning...' : 'Return Book'}
                  </button>
                )}
                <div className="flex items-center gap-2 border-t border-outline-variant pt-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Due</p>
                  <p className={`text-xs font-black ${book.isOverdue ? 'text-on-error-container' : 'text-primary'}`}>
                    {book.dueDate} {book.isOverdue && '(Overdue)'}
                  </p>
                </div>
                {book.warningMessage && (
                  <div className="rounded border border-error-container bg-error-container px-2.5 py-1.5 text-[10px] font-bold text-on-error-container">
                    <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>
                    {book.warningMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="group flex min-h-[160px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-outline-variant bg-[var(--catalog-panel)]/50 p-5 transition-all hover:border-primary/50 hover:bg-primary-container/50">
          <div className="text-center">
            <i className="fa-solid fa-plus mb-2 text-2xl text-on-surface-variant transition-colors group-hover:text-primary"></i>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant transition-colors group-hover:text-primary">Borrow New</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooksList;
