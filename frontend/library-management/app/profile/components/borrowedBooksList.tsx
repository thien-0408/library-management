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
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-3 font-headline text-2xl font-black text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600"><i className="fa-solid fa-book-open"></i></span> My Borrowed Books
        </h2>
        <a href="#" className="text-sm font-black text-red-700 hover:underline">View History</a>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {books.map((book) => (
          <div key={book.id} className="group flex cursor-pointer gap-5 rounded-[1.75rem] border border-red-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_18px_55px_-38px_rgba(153,27,27,0.55)]">
            <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-red-100">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col justify-between py-1">
              <div>
                <h3 className="line-clamp-2 text-sm font-black leading-tight text-slate-950 transition-colors group-hover:text-red-700">
                  {book.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500">{book.author}</p>
                {book.isbn && <p className="mt-1 text-[11px] text-slate-400">ISBN {book.isbn}</p>}
                {book.borrowMode && <p className="mt-1 text-[11px] font-black text-red-700">{book.borrowMode}</p>}
              </div>
              <div className="mt-4 space-y-2">
                {book.offlineBorrowCode && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Borrow Code</p>
                    <p className="mt-0.5 text-sm font-black text-red-700">{book.offlineBorrowCode}</p>
                  </div>
                )}
                {book.onlineAccessUrl && (
                  <a href={resolveAssetUrl(book.onlineAccessUrl) || book.onlineAccessUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-red-600 px-3 py-2 text-xs font-black text-white hover:bg-red-700">
                    Open Online Access
                  </a>
                )}
                {book.borrowMode === 'OFFLINE' && onReturnBook && (
                  <button
                    type="button"
                    disabled={returningBookId === book.id}
                    onClick={() => onReturnBook(book)}
                    className="inline-flex rounded-full border border-red-200 px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {returningBookId === book.id ? 'Returning...' : 'Return Book'}
                  </button>
                )}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Due Date</p>
                  <p className={`mt-0.5 text-sm font-black ${book.isOverdue ? 'text-red-700' : 'text-red-600'}`}>
                    {book.dueDate} {book.isOverdue && '(Overdue)'}
                  </p>
                </div>
                {book.warningMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600 leading-relaxed">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                    {book.warningMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="group flex min-h-[140px] cursor-pointer items-center justify-center rounded-[1.75rem] border-2 border-dashed border-red-200 bg-white/70 p-5 transition-all hover:border-red-300 hover:bg-red-50">
          <div className="text-center">
            <i className="fa-solid fa-circle-plus mb-2 text-4xl text-red-200 transition-colors group-hover:text-red-600"></i>
            <p className="text-sm font-black text-slate-500 transition-colors group-hover:text-red-700">Borrow New</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBooksList;
