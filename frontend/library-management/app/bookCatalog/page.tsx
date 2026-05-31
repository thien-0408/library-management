'use client';

import React, { useState } from 'react';
import Header from '@/components/header';
import BookCard from '@/app/bookCatalog/components/bookCard';
import { IBook } from '@/app/bookCatalog/types';
import BookDetailModal from '@/app/bookCatalog/components/bookDetailModal';
import Toast from '@/components/toast_notification';
import { useToast } from '@/hooks/useToast';
import CatalogFilter from '@/app/bookCatalog/components/catalogFilter';
import Pagination from '@/app/bookCatalog/components/pagination';
import { useBookCatalog } from '@/app/bookCatalog/hooks/useBookCatalog';
import type { BorrowMode } from '@/app/bookCatalog/services/api';
import { CardGridSkeleton } from '@/components/skeleton_loader';

export default function CatalogPage() {
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toastConfig, showToast, hideToast } = useToast();

  const {
    books,
    isLoading,
    error,
    currentPage,
    totalPages,
    sortBy,
    activeTab,
    searchTerm,
    searchField,
    documentType,
    handleTabChange,
    handleSortChange,
    handlePageChange,
    handleSearchChange,
    handleSearchFieldChange,
    handleDocumentTypeChange,
    clearSearch,
    handleRequestBook: requestBookApi,
    handlePlaceHold: placeHoldApi,
  } = useBookCatalog();

  const handleOpenDetail = (book: IBook) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const onBookRequest = async (book: IBook, borrowMode: BorrowMode) => {
    const isSuccess = await requestBookApi(book, borrowMode);
    if (isSuccess) {
      showToast('Book requested successfully', borrowMode === 'ONLINE' ? 'Online access is ready in your borrow history.' : "You'll receive an offline borrow code for pickup.", 'success');
      setIsModalOpen(false);
    } else {
      showToast('Request Failed', 'Could not process request at this time. Please check your connection.', 'error');
    }
  };

  const onPlaceHold = async (book: IBook) => {
    const isSuccess = await placeHoldApi(book);
    if (isSuccess) {
      showToast('Hold placed successfully', "You'll be notified when a copy is available.", 'success');
      setIsModalOpen(false);
    } else {
      showToast('Hold Failed', 'Could not place hold at this time. Please check your connection.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0e8] font-body text-slate-950">
      <Header />

      <main className="app-shell-main app-shell-content page-shell mx-auto w-full max-w-7xl flex-grow px-5 pb-16 md:px-8">
        <header data-aos="fade-in" data-aos-duration="300" className="relative mb-8 overflow-hidden rounded-[2.25rem] border border-red-100 bg-white px-6 py-8 shadow-[0_24px_80px_-48px_rgba(153,27,27,0.45)] sm:px-8 lg:px-10 lg:py-10">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Curated collection
              </div>
              <h1 className="mt-5 max-w-3xl font-headline text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-6xl">
                Explore books, documents, and research spaces with clarity.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Search the OpenBook archive, request physical copies, read online documents, and place holds from one focused red-and-white workspace.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-[1.75rem] border border-red-100 bg-red-50/70 p-3 text-center">
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <p className="text-2xl font-black text-red-700">1.24M</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Volumes</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <p className="text-2xl font-black text-red-700">24/7</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Access</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4 shadow-sm">
                <p className="text-2xl font-black text-red-700">98%</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">Fulfilled</p>
              </div>
            </div>
          </div>
        </header>

        <CatalogFilter 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
            sortBy={sortBy} 
            onSortChange={handleSortChange} 
            searchTerm={searchTerm}
            searchField={searchField}
            documentType={documentType}
            onSearchChange={handleSearchChange}
            onSearchFieldChange={handleSearchFieldChange}
            onDocumentTypeChange={handleDocumentTypeChange}
            onClearSearch={clearSearch}
        />

        {error && (
            <div className="mb-8 rounded-[1.5rem] border border-red-100 bg-white px-6 py-8 text-center font-bold text-red-700 shadow-sm">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                {error}
            </div>
        )}

        {isLoading ? (
            <CardGridSkeleton count={8} />
        ) : (
            <section key={`${activeTab}-${sortBy}-${currentPage}`} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.length > 0 ? (
              books.map((book, index) => (
                <div data-aos="fade-up" data-aos-delay={index * 100} key={book.id}>
                  <BookCard
                     book={book}
                    onOpenDetail={handleOpenDetail}
                    onRequestBook={onBookRequest}
                    onPlaceHold={onPlaceHold}
                  />
                </div>
              ))
            ) : (
                <div className="col-span-1 rounded-[2rem] border border-red-100 bg-white py-20 text-center text-slate-500 shadow-sm sm:col-span-2 lg:col-span-3 xl:col-span-4">
                    <i className="fa-solid fa-magnifying-glass mb-4 text-4xl text-red-200"></i>
                    <h2 className="font-headline text-2xl font-black text-slate-950">No matching items</h2>
                    <p className="mt-2 font-medium">Try another title, author, ISBN, category, or document type.</p>
                </div>
            )}
            </section>
        )}

        {!isLoading && !error && (
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        )}

      </main>

      <BookDetailModal
        isOpen={isModalOpen}
        selectedBook={selectedBook}
        onClose={() => setIsModalOpen(false)}
        onRequestBook={onBookRequest}
        onPlaceHold={onPlaceHold}
      />

      <Toast
        isVisible={toastConfig.isVisible}
        type={toastConfig.type}
        title={toastConfig.title}
        description={toastConfig.description}
        onClose={hideToast}
      />
    </div>
  );
}
