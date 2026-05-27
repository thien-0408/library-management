import React from 'react';
import { InventoryBook } from '../types';

interface InventoryTableProps {
  inventory: InventoryBook[];
  onEditBook: (book: InventoryBook) => void;
  onDeleteBook: (isbn: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, onEditBook, onDeleteBook }) => {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-[0_18px_55px_-42px_rgba(153,27,27,0.55)]">
      <div className="flex items-center justify-between border-b border-red-100 px-8 py-6">
        <h3 className="font-headline text-xl font-black text-slate-950">Current Inventory</h3>
        <div className="flex gap-2">
          <button className="rounded-xl bg-red-50 p-2.5 text-red-600 transition-colors hover:bg-red-100">
            <i className="fa-solid fa-filter text-sm"></i>
          </button>
          <button className="rounded-xl bg-red-50 p-2.5 text-red-600 transition-colors hover:bg-red-100">
            <i className="fa-solid fa-arrow-down-a-z text-sm"></i>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-red-100 bg-red-50/60">
            <tr>
              <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Cover</th>
              <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Book Title</th>
              <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Author</th>
              <th className="px-4 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Quantity</th>
              <th className="px-8 py-4 text-right text-[11px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-50">
            {inventory.map(book => (
              <tr key={book.id} className="group transition-colors hover:bg-red-50/50">
                <td className="px-8 py-4">
                  <div className="h-16 w-12 overflow-hidden rounded-lg shadow-sm ring-1 ring-red-100">
                    <img className="w-full h-full object-cover" src={book.coverImage} alt={book.title} />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-black text-slate-950">{book.title}</p>
                  <p className="mt-1 text-[11px] font-medium text-slate-400">{book.isbn}</p>
                </td>
                <td className="px-4 py-4 text-sm font-bold text-slate-500">{book.author}</td>
                <td className="px-4 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${book.quantity > 10 ? 'bg-green-100 text-green-800' :
                    book.quantity > 0 ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {book.quantity} Available
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => onEditBook(book)} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-700">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onClick={() => onDeleteBook(book.isbn)} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-700">
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
