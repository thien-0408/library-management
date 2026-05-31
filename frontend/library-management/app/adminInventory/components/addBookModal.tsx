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
    <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm duration-300 fade-in">
      <div className="flex max-h-[90vh] w-full max-w-3xl animate-in flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] duration-300 slide-in-from-bottom-8">
        <div className="flex shrink-0 items-center justify-between px-8 py-7 bg-white">
          <h2 className="font-headline text-[1.75rem] font-black text-[#1d1d1d]">{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fbfaf8] text-[#8f877a] transition-colors hover:bg-[#f4f2ec] hover:text-[#3f3a33]">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto px-8 pb-8 pt-2 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Book Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-4 text-[15px] font-bold text-[#3f3a33] outline-none transition-all placeholder:text-[#bbb3a6] focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15" placeholder="e.g. The Grand Library" type="text" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Author</label>
              <input required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-4 text-[15px] font-bold text-[#3f3a33] outline-none transition-all placeholder:text-[#bbb3a6] focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15" placeholder="Full name" type="text" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">ISBN</label>
              <input required value={isbn} onChange={(e) => setIsbn(e.target.value)} disabled={isEditMode} className="w-full rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-4 text-[15px] font-bold text-[#3f3a33] outline-none transition-all placeholder:text-[#bbb3a6] focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15 disabled:cursor-not-allowed disabled:bg-[#f4f2ec] disabled:text-[#8f877a]" placeholder="978..." type="text" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as BookCategory)} className="w-full rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-4 text-[15px] font-bold text-[#3f3a33] outline-none transition-all focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15">
                {BOOK_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Year</label>
              <input required value={yearOfPublication} onChange={(e) => setYearOfPublication(Number(e.target.value))} className="w-full rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-4 text-[15px] font-bold text-[#3f3a33] outline-none transition-all focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15" type="number" min="1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Quantity</label>
              <input required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-4 text-[15px] font-bold text-[#3f3a33] outline-none transition-all focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15" type="number" min="0" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Type</label>
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value as 'BOOK' | 'DOCUMENT')} className="w-full rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-4 text-[15px] font-bold text-[#3f3a33] outline-none transition-all focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15">
                <option value="BOOK">Book</option>
                <option value="DOCUMENT">Document</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Cover Image</label>
            {previewUrl ? (
              <div className="relative h-40 w-full overflow-hidden rounded-[1.25rem] border border-[#f4f2ec] bg-[#fbfaf8] shadow-sm">
                <Image
                  src={previewUrl}
                  alt={title || 'Book cover preview'}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-[1.25rem] border-2 border-dashed border-[#e6ddcc] bg-[#fbfaf8] text-sm font-bold text-[#bbb3a6]">
                No cover image selected.
              </div>
            )}
            <input onChange={(e) => setImage(e.target.files?.[0] || null)} className="w-full cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#f4f2ec] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#3f3a33] hover:file:bg-[#e6ddcc] rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-3 text-[15px] font-bold text-[#3f3a33] outline-none transition-all focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15" type="file" accept="image/*" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Online Access URL</label>
            <input value={bookOnlineUrl} onChange={(e) => setBookOnlineUrl(e.target.value)} className="w-full rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-4 text-[15px] font-bold text-[#3f3a33] outline-none transition-all placeholder:text-[#bbb3a6] focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15" placeholder="https://..." type="url" />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#bbb3a6]">Document File</label>
            <input onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} className="w-full cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-[#f4f2ec] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#3f3a33] hover:file:bg-[#e6ddcc] rounded-[1.25rem] border border-transparent bg-[#fbfaf8] px-5 py-3 text-[15px] font-bold text-[#3f3a33] outline-none transition-all focus:border-[#23493d] focus:bg-white focus:ring-4 focus:ring-[#23493d]/15" type="file" />
          </div>

          <div className="sticky bottom-0 -mx-8 -mb-8 mt-6 flex gap-4 border-t border-[#f4f2ec] bg-white/95 px-8 py-6 backdrop-blur-md">
            <button type="button" onClick={onClose} className="flex-1 rounded-[0.95rem] bg-[#fbfaf8] py-4 text-lg font-black text-[#8f877a] transition-colors hover:bg-[#f4f2ec] hover:text-[#3f3a33]">
              Cancel
            </button>
            <button type="submit" className="flex-1 rounded-[0.95rem] bg-[#23493d] py-4 text-lg font-black text-white shadow-lg shadow-[#23493d]/30 transition-all hover:bg-[#1d3f34] active:scale-[0.98]">
              {isEditMode ? 'Update Book' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
