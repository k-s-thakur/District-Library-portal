import React from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import BookCarousel from "@/components/BookCarousel";
import { BOOKS, CATEGORIES } from "@/data/mockData";

export default function HomePage() {
  const featuredBooks = BOOKS.filter((b) => b.isEditorChoice || b.isFeatured);
  const popularBooks = BOOKS.filter((b) => b.isPopular);

  return (
    <div className="space-y-12 pb-16">
      {/* Clean Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-teal-50/30 to-white border-b border-slate-100 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-xs font-semibold text-teal-800">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>District Public Library · Online Catalogue</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Discover Books, Check Availability &amp; Find Shelf Locations
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Search our physical catalogue across science, literature, history, law, and computing with real-time stack coordinates.
          </p>

          {/* Clean Search Input */}
          <form
            action="/search"
            method="GET"
            className="max-w-2xl mx-auto bg-white p-1.5 rounded-2xl border border-slate-300 shadow-md focus-within:ring-2 focus-within:ring-teal-600/30 focus-within:border-teal-600 transition flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                placeholder="Search by title, author, topic, ISBN or Dewey code..."
                className="w-full pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Category Chips */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Popular:</span>
            {[
              { label: "Literature", code: "LITERATURE" },
              { label: "Science", code: "SCIENCE" },
              { label: "Technology", code: "CS_TECH" },
              { label: "History", code: "HISTORY" },
              { label: "Constitution & Law", code: "LAW_GOV" },
              { label: "Philosophy", code: "PHILOSOPHY" },
            ].map((cat) => (
              <Link
                key={cat.code}
                href={`/search?category=${cat.code}`}
                className="px-3 py-1 rounded-full bg-white text-slate-600 hover:text-teal-700 border border-slate-200 hover:border-teal-300 transition shadow-2xs"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Curated Featured Books */}
        <BookCarousel
          title="Featured Titles"
          subtitle="Selected essential classics and recommended reference books"
          viewAllLink="/search"
          books={featuredBooks}
        />

        {/* Popular in Circulation */}
        <BookCarousel
          title="Popular in Circulation"
          subtitle="Frequently borrowed books and biographies"
          viewAllLink="/search?sort=relevance"
          books={popularBooks}
        />

        {/* Browse by Categories */}
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight text-slate-900">
                Browse by Category
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore holdings organised by Dewey Decimal Classification
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition"
            >
              <span>All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.code}`}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-xs transition flex flex-col justify-between"
              >
                <div className="text-[11px] font-mono font-medium text-slate-400">
                  DDC {cat.ddcPrefix}
                </div>
                <div className="mt-2">
                  <h3 className="font-serif text-sm font-bold text-slate-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {cat.booksCount || 1} {cat.booksCount === 1 ? "holding" : "holdings"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Clean Library Visiting Card */}
        <section className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Visit the Physical Library
              </span>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Reading Hall &amp; Circulation Desk
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Open to all citizens Monday to Saturday (08:00 AM – 08:00 PM). Free public entry, quiet study alcoves, and book circulation.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Free Citizen Access</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Mon – Sat: 08:00 AM – 08:00 PM</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>CGO Complex, New Delhi</span>
                </span>
              </div>
            </div>

            <Link
              href="/library-information"
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition shrink-0"
            >
              Library Info &amp; Rules
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
