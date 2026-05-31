"use client";

import React, { useEffect, useState } from "react";
import { readingListsApi } from "@/lib/reading-lists-api";
import type { ReadingListResponseDto } from "@/lib/api-types";
import Header from "@/components/header";
import ReadingListDetailModal from "@/app/reading-lists/components/readingListDetailModal";

export default function ReadingListsPage() {
  const [lists, setLists] = useState<ReadingListResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newListType, setNewListType] = useState<"TO_READ" | "FAVORITES" | "RESEARCH_MATERIAL" | "CUSTOM">("CUSTOM");
  const [isCreating, setIsCreating] = useState(false);

  // View Details Modal State
  const [viewingListId, setViewingListId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      await readingListsApi.createList({
        name: newName,
        description: newDescription,
        listType: newListType,
      });
      setNewName("");
      setNewDescription("");
      setNewListType("CUSTOM");
      setIsCreateOpen(false);
      await fetchLists();
    } catch (err: any) {
      alert(err.message || "Failed to create list");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteList = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await readingListsApi.deleteList(id);
      setLists(lists.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete list");
    }
  };

  const getListIcon = (type: string) => {
    switch (type) {
      case "TO_READ":
        return "fa-book-open";
      case "FAVORITES":
        return "fa-heart text-red-500";
      case "RESEARCH_MATERIAL":
        return "fa-microscope";
      case "CUSTOM":
      default:
        return "fa-list";
    }
  };

  return (
    <div className="relative min-h-screen bg-white font-body text-[var(--catalog-text)] z-0">
      <div className="absolute top-0 left-0 right-0 h-[40vh] md:h-[45vh] bg-[#f4f0e8] rounded-br-[4rem] md:rounded-br-[8rem] -z-10 pointer-events-none" />
      
      <Header />

      <main className="app-shell-main app-shell-content page-shell mx-auto w-full max-w-7xl flex-grow px-5 pt-28 pb-24 md:px-8 md:pt-32 lg:px-10">
        <div className="space-y-8">
          
          {/* Header Section */}
          <div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--catalog-panel)] p-8 rounded-3xl border border-[var(--catalog-border)] shadow-sm"
            data-aos="fade-down"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--catalog-text)] mb-2">
                My Reading Lists
              </h1>
              <p className="text-[var(--catalog-text-muted)] text-lg font-medium">
                Curate, organize, and track your literary journey.
              </p>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="catalog-accent-button inline-flex items-center justify-center px-8 py-3.5 text-base font-bold rounded-full overflow-hidden"
            >
              <i className="fa-solid fa-plus mr-2 group-hover:rotate-90 transition-transform duration-300"></i>
              Create New List
            </button>
          </div>

          {/* Content Section */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20" data-aos="fade-in">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--catalog-accent)]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl flex items-center gap-4" data-aos="fade-in">
              <i className="fa-solid fa-circle-exclamation text-2xl"></i>
              <p className="font-semibold">{error}</p>
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center py-20 bg-[var(--catalog-panel)] rounded-3xl border border-[var(--catalog-border)] shadow-sm" data-aos="fade-up">
              <div className="w-24 h-24 bg-[var(--catalog-panel-muted)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--catalog-text-muted)]">
                <i className="fa-solid fa-books text-4xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-[var(--catalog-text)] mb-2">No lists found</h3>
              <p className="text-[var(--catalog-text-muted)] max-w-md mx-auto">
                You haven't created any reading lists yet. Start organizing your books by creating your first list!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lists.map((list, index) => (
                <div 
                  key={list.id} 
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group relative bg-[var(--catalog-panel)] rounded-3xl p-6 md:p-8 border border-[var(--catalog-border)] shadow-sm hover:border-[var(--catalog-accent)] hover:bg-[var(--catalog-panel-muted)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-[var(--catalog-panel)] text-[var(--catalog-text-muted)] border border-[var(--catalog-border)] group-hover:text-[var(--catalog-accent)] transition-colors`}>
                      <i className={`fa-solid ${getListIcon(list.listType)}`}></i>
                    </div>
                    <button 
                      onClick={() => handleDeleteList(list.id, list.name)}
                      className="text-[var(--catalog-text-muted)] hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                      title="Delete list"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[var(--catalog-text)] mb-2 group-hover:text-[var(--catalog-accent)] transition-colors line-clamp-1">
                    {list.name}
                  </h3>
                  
                  <p className="text-[var(--catalog-text-muted)] mb-6 flex-grow line-clamp-2 min-h-[3rem]">
                    {list.description || "No description provided."}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--catalog-border-strong)]">
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--catalog-text-muted)] bg-[var(--catalog-panel)] px-3 py-1.5 rounded-full border border-[var(--catalog-border)]">
                      <i className="fa-solid fa-book"></i>
                      <span>{list.itemCount} items</span>
                    </div>
                    
                    {/* Link to view list details */}
                    <button 
                      onClick={() => setViewingListId(list.id)}
                      className="text-[var(--catalog-accent)] text-sm font-bold flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer focus:opacity-100"
                    >
                      View <i className="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create List Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCreateOpen(false)}
          ></div>
          
          <div 
            className="relative bg-[var(--catalog-panel)] w-full max-w-md rounded-3xl shadow-2xl border border-[var(--catalog-border)] overflow-hidden"
            data-aos="zoom-in"
            data-aos-duration="200"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--catalog-text)]">Create New List</h2>
                <button 
                  onClick={() => setIsCreateOpen(false)}
                  className="text-[var(--catalog-text-muted)] hover:text-[var(--catalog-accent)] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--catalog-panel-muted)] transition-colors"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
              
              <form onSubmit={handleCreateList} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[var(--catalog-text)] mb-1.5">Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--catalog-panel-muted)] border border-[var(--catalog-border-strong)] focus:ring-2 focus:ring-[var(--catalog-accent)] focus:border-[var(--catalog-accent)] outline-none transition-all text-[var(--catalog-text)]"
                    placeholder="e.g. Summer Reading 2026"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[var(--catalog-text)] mb-1.5">Description (Optional)</label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--catalog-panel-muted)] border border-[var(--catalog-border-strong)] focus:ring-2 focus:ring-[var(--catalog-accent)] focus:border-[var(--catalog-accent)] outline-none transition-all resize-none h-24 text-[var(--catalog-text)]"
                    placeholder="What's this list about?"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--catalog-text)] mb-1.5">List Type</label>
                  <div className="relative">
                    <select
                      value={newListType}
                      onChange={(e) => setNewListType(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--catalog-panel-muted)] border border-[var(--catalog-border-strong)] focus:ring-2 focus:ring-[var(--catalog-accent)] focus:border-[var(--catalog-accent)] outline-none transition-all appearance-none cursor-pointer text-[var(--catalog-text)]"
                    >
                      <option value="CUSTOM">Custom</option>
                      <option value="TO_READ">To Read</option>
                      <option value="FAVORITES">Favorites</option>
                      <option value="RESEARCH_MATERIAL">Research Material</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-[var(--catalog-text-muted)]">
                      <i className="fa-solid fa-chevron-down text-sm"></i>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="catalog-outline-button flex-1 px-4 py-3 rounded-xl font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !newName.trim()}
                    className="catalog-accent-button flex-1 px-4 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      "Create List"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View List Details Modal */}
      <ReadingListDetailModal 
        listId={viewingListId} 
        onClose={() => {
          setViewingListId(null);
          fetchLists(); // refresh in case items were removed
        }} 
      />
    </div>
  );
}
