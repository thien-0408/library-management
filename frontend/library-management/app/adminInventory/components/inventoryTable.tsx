import React from 'react';
import { InventoryBook } from '../types';

interface InventoryTableProps {
  inventory: InventoryBook[];
  onEditBook: (book: InventoryBook) => void;
  onDeleteBook: (isbn: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, onEditBook, onDeleteBook }) => {
  return (
    <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-8 py-6 border-b border-outline-variant">
        <h3 className="font-headline font-bold text-xl">Current Inventory</h3>
        <div className="flex gap-2">
          <button className="p-2.5 rounded-lg bg-surface-variant text-on-surface-variant hover:bg-outline-variant hover:text-primary transition-colors">
            <i className="fa-solid fa-filter text-sm"></i>
          </button>
          <button className="p-2.5 rounded-lg bg-surface-variant text-on-surface-variant hover:bg-outline-variant hover:text-primary transition-colors">
            <i className="fa-solid fa-arrow-down-a-z text-sm"></i>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-variant/30 border-b border-outline-variant/50">
            <tr>
              <th className="px-8 py-4 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant/70">Cover</th>
              <th className="px-4 py-4 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant/70">Book Title</th>
              <th className="px-4 py-4 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant/70">Author</th>
              <th className="px-4 py-4 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant/70">Quantity</th>
              <th className="px-8 py-4 font-bold text-[11px] uppercase tracking-widest text-on-surface-variant/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/50">
            {inventory.map(book => (
              <tr key={book.id} className="group hover:bg-surface-variant/20 transition-colors">
                <td className="px-8 py-4">
                  <div className="w-12 h-16 rounded shadow-sm overflow-hidden ring-1 ring-outline-variant">
                    <img className="w-full h-full object-cover" src={book.coverImage} alt={book.title} />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold text-on-surface">{book.title}</p>
                  <p className="text-[11px] text-on-surface-variant font-medium mt-1">{book.isbn}</p>
                </td>
                <td className="px-4 py-4 text-sm font-medium text-on-surface-variant">{book.author}</td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${book.quantity > 10 ? 'bg-green-100 text-green-800' :
                    book.quantity > 0 ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                    }`}>
                    {book.quantity} Available
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onEditBook(book)} className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => onDeleteBook(book.isbn)} className="p-2 text-slate-400 hover:text-error transition-colors hover:bg-error/10 rounded-lg">
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
