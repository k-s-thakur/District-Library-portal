"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import BookCard from "@/components/BookCard";
import { Book, Category } from "@/types";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "relevance";
  const availableParam = searchParams.get("available") === "true";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [inputVal, setInputVal] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [onlyAvailable, setOnlyAvailable] = useState(availableParam);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    setInputVal(queryParam);
    setSelectedCategory(categoryParam);
    setSelectedSort(sortParam);
    setOnlyAvailable(availableParam);
    setCurrentPage(pageParam);
  }, [queryParam, categoryParam, sortParam, availableParam, pageParam]);

  // Fetch categories list
  useEffect(() => {
    fetch("/api/public/catalog/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (inputVal.trim()) params.set("q", inputVal.trim());
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedSort) params.set("sort", selectedSort);
        if (onlyAvailable) params.set("available", "true");
        params.set("page", currentPage.toString());
        params.set("limit", "12");

        const res = await fetch(`/api/public/catalog/search?${params.toString()}`);
        const data = await res.json();
        setBooks(data.items || []);
        setTotalCount(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [inputVal, selectedCategory, selectedSort, onlyAvailable, currentPage]);

  const updateFilters = (newFilters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(newFilters)) {
      if (value === null || value === "" || value === "false") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`/search?${params.toString()}`);
  };

  const handleCategorySelect = (code: string) => {
    const nextCode = selectedCategory === code ? null : code;
    setSelectedCategory(nextCode || "");
    updateFilters({ category: nextCode, page: "1" });
  };

  const handleResetFilters = () => {
    setInputVal("");
    setSelectedCategory("");
    setSelectedSort("relevance");
    setOnlyAvailable(false);
    setCurrentPage(1);
    router.push("/search");
  };

  const hasActiveFilters = Boolean(
    inputVal || selectedCategory || onlyAvailable || selectedSort !== "relevance"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Clean Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateFilters({ q: inputVal.trim(), page: "1" });
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search by title, author, keyword, ISBN..."
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 bg-slate-50/50"
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => {
                  setInputVal("");
                  updateFilters({ q: null, page: "1" });
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleCategorySelect("")}
              className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                !selectedCategory
                  ? "bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.code;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.code)}
                  className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                    isSelected
                      ? "bg-teal-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Right Filters */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => {
                  setOnlyAvailable(e.target.checked);
                  updateFilters({
                    available: e.target.checked ? "true" : null,
                    page: "1",
                  });
                }}
                className="w-3.5 h-3.5 rounded text-teal-600"
              />
              <span>Available now</span>
            </label>

            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                updateFilters({ sort: e.target.value, page: "1" });
              }}
              className="py-1 px-2 text-xs rounded border border-slate-200 bg-white text-slate-700 focus:outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="title">Title (A–Z)</option>
              <option value="year">Year</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500">
        Found <strong className="text-slate-800">{totalCount}</strong> books
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading catalogue...</div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-600">No books found matching your query.</p>
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-1.5 bg-teal-700 text-white rounded-lg text-xs"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-4 flex items-center justify-center gap-2 text-xs">
          <button
            onClick={() => updateFilters({ page: (currentPage - 1).toString() })}
            disabled={currentPage <= 1}
            className="p-1.5 rounded border border-slate-200 bg-white disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-600">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => updateFilters({ page: (currentPage + 1).toString() })}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded border border-slate-200 bg-white disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-500">Loading catalogue...</div>}>
      <SearchContent />
    </Suspense>
  );
}
