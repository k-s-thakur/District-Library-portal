"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  BookOpen,
  Plus,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Download,
  Upload,
  CheckCircle2,
  X,
  Printer,
  QrCode,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useStaff } from "@/context/StaffContext";

interface CatalogueItem {
  id: string;
  title: string;
  author: string;
  accessionNo: string;
  category: string;
  shelfDdc: string;
  status: "Available" | "Issued" | "On hold" | "Under repair";
  isbn?: string;
  copiesCount?: number;
  year?: number;
}

const sampleCatalogue: CatalogueItem[] = [
  {
    id: "cat-1",
    title: "The Discovery of India",
    author: "Jawaharlal Nehru",
    accessionNo: "ACC-2024-0043",
    category: "History",
    shelfDdc: "HIS - 954 NEH",
    status: "Issued",
    isbn: "978-0195623598",
    copiesCount: 4,
    year: 1946,
  },
  {
    id: "cat-2",
    title: "Wings of Fire",
    author: "A. P. J. Abdul Kalam",
    accessionNo: "ACC-2023-0318",
    category: "Biography",
    shelfDdc: "BIO - 954 KAL",
    status: "Available",
    isbn: "978-8173711466",
    copiesCount: 6,
    year: 1999,
  },
  {
    id: "cat-3",
    title: "The God of Small Things",
    author: "Arundhati Roy",
    accessionNo: "ACC-2025-0207",
    category: "Fiction",
    shelfDdc: "FIC - ROY",
    status: "Available",
    isbn: "978-0679457312",
    copiesCount: 3,
    year: 1997,
  },
  {
    id: "cat-4",
    title: "India After Gandhi",
    author: "Ramachandra Guha",
    accessionNo: "ACC-2022-0051",
    category: "History",
    shelfDdc: "HIS - 954 GUH",
    status: "On hold",
    isbn: "978-0330505543",
    copiesCount: 5,
    year: 2007,
  },
  {
    id: "cat-5",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    accessionNo: "ACC-2024-0913",
    category: "Science",
    shelfDdc: "SCI - 523 HAW",
    status: "Issued",
    isbn: "978-0553380163",
    copiesCount: 4,
    year: 1988,
  },
  {
    id: "cat-6",
    title: "Train to Pakistan",
    author: "Khushwant Singh",
    accessionNo: "ACC-2024-0412",
    category: "Fiction",
    shelfDdc: "FIC - SIN",
    status: "Available",
    isbn: "978-0143065883",
    copiesCount: 3,
    year: 1956,
  },
  {
    id: "cat-7",
    title: "The Argumentative Indian",
    author: "Amartya Sen",
    accessionNo: "ACC-2023-0899",
    category: "Philosophy",
    shelfDdc: "PHI - 181 SEN",
    status: "Available",
    isbn: "978-0141012117",
    copiesCount: 2,
    year: 2005,
  },
];

