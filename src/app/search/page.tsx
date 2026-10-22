"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  X,
  BookOpen,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import BookCard, { BookCardProps } from "@/components/BookCard";

interface CategoryOption {
  id: string;
  name: string;
  code: string;
  ddcPrefix?: string | null;
  booksCount: number;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-driven query state
  const qParam = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "relevance";
  const availableParam = searchParams.get("available") === "true";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // Local state
  const [searchInput, setSearchInput] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [availableOnly, setAvailableOnly] = useState(availableParam);
  const [page, setPage] = useState(pageParam);

  const [books, setBooks] = useState<BookCardProps[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync state when URL searchParams change
  useEffect(() => {
    setSearchInput(qParam);
    setSelectedCategory(categoryParam);
    setSelectedSort(sortParam);
    setAvailableOnly(availableParam);
    setPage(pageParam);
  }, [qParam, categoryParam, sortParam, availableParam, pageParam]);

  // Fetch categories on mount
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
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchInput.trim()) params.set("q", searchInput.trim());
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedSort) params.set("sort", selectedSort);
        if (availableOnly) params.set("available", "true");
        params.set("page", page.toString());
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

    fetchResults();
  }, [searchInput, selectedCategory, selectedSort, availableOnly, page]);

  // Update URL helper
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(newParams)) {
      if (val === null || val === "" || val === "false") {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    }
    router.push(`/search?${next.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ q: searchInput.trim(), page: "1" });
  };

  const handleCategoryChange = (code: string) => {
    const nextCode = selectedCategory === code ? null : code;
    setSelectedCategory(nextCode || "");
    updateUrlParams({ category: nextCode, page: "1" });
  };

  const handleSortChange = (sortVal: string) => {
    setSelectedSort(sortVal);
    updateUrlParams({ sort: sortVal, page: "1" });
  };

  const handleAvailabilityToggle = (checked: boolean) => {
    setAvailableOnly(checked);
    updateUrlParams({ available: checked ? "true" : null, page: "1" });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setSelectedCategory("");
    setSelectedSort("relevance");
    setAvailableOnly(false);
    setPage(1);
    router.push("/search");
  };

  const hasActiveFilters = Boolean(searchInput || selectedCategory || availableOnly || selectedSort !== "relevance");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Search Header Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by book title, author name, ISBN or subject..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-sm transition shadow-xs cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Query Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span>
              Showing <strong className="text-slate-900 font-bold">{totalCount}</strong> results
              {qParam && (
                <span>
                  {" "}
                  for <strong className="text-teal-800 font-bold">&quot;{qParam}&quot;</strong>
                </span>
              )}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="ml-3 inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear filters</span>
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              <option value="relevance">Relevance</option>
              <option value="title_asc">Title (A – Z)</option>
              <option value="title_desc">Title (Z – A)</option>
              <option value="newest">Newest Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Layout Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <aside className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-700" />
              <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wide">
                Filter Catalogue
              </h3>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-teal-700 hover:underline font-medium cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Availability Toggle */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Physical Availability
            </h4>
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => handleAvailabilityToggle(e.target.checked)}
                className="rounded accent-teal-700 w-4 h-4 cursor-pointer"
              />
              <span className="font-medium">Show available copies only</span>
            </label>
          </div>

          {/* Category Facets */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Subject & Category
            </h4>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              <button
                onClick={() => handleCategoryChange("")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                  !selectedCategory
                    ? "bg-teal-50 text-teal-900 font-bold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>All Categories</span>
              </button>
              {categories.map((cat) => {
                const active = selectedCategory === cat.code;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.code)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between ${
                      active
                        ? "bg-teal-50 text-teal-900 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono">
                      {cat.booksCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Search Results Grid */}
        <main className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-xl border border-slate-200 h-72 p-3 space-y-3">
                  <div className="bg-slate-200 aspect-[2/3] rounded-lg" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-serif text-xl font-bold text-slate-800">
                No matching titles found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                We couldn&apos;t find any books matching your search. Try adjusting your keywords, clearing filters, or exploring our Dewey Decimal categories.
              </p>
              <div className="pt-2">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Clear all search filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {books.map((book) => (
                  <BookCard key={book.id} {...book} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6 border-t border-slate-200">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateUrlParams({ page: (page - 1).toString() })}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-700">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => updateUrlParams({ page: (page + 1).toString() })}
                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
          Loading catalogue search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
