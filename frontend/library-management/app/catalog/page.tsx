"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import BookCard from "@/app/bookCatalog/components/bookCard";
import { IBook } from "@/app/bookCatalog/types";
import BookDetailModal from "@/app/bookCatalog/components/bookDetailModal";
import Toast from "@/components/toast_notification";
import { useToast } from "@/hooks/useToast";
import CatalogFilter from "@/app/bookCatalog/components/catalogFilter";
import Pagination from "@/app/bookCatalog/components/pagination";
import { useBookCatalog } from "@/app/bookCatalog/hooks/useBookCatalog";
import type { BorrowMode } from "@/app/bookCatalog/services/api";
import { CardGridSkeleton } from "@/components/skeleton_loader";
import { BOOK_CATEGORY_FILTER_OPTIONS } from "@/lib/book-category";

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
      showToast(
        "Book requested successfully",
        borrowMode === "ONLINE"
          ? "Online access is ready in your borrow history."
          : "You'll receive an offline borrow code for pickup.",
        "success",
      );
      setIsModalOpen(false);
    } else {
      showToast(
        "Request Failed",
        "Could not process request at this time. Please check your connection.",
        "error",
      );
    }
  };

  const onPlaceHold = async (book: IBook) => {
    const isSuccess = await placeHoldApi(book);
    if (isSuccess) {
      showToast(
        "Hold placed successfully",
        "You'll be notified when a copy is available.",
        "success",
      );
      setIsModalOpen(false);
    } else {
      showToast(
        "Hold Failed",
        "Could not place hold at this time. Please check your connection.",
        "error",
      );
    }
  };

  const highlightedBooks = books.slice(0, 4);
  const featuredCategories = BOOK_CATEGORY_FILTER_OPTIONS.slice(1, 5);
  const categoryFallbackImages: Record<string, string> = {
    GENERAL: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    FICTION: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=900&q=80",
    NON_FICTION: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
    SCIENCE: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80",
  };

  const defaultCategoryImage = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80";

  return (
    <div className="relative min-h-screen bg-white font-body text-[#1d1d1d] z-0">
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-[#e3dcd1] rounded-br-[6rem] md:rounded-br-[10rem] -z-10 pointer-events-none" />

      <Header />

      <main className="app-shell-main app-shell-content mx-auto w-full max-w-[96rem] px-4 pb-12 pt-24 sm:px-6 md:px-8 lg:pt-10 xl:px-10">
        <div className="grid gap-12">
          <div className="space-y-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between xl:block">
              <div>
                <h1 className="font-headline text-[3rem] font-black leading-none tracking-[-0.04em] text-black">
                  Discover
                </h1>
              </div>
            </div>

            <div className="max-w-3xl">
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
            </div>



            <section className="mt-8">
              <div className="mb-10 flex items-center justify-between gap-4">
                <h2 className="text-[1.75rem] font-medium text-[#3f3a33]">
                  Book Category
                </h2>
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-[#dfd8ca] bg-transparent text-[#3f3a33] transition-colors hover:bg-white"
                >
                  <i className="fa-solid fa-sliders"></i>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:gap-8">
                {featuredCategories.map((category, index) => {
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => handleTabChange(category.value)}
                      className="group relative flex flex-col items-center pt-16"
                    >
                      <div className="absolute top-0 z-10 w-[7.5rem] h-[10.5rem] rounded-lg shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:-translate-y-2 sm:w-32 sm:h-44">
                        <img
                          src={categoryFallbackImages[category.value] || defaultCategoryImage}
                          alt={category.label}
                          className="h-full w-full rounded-lg object-cover ring-1 ring-black/5"
                        />
                      </div>
                      <div className="w-full pt-28 sm:pt-32 pb-5 rounded-[1.5rem] bg-[#f6f4f0] text-center transition-colors group-hover:bg-[#f0ebe1]">
                        <p className="mt-4 text-[1.1rem] font-bold text-[#22201b]">
                          {category.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {!isLoading && !error && books.length > 0 && (
              <section className="space-y-5 mt-8 border-t border-[#ece5d7] pt-12">
                <h2 className="text-[1.75rem] font-medium text-[#3f3a33] mb-6">
                  All Books
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {books.map((book, index) => (
                    <div
                      data-aos="fade-up"
                      data-aos-delay={index * 80}
                      key={book.id}
                    >
                      <BookCard
                        book={book}
                        onOpenDetail={handleOpenDetail}
                        onRequestBook={onBookRequest}
                        onPlaceHold={onPlaceHold}
                      />
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </section>
            )}

            {!isLoading && !error && books.length === 0 && (
              <div className="rounded-[1.8rem] border border-[#ece5d7] py-20 text-center text-[#8b8579] bg-white">
                <i className="fa-solid fa-magnifying-glass mb-4 text-4xl text-[#c9c0b1]"></i>
                <h2 className="font-headline text-2xl font-black text-[#1d1d1d]">
                  No matching items
                </h2>
                <p className="mt-2 font-medium">
                  Try another title, author, ISBN, category, or document type.
                </p>
              </div>
            )}
          </div>
        </div>
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
