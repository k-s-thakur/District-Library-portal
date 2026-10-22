"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, Clock, AlertCircle } from "lucide-react";

export interface BookCardProps {
  id: string;
  isbn: string;
  title: string;
  subtitle?: string | null;
  authors: string;
  coverImageUrl?: string | null;
  category?: { name: string; code: string } | null;
  availabilityStatus: "Available" | "All copies issued" | "Reference only" | "Availability unknown";
  availableCopies: number;
  totalCopies: number;
  primaryLocation?: string;
  publicationYear?: number | null;
}

export default function BookCard({
  id,
  title,
  subtitle,
  authors,
  coverImageUrl,
  category,
  availabilityStatus,
  availableCopies,
  totalCopies,
  primaryLocation,
}: BookCardProps) {
  const getStatusBadge = () => {
    switch (availabilityStatus) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span>Available ({availableCopies}/{totalCopies})</span>
          </span>
        );
      case "All copies issued":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>All Issued ({totalCopies})</span>
          </span>
        );
      case "Reference only":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
            <BookOpen className="w-3 h-3" />
            <span>Reference Hall</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
            <AlertCircle className="w-3 h-3" />
            <span>Status Unknown</span>
          </span>
        );
    }
  };

  return (
    <Link
      href={`/books/${id}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200/80 overflow-hidden book-shadow book-shadow-hover focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
    >
      {/* 2:3 Aspect Ratio Book Cover Container */}
      <div className="relative aspect-[2/3] w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-teal-800 to-slate-900 text-white">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
                {category?.name || "Library Holding"}
              </span>
              <BookOpen className="w-4 h-4 opacity-75" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold leading-snug line-clamp-3">
                {title}
              </h4>
              <p className="text-xs text-teal-200 mt-1 line-clamp-1">{authors}</p>
            </div>
            <div className="text-[9px] font-mono text-slate-400">Government Public Library</div>
          </div>
        )}

        {/* Subtle Spine Highlight */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Book Metadata */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {category && (
            <span className="text-[10px] font-semibold text-teal-700 tracking-wide uppercase">
              {category.name}
            </span>
          )}
          <h3 className="font-serif text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-1">By {authors}</p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          {getStatusBadge()}
          {primaryLocation && (
            <span className="text-[10px] text-slate-500 truncate max-w-[90px]" title={primaryLocation}>
              {primaryLocation.split(",")[0]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
