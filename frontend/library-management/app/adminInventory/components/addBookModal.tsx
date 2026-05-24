import React, { useEffect, useMemo, useState } from 'react';
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

  const previewUrl = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    if (book?.coverImage) return resolveAssetUrl(book.coverImage);
    return '';
  }, [book?.coverImage, image]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 flex flex-col">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
          <h2 className="font-headline font-bold text-2xl">{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-error/10 hover:text-error rounded-full transition-colors text-slate-400">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Book Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" placeholder="e.g. The Grand Library" type="text" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Author</label>
              <input required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" placeholder="Full name" type="text" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">ISBN</label>
              <input required value={isbn} onChange={(e) => setIsbn(e.target.value)} disabled={isEditMode} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4 disabled:bg-surface-variant disabled:text-on-surface-variant" placeholder="978..." type="text" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as BookCategory)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4">
                {BOOK_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Year</label>
              <input required value={yearOfPublication} onChange={(e) => setYearOfPublication(Number(e.target.value))} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" type="number" min="1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Quantity</label>
              <input required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Type</label>
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value as 'BOOK' | 'DOCUMENT')} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4">
                <option value="BOOK">Book</option>
                <option value="DOCUMENT">Document</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Cover Image</label>
            {previewUrl ? (
              <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-outline-variant bg-surface-variant/20">
                <Image
                  src={previewUrl}
                  alt={title || 'Book cover preview'}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-variant/20 text-sm font-semibold text-on-surface-variant">
                No cover image selected.
              </div>
            )}
            <input onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" type="file" accept="image/*" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Online Access URL</label>
            <input value={bookOnlineUrl} onChange={(e) => setBookOnlineUrl(e.target.value)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" placeholder="https://..." type="url" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Document File</label>
            <input onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} className="w-full rounded-xl border-outline-variant focus:border-primary focus:ring-primary/20 text-sm py-3.5 px-4" type="file" />
          </div>

          <div className="sticky bottom-0 -mx-6 -mb-6 mt-2 flex gap-4 border-t border-outline-variant bg-white px-6 py-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-outline-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-variant transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-4 vibrant-gradient-bg text-white rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-md">
              {isEditMode ? 'Update Book' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
