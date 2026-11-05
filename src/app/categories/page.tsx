import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { CATEGORIES } from "@/data/mockData";

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Catalogue Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Browse books by subject classification and Dewey Decimal code
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/search?category=${cat.code}`}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>DDC {cat.ddcPrefix}</span>
                <span className="text-teal-700 font-semibold font-sans">
                  {cat.booksCount || 1} {cat.booksCount === 1 ? "book" : "books"}
                </span>
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-teal-700 transition">
                {cat.name}
              </h3>
              {cat.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              )}
            </div>

            <div className="pt-4 text-xs font-semibold text-teal-700 group-hover:underline">
              Browse category →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
