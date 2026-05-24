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
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
      <Header />

      <main className="app-shell-main app-shell-content page-shell px-6 md:px-8 max-w-7xl mx-auto flex-grow w-full">
        {/* Banner Section */}
        <header data-aos="fade-in" data-aos-duration="300" className="mb-12">
          <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Explore the Collection
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            Access thousands of rare manuscripts, modern masterpieces, and scholarly journals curated for the curious mind.
          </p>
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
            <div className="text-center py-10 bg-red-50 text-red-600 rounded-lg mb-8">
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
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-20 text-on-surface-variant rounded-2xl border border-outline-variant bg-white">
                    <i className="fa-solid fa-magnifying-glass text-4xl text-outline mb-4"></i>
                    <h2 className="font-headline text-2xl font-bold text-on-surface">No matching items</h2>
                    <p className="mt-2">Try another title, author, ISBN, category, or document type.</p>
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
