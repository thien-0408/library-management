import React from 'react';
import { InventoryBook } from '../types';

interface InventoryTableProps {
  inventory: InventoryBook[];
  onEditBook: (book: InventoryBook) => void;
  onDeleteBook: (isbn: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, onEditBook, onDeleteBook }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-outline-variant bg-[var(--catalog-panel)] shadow-soft-card">
      <div className="flex items-center justify-between border-b border-outline-variant px-8 py-6">
        <h3 className="font-headline text-xl font-black text-on-surface">Current Inventory</h3>
        <div className="flex gap-2">
          <button className="rounded-xl bg-primary-container p-2.5 text-primary transition-colors hover:bg-[#cfe0d2]">
            <i className="fa-solid fa-filter text-sm"></i>
          </button>
          <button className="rounded-xl bg-primary-container p-2.5 text-primary transition-colors hover:bg-[#cfe0d2]">
            <i className="fa-solid fa-arrow-down-a-z text-sm"></i>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-outline-variant bg-surface-variant/60">
            <tr>
              <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Cover</th>
              <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Book Title</th>
              <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Author</th>
              <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Quantity</th>
              <th className="px-8 py-4 text-right text-[11px] font-black uppercase tracking-widest text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60">
            {inventory.map(book => (
              <tr key={book.id} className="group transition-colors hover:bg-surface-variant/50">
                <td className="px-8 py-4">
                  <div className="h-16 w-12 overflow-hidden rounded-lg shadow-sm ring-1 ring-outline-variant">
                    <img className="w-full h-full object-cover" src={book.coverImage} alt={book.title} />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-black text-on-surface">{book.title}</p>
                  <p className="mt-1 text-[11px] font-medium text-on-surface-variant/70">{book.isbn}</p>
                </td>
                <td className="px-4 py-4 text-sm font-bold text-on-surface-variant">{book.author}</td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${book.quantity > 10 ? 'bg-primary-container text-on-primary-container' :
                    book.quantity > 0 ? 'bg-[var(--catalog-warm-accent)]/60 text-on-surface' : 'bg-error-container text-on-error-container'
                    }`}>
                    {book.quantity} Available
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onEditBook(book)} className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-primary-container hover:text-primary">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => onDeleteBook(book.isbn)} className="rounded-xl p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