export default function StaffCataloguePage() {
  const { previewData } = useStaff();
  const [items, setItems] = useState<CatalogueItem[]>(sampleCatalogue);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modals state
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);
  const [importExportModalOpen, setImportExportModalOpen] = useState(false);
  const [selectedSpineLabel, setSelectedSpineLabel] = useState<CatalogueItem | null>(null);
  const [selectedQrLabel, setSelectedQrLabel] = useState<CatalogueItem | null>(null);
  const [activeActionDropdown, setActiveActionDropdown] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Book Form State (Comprehensive with all old DDC & accession fields)
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newIsbn, setNewIsbn] = useState("");
  const [newCategory, setNewCategory] = useState("Fiction");
  const [newDdc, setNewDdc] = useState("823");
  const [newCutter, setNewCutter] = useState("");
  const [newShelf, setNewShelf] = useState("Aisle 3, Rack B, Shelf 2");
  const [newCopies, setNewCopies] = useState(3);
  const [newEdition, setNewEdition] = useState("1st Edition");
  const [newPubYear, setNewPubYear] = useState("2026");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFiltersOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.accessionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shelfDdc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === "All" || item.category === categoryFilter;
      const matchStat = statusFilter === "All" || item.status === statusFilter;
      return matchSearch && matchCat && matchStat;
    });
  }, [items, searchQuery, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedAcc = `ACC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const shelfCode = `${newCategory.slice(0, 3).toUpperCase()} - ${newDdc} ${newAuthor.slice(0, 3).toUpperCase()}`;

    const newItem: CatalogueItem = {
      id: `cat-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      accessionNo: generatedAcc,
      category: newCategory,
      shelfDdc: shelfCode,
      status: "Available",
      copiesCount: Number(newCopies),
      year: Number(newPubYear) || 2026,
      isbn: newIsbn || "978-81-000000-0",
    };

    setItems((prev) => [newItem, ...prev]);
    setIsSubmitting(false);
    setAddBookModalOpen(false);
    setNewTitle("");
    setNewAuthor("");
    setNewIsbn("");
    showToast(`Accessioned "${newItem.title}" with code ${newItem.accessionNo}`);
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Author", "Accession No", "Category", "Shelf / DDC", "Status"];
    const rows = filteredItems.map((b) => [
      `"${b.title}"`,
      `"${b.author}"`,
      b.accessionNo,
      b.category,
      `"${b.shelfDdc}"`,
      b.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Janata_Library_Catalogue_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Catalogue exported successfully.");
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-800 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-teal-500 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Section (Matching Photo 3 with Slate & Teal Theme) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-widest uppercase font-semibold text-teal-700">
            Collection Management
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
            Catalogue
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search titles, track individual copies and manage your collection.
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setImportExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Import / export</span>
          </button>

          <button
            onClick={() => setAddBookModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add book</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards (Matching Photo 3) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="text-3xl font-serif font-bold text-slate-900">8,426</div>
          <div className="text-xs text-slate-500 mt-1">Total titles</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="text-3xl font-serif font-bold text-slate-900">12,680</div>
          <div className="text-xs text-slate-500 mt-1">Physical copies</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="text-3xl font-serif font-bold text-teal-700">7,354</div>
          <div className="text-xs text-slate-500 mt-1">Available now</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="text-3xl font-serif font-bold text-blue-700">24</div>
          <div className="text-xs text-slate-500 mt-1">Recently added</div>
        </div>
      </div>

      {/* 3. Search and Filters Bar (Matching Photo 3) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search title, author, accession no..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-teal-600 focus:bg-white transition"
          />
        </div>

        {/* Filters Button & Popover */}
        <div className="relative w-full sm:w-auto" ref={filterRef}>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
            {(categoryFilter !== "All" || statusFilter !== "All") && (
              <span className="w-2 h-2 rounded-full bg-teal-600" />
            )}
          </button>

          {filtersOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-40 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-800">Filter Catalogue</span>
                <button
                  onClick={() => {
                    setCategoryFilter("All");
                    setStatusFilter("All");
                  }}
                  className="text-slate-400 hover:text-slate-700 text-[11px]"
                >
                  Reset
                </button>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-teal-600"
                >
                  <option value="All">All Categories</option>
                  <option value="History">History</option>
                  <option value="Biography">Biography</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Philosophy">Philosophy</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-teal-600"
                >
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Issued">Issued</option>
                  <option value="On hold">On hold</option>
                </select>
              </div>

              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full py-2 rounded-xl bg-teal-700 text-white font-medium hover:bg-teal-800"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Catalogue Table (Matching Photo 3) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Book Title</th>
                <th className="py-3 px-5">Accession No.</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Shelf / DDC</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No catalogue records found.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.author}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-600 text-[11px]">
                      {item.accessionNo}
                    </td>

                    <td className="py-3.5 px-5 text-slate-700">
                      {item.category}
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-600 text-[11px]">
                      {item.shelfDdc}
                    </td>

                    <td className="py-3.5 px-5">
                      {item.status === "Available" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-800 border border-teal-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                          <span>Available</span>
                        </span>
                      ) : item.status === "Issued" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          <span>Issued</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          <span>On hold</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right relative">
                      <button
                        onClick={() =>
                          setActiveActionDropdown(
                            activeActionDropdown === item.id ? null : item.id
                          )
                        }
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeActionDropdown === item.id && (
                        <div className="absolute right-5 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-left text-xs">
                          <button
                            onClick={() => {
                              setSelectedSpineLabel(item);
                              setActiveActionDropdown(null);
                            }}
                            className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Tag className="w-3.5 h-3.5 text-teal-600" />
                            <span>Print Spine Label</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQrLabel(item);
                              setActiveActionDropdown(null);
                            }}
                            className="w-full px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <QrCode className="w-3.5 h-3.5 text-blue-600" />
                            <span>View QR / Barcode Token</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="py-3 px-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <span className="text-[11px] text-slate-400">
            Showing {paginatedItems.length} of 8,426 titles in this preview
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-slate-700 transition"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-slate-700 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE ADD BOOK & ACCESSION MODAL (Retaining all previous PRD & inventory features) */}
      {addBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    Add Book Title & Accession Stacks
                  </h3>
                  <p className="text-xs text-slate-500">Full metadata, DDC classification & copy inventory</p>
                </div>
              </div>
              <button
                onClick={() => setAddBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. India's Struggle for Independence"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Author / Editor *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bipan Chandra"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ISBN 13 Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 978-0143423232"
                    value={newIsbn}
                    onChange={(e) => setNewIsbn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600 bg-white"
                  >
                    <option>History</option>
                    <option>Biography</option>
                    <option>Fiction</option>
                    <option>Science</option>
                    <option>Philosophy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">DDC Code (Dewey Decimal)</label>
                  <input
                    type="text"
                    value={newDdc}
                    onChange={(e) => setNewDdc(e.target.value)}
                    placeholder="e.g. 954.03"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={newShelf}
                    onChange={(e) => setNewShelf(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Edition</label>
                  <input
                    type="text"
                    value={newEdition}
                    onChange={(e) => setNewEdition(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Copies Count</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newCopies}
                    onChange={(e) => setNewCopies(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddBookModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-xs"
                >
                  {isSubmitting ? "Adding..." : "Add to Catalogue & Generate Copies"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT / EXPORT MODAL */}
      {importExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-serif font-bold text-slate-900 text-sm">
                Import / Export Catalogue
              </span>
              <button
                onClick={() => setImportExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleExportCSV();
                  setImportExportModalOpen(false);
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-teal-600 hover:bg-teal-50/50 text-left transition flex items-center gap-3"
              >
                <Download className="w-5 h-5 text-teal-700" />
                <div>
                  <p className="font-semibold text-slate-900">Export Complete Catalogue (CSV)</p>
                  <p className="text-[11px] text-slate-500">Download formatted CSV with all accessions and DDC shelf codes.</p>
                </div>
              </button>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-left space-y-2">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-semibold text-slate-900">Bulk Import Accessions</p>
                    <p className="text-[11px] text-slate-500">Supports CSV, Excel or MARC21 standard exports.</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={() => {
                    showToast("Uploaded file queued for batch validation.");
                    setImportExportModalOpen(false);
                  }}
                  className="mt-2 block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-teal-700 file:text-white hover:file:bg-teal-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setImportExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT SPINE LABEL MODAL */}
      {selectedSpineLabel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xs w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Library Spine Label
              </span>
              <button onClick={() => setSelectedSpineLabel(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl bg-slate-50 text-center font-mono space-y-2">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Janata Library</p>
              <div className="text-sm font-bold text-slate-900">{selectedSpineLabel.shelfDdc}</div>
              <div className="text-xs text-teal-800 font-bold">{selectedSpineLabel.accessionNo}</div>
              <p className="text-[10px] text-slate-500 italic truncate">{selectedSpineLabel.title}</p>
            </div>

            <button
              onClick={() => {
                window.print();
                setSelectedSpineLabel(null);
              }}
              className="w-full py-2.5 bg-teal-700 text-white rounded-xl text-xs font-medium hover:bg-teal-800 flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Spine Label</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW QR / BARCODE TOKEN MODAL */}
      {selectedQrLabel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xs w-full p-5 space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Accession Token Label
              </span>
              <button onClick={() => setSelectedQrLabel(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="w-24 h-24 mx-auto bg-white p-2 border border-slate-200 rounded-lg flex items-center justify-center shadow-xs">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
              <div className="font-mono text-xs font-bold text-slate-900">
                {selectedQrLabel.accessionNo}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                {selectedQrLabel.title}
              </p>
            </div>

            <button
              onClick={() => {
                window.print();
                setSelectedQrLabel(null);
              }}
              className="w-full py-2.5 bg-teal-700 text-white rounded-xl text-xs font-medium hover:bg-teal-800 flex items-center justify-center gap-2"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print QR Label</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
