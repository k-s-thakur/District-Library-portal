"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import BookCard, { BookCardProps } from "./BookCard";

interface CuratedBookRowProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  books: BookCardProps[];
}

export default function CuratedBookRow({
  title,
  subtitle,
  viewAllLink,
  books,
}: CuratedBookRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <section className="py-6 space-y-4">
      <div className="flex items-end justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-slate-600 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 mr-2 transition-colors"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-xs cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition shadow-xs cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Book Cards Row */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none scroll-smooth snap-x"
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="w-[180px] sm:w-[210px] shrink-0 snap-start"
          >
            <BookCard {...book} />
          </div>
        ))}
      </div>
    </section>
  );
}
