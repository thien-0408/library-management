"use client";

import React, { useEffect, useState } from "react";
import { readingListsApi } from "@/lib/reading-lists-api";
import type { ReadingListResponseDto } from "@/lib/api-types";
import Link from "next/link";

type ReadingListDetailModalProps = {
  listId: string | null;
  onClose: () => void;
};

export default function ReadingListDetailModal({ listId, onClose }: ReadingListDetailModalProps) {
  const [listDetails, setListDetails] = useState<ReadingListResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (listId) {
      fetchDetails();
    } else {
      setListDetails(null);
    }
  }, [listId]);

  const fetchDetails = async () => {
    if (!listId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await readingListsApi.getListDetails(listId);
      setListDetails(data);
    } catch (err: any) {
      setError(err.message || "Failed to load list details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string, bookTitle: string) => {
    if (!listId) return;
    if (!window.confirm(`Remove "${bookTitle}" from this list?`)) return;
    
    setIsRemoving(itemId);
    try {
      await readingListsApi.removeBookFromList(listId, itemId);
      // Refresh details
      await fetchDetails();
    } catch (err: any) {
      alert(err.message || "Failed to remove book");
    } finally {
      setIsRemoving(null);
    }
  };

  if (!listId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-nunito">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div 
        className="relative bg-[var(--catalog-panel)] w-full max-w-2xl rounded-[2rem] shadow-2xl border border-[var(--catalog-border)] overflow-hidden flex flex-col max-h-[90vh]"
        data-aos="zoom-in"
        data-aos-duration="250"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[var(--catalog-border-strong)] flex justify-between items-start bg-[var(--catalog-panel-muted)]">
          <div className="pr-8">
            <h2 className="text-2xl font-extrabold text-[var(--catalog-text)]">
              {listDetails?.name || "Loading..."}
            </h2>
            {listDetails?.description && (
              <p className="text-sm text-[var(--catalog-text-muted)] mt-2 font-medium">
                {listDetails.description}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--catalog-text-muted)] hover:text-[var(--catalog-accent)] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--catalog-panel)] transition-colors flex-shrink-0"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--catalog-accent)]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-3 border border-red-100">
              <i className="fa-solid fa-triangle-exclamation mt-1"></i>
              <p className="font-semibold text-sm">{error}</p>
            </div>
          ) : listDetails?.items && listDetails.items.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-[var(--catalog-panel-muted)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--catalog-text-muted)] text-2xl border border-[var(--catalog-border)]">
                <i className="fa-solid fa-book-open"></i>
              </div>
              <h3 className="text-lg font-bold text-[var(--catalog-text)]">This list is empty</h3>
              <p className="text-sm text-[var(--catalog-text-muted)] mt-2 mb-6">
                You haven't added any books to this list yet. Browse the catalog and click "Save to List" on any book.
              </p>
              <Link
                href="/catalog"
                className="catalog-accent-button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-colors"
                onClick={onClose}
              >
                <i className="fa-solid fa-magnifying-glass"></i>
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm font-bold text-[var(--catalog-text-muted)] flex items-center justify-between mb-2">
                <span>{listDetails?.itemCount} {listDetails?.itemCount === 1 ? 'book' : 'books'}</span>
              </div>
              
              {listDetails?.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[var(--catalog-panel)] border border-[var(--catalog-border)] hover:border-[var(--catalog-accent)] hover:shadow-md transition-all duration-200 gap-4"
                >
                  <div className="flex-grow">
                    <h4 className="font-bold text-[var(--catalog-text)] text-lg leading-tight mb-1">
                      {item.bookTitle}
                    </h4>
                    <p className="text-xs font-semibold text-[var(--catalog-text-muted)] uppercase tracking-wider">
                      ISBN: {item.bookIsbn}
                    </p>
                    <p className="text-xs text-[var(--catalog-text-muted)] mt-2">
                      Added on {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-2">
                    <Link
                      href={`/catalog?search=${item.bookIsbn}&field=Isbn`}
                      className="flex-1 sm:flex-none catalog-accent-button px-4 py-2 rounded-xl text-xs font-bold text-center"
                      onClick={onClose}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.bookTitle)}
                      disabled={isRemoving === item.id}
                      className="flex-1 sm:flex-none catalog-outline-button px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors disabled:opacity-50"
                    >
                      {isRemoving === item.id ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <><i className="fa-solid fa-trash-can mr-1"></i> Remove</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
