import React from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import DynamicBookCover from "./DynamicBookCover";

export interface BookCardProps {
  id: string;
  title: string;
  subtitle?: string | null;
  authors: string;
  coverImageUrl?: string | null;
  isbn?: string;
  publisher?: string;
  edition?: string;
  publicationYear?: number | string | null;
  language?: string | null;
  ddcCode?: string | null;
  category: {
    id?: string;
    name: string;
    code: string;
    ddcPrefix?: string;
  };
  availabilityStatus: string;
  availableCopies: number;
  totalCopies: number;
  primaryLocation: string;
}

export default function BookCard({
  id,
  title,
  subtitle,
  authors,
  isbn,
  publisher,
  edition,
  publicationYear,
  language,
  ddcCode,
  category,
  availableCopies,
  primaryLocation,
}: BookCardProps) {
  const isAvailable = availableCopies > 0;

  return (
    <Link
      href={`/books/${id}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-teal-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Dynamic Typography-First Editorial Book Cover (No External Images) */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <DynamicBookCover
          id={id}
          isbn={isbn}
          title={title}
          subtitle={subtitle}
          authors={authors}
          category={category}
          publisher={publisher}
          edition={edition}
          publicationYear={publicationYear}
          language={language}
          ddcCode={ddcCode}
          size="responsive"
          className="group-hover:scale-[1.03] transition-transform duration-300"
        />
      </div>

      {/* Book Metadata & Shelf Coordinates */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 bg-white">
        <div>
          <span className="text-[10px] font-bold text-teal-700 tracking-wider uppercase block truncate mb-0.5">
            {category?.name || "Library Holding"}
          </span>
          <h3 className="font-serif text-sm font-bold text-slate-900 group-hover:text-teal-700 transition leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">By {authors}</p>
        </div>

        {/* Shelf Coordinates & Real-Time Availability */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-slate-500 truncate mr-1" title={primaryLocation}>
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{primaryLocation}</span>
          </div>

          <div className="shrink-0">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Available</span>
              </span>
            ) : (
              <span className="text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                Checked Out
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
