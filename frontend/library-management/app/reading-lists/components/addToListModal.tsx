"use client";

import React, { useEffect, useState } from "react";
import { readingListsApi } from "@/lib/reading-lists-api";
import type { ReadingListResponseDto } from "@/lib/api-types";
import { useRouter } from "next/navigation";

type AddToListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookIsbn: string;
};

export default function AddToListModal({ isOpen, onClose, bookIsbn }: AddToListModalProps) {
  const router = useRouter();
  const [lists, setLists] = useState<ReadingListResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLists();
      // Reset state when opening
      setSelectedListId(null);
      setError(null);
      setSuccessMessage(null);
      setIsCreatingList(false);
      setNewListName("");
    }
  }, [isOpen]);

  const fetchLists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await readingListsApi.getMyLists();
      setLists(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load reading lists.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    setIsCreating(true);
    setError(null);
    try {
      const newList = await readingListsApi.createList({
        name: newListName.trim(),
        description: "",
        listType: "CUSTOM",
        isPublic: false
      });
      setLists((prev) => [...prev, newList]);
      setSelectedListId(newList.id);
      setIsCreatingList(false);
      setNewListName("");
    } catch (err: any) {
      setError(err.message || "Failed to create reading list.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddToList = async () => {
    if (!selectedListId) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await readingListsApi.addBookToList(selectedListId, { bookIsbn });
      setSuccessMessage("Book successfully added to list!");
      // Auto close after brief delay to show success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add book to the list.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-nunito">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div 
        className="relative bg-[var(--catalog-panel)] w-full max-w-lg rounded-none shadow-2xl border border-[var(--catalog-border)] overflow-hidden flex flex-col max-h-[90vh]"
        data-aos="zoom-in"
        data-aos-duration="250"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[var(--catalog-border-strong)] flex justify-between items-center bg-[var(--catalog-panel-muted)]">
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--catalog-text)]">Save to List</h2>
            <p className="text-sm text-[var(--catalog-text-muted)] mt-1 font-medium">Select a reading list to add this book.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--catalog-text-muted)] hover:text-[var(--catalog-accent)] w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--catalog-panel)] transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--catalog-accent)]"></div>
            </div>
          ) : error && !lists.length ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-3 border border-red-100">
              <i className="fa-solid fa-triangle-exclamation mt-1"></i>
              <p className="font-semibold text-sm">{error}</p>
            </div>
          ) : lists.length === 0 && !isCreatingList ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-[var(--catalog-panel-muted)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--catalog-text-muted)] text-2xl border border-[var(--catalog-border)]">
                <i className="fa-solid fa-list"></i>
              </div>
              <h3 className="text-lg font-bold text-[var(--catalog-text)]">No lists found</h3>
              <p className="text-sm text-[var(--catalog-text-muted)] mt-2 mb-6">
                You don't have any reading lists yet. Please create one first.
              </p>
              <button
                onClick={() => setIsCreatingList(true)}
                className="catalog-outline-button inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-colors"
              >
                <i className="fa-solid fa-plus"></i>
                Create a List
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-[var(--catalog-text)]">Your Lists</h3>
                {!isCreatingList && (
                  <button 
                    onClick={() => setIsCreatingList(true)}
                    className="text-sm font-bold text-[var(--catalog-accent)] hover:underline flex items-center gap-1"
                  >
                    <i className="fa-solid fa-plus text-xs"></i> New List
                  </button>
                )}
              </div>

              {isCreatingList && (
                <div className="bg-[var(--catalog-panel-muted)] p-4 rounded-2xl border border-[var(--catalog-border)] flex gap-2">
                  <input 
                    type="text" 
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="List Name..."
                    className="flex-1 bg-white border border-[var(--catalog-border-strong)] rounded-xl px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-[var(--catalog-accent)] transition-colors"
                    autoFocus
                  />
                  <button
                    onClick={handleCreateList}
                    disabled={!newListName.trim() || isCreating}
                    className="catalog-accent-button px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {isCreating ? <i className="fa-solid fa-spinner fa-spin"></i> : "Create"}
                  </button>
                  <button
                    onClick={() => setIsCreatingList(false)}
                    className="catalog-outline-button px-3 py-2 rounded-xl text-sm font-bold"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}

              {lists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => setSelectedListId(list.id)}
                  className={`group relative flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                    selectedListId === list.id 
                      ? "bg-[var(--catalog-panel-muted)] border-[var(--catalog-accent)] shadow-sm" 
                      : "bg-[var(--catalog-panel)] border-[var(--catalog-border)] hover:border-[var(--catalog-accent)] hover:bg-[var(--catalog-panel-muted)]"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mr-4 flex-shrink-0 transition-colors ${
                    selectedListId === list.id 
                      ? "bg-[var(--catalog-accent)] text-white" 
                      : "bg-[var(--catalog-panel-muted)] text-[var(--catalog-text-muted)] border border-[var(--catalog-border)] group-hover:text-[var(--catalog-accent)]"
                  }`}>
                    <i className={`fa-solid ${
                      list.listType === 'FAVORITES' ? 'fa-heart' :
                      list.listType === 'TO_READ' ? 'fa-book-open' :
                      list.listType === 'RESEARCH_MATERIAL' ? 'fa-microscope' : 'fa-list'
                    }`}></i>
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className={`font-bold text-base transition-colors ${
                      selectedListId === list.id ? "text-[var(--catalog-accent)]" : "text-[var(--catalog-text)]"
                    }`}>
                      {list.name}
                    </h4>
                    <p className="text-sm text-[var(--catalog-text-muted)]">
                      {list.itemCount} {list.itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedListId === list.id 
                      ? "border-[var(--catalog-accent)] bg-[var(--catalog-accent)]" 
                      : "border-[var(--catalog-border-strong)]"
                  }`}>
                    {selectedListId === list.id && (
                      <i className="fa-solid fa-check text-white text-xs"></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[var(--catalog-border-strong)] bg-[var(--catalog-panel)]">
          {error && lists.length > 0 && (
            <p className="text-red-600 text-sm font-semibold mb-4 text-center">{error}</p>
          )}
          {successMessage && (
            <p className="text-emerald-600 text-sm font-semibold mb-4 text-center flex items-center justify-center gap-2">
              <i className="fa-solid fa-circle-check"></i>
              {successMessage}
            </p>
          )}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3.5 rounded-xl font-bold text-[var(--catalog-text)] bg-[var(--catalog-panel-muted)] border border-[var(--catalog-border)] hover:bg-[var(--catalog-panel)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddToList}
              disabled={!selectedListId || isSubmitting || lists.length === 0}
              className="catalog-accent-button flex-1 px-5 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                "Save to List"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
