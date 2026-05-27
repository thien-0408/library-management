import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  BOOK_CATEGORY_OPTIONS,
  type BookCategory,
} from '@/lib/book-category';
import { resolveAssetUrl } from '@/lib/api';
import { AddBookPayload, InventoryBook } from '../types';

interface AddBookModalProps {
  isOpen: boolean;
  book?: InventoryBook | null;
  onClose: () => void;
  onSaveBook: (payload: AddBookPayload) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, book, onClose, onSaveBook }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [category, setCategory] = useState<BookCategory>('GENERAL');
  const [yearOfPublication, setYearOfPublication] = useState(new Date().getFullYear());
  const [quantity, setQuantity] = useState(1);
  const [documentType, setDocumentType] = useState<'BOOK' | 'DOCUMENT'>('BOOK');
  const [bookOnlineUrl, setBookOnlineUrl] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const isEditMode = Boolean(book);

  const previewUrl = image ? URL.createObjectURL(image) : book?.coverImage ? resolveAssetUrl(book.coverImage) : '';

  useEffect(() => {
    if (!isOpen) return;

    setTitle(book?.title || '');
    setAuthor(book?.author || '');
    setIsbn(book?.isbn || '');
    setCategory(book?.category || 'GENERAL');
    setYearOfPublication(book?.yearOfPublication || new Date().getFullYear());
    setQuantity(book?.quantity ?? 1);
    setDocumentType(book?.documentType || 'BOOK');
    setBookOnlineUrl(book?.bookOnlineUrl || '');
    setDocumentFile(null);
    setImage(null);
  }, [book, isOpen]);

  useEffect(() => {
    if (!image || !previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [image, previewUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBook({ title, author, isbn, category, yearOfPublication, quantity, documentType, image, bookOnlineUrl, documentFile });
  };

  return (
    <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm duration-200 fade-in">
      <div className="flex max-h-[90vh] w-full max-w-3xl animate-in flex-col overflow-hidden rounded-[2rem] border border-red-100 bg-white shadow-2xl duration-300 slide-in-from-bottom-10">
        <div className="flex shrink-0 items-center justify-between border-b border-red-100 bg-red-50/60 px-6 py-4">
          <h2 className="font-headline text-2xl font-black text-slate-950">{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white hover:text-red-700">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Book Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10" placeholder="e.g. The Grand Library" type="text" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Author</label>
              <input required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10" placeholder="Full name" type="text" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">ISBN</label>
              <input required value={isbn} onChange={(e) => setIsbn(e.target.value)} disabled={isEditMode} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10 disabled:bg-red-50 disabled:text-slate-400" placeholder="978..." type="text" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as BookCategory)} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10">
                {BOOK_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Year</label>
              <input required value={yearOfPublication} onChange={(e) => setYearOfPublication(Number(e.target.value))} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10" type="number" min="1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Quantity</label>
              <input required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Type</label>
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value as 'BOOK' | 'DOCUMENT')} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10">
                <option value="BOOK">Book</option>
                <option value="DOCUMENT">Document</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Cover Image</label>
            {previewUrl ? (
              <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-red-100 bg-red-50/40">
                <Image
                  src={previewUrl}
                  alt={title || 'Book cover preview'}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/40 text-sm font-bold text-slate-500">
                No cover image selected.
              </div>
            )}
            <input onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10" type="file" accept="image/*" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Online Access URL</label>
            <input value={bookOnlineUrl} onChange={(e) => setBookOnlineUrl(e.target.value)} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10" placeholder="https://..." type="url" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Document File</label>
            <input onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} className="w-full rounded-2xl border border-red-100 px-4 py-3.5 text-sm font-bold outline-none focus:border-red-300 focus:ring-4 focus:ring-red-500/10" type="file" />
          </div>

          <div className="sticky bottom-0 -mx-6 -mb-6 mt-2 flex gap-4 border-t border-red-100 bg-white px-6 py-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-red-100 py-4 font-black text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700">
              Cancel
            </button>
            <button type="submit" className="flex-1 rounded-2xl bg-red-600 py-4 font-black text-white shadow-lg shadow-red-100 transition-all hover:bg-red-700 active:scale-[0.98]">
              {isEditMode ? 'Update Book' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
