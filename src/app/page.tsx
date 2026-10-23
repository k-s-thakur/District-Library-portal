import Link from "next/link";
import {
  Search,
  ArrowRight,
  CheckCircle,
  Building2,
} from "lucide-react";
import CuratedBookRow from "@/components/CuratedBookRow";
import CategoryTile from "@/components/CategoryTile";
import { getCuratedCatalog, getCategoriesWithCounts } from "@/lib/services/catalogue.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [curated, categories] = await Promise.all([
    getCuratedCatalog(),
    getCategoriesWithCounts(),
  ]);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Search & Masthead */}
      <section className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-teal-300">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>District Public Library · Online Public Access Catalogue</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Discover Books in Physical Stacks
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-normal">
            Search published holdings across Dewey Decimal Classification, verify real-time copy availability, and locate shelf racks before your visit.
          </p>

          {/* Search Box */}
          <form
            action="/search"
            method="GET"
            className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto bg-white p-1.5 rounded-xl border border-slate-200 text-slate-900 shadow-sm"
          >
            <div className="flex items-center gap-2.5 flex-1 w-full px-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search by title, author name, ISBN, or subject..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 py-2 outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded-lg text-sm transition shrink-0 cursor-pointer"
            >
              Search Catalogue
            </button>
          </form>

          {/* Quick Keyword Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-300 pt-1">
            <span className="text-slate-400 text-[11px]">Popular searches:</span>
            {[
              { label: "Wings of Fire", q: "Wings of Fire" },
              { label: "Munshi Premchand", q: "Premchand" },
              { label: "Constitution of India", q: "Constitution" },
              { label: "Operating Systems", q: "Operating Systems" },
              { label: "Rabindranath Tagore", q: "Tagore" },
            ].map((tag) => (
              <Link
                key={tag.q}
                href={`/search?q=${encodeURIComponent(tag.q)}`}
                className="px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 text-[11px] transition"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Curated Row 1: Editor's Choice */}
        <CuratedBookRow
          title="Essential Classics & Reference Holdings"
          subtitle="Foundational titles curated by the Library Board"
          viewAllLink="/search?category=LITERATURE"
          books={curated.editorsChoice}
        />

        {/* 3. Browse Categories / Genres Grid */}
        <section className="space-y-4">
          <div className="flex items-end justify-between border-b border-slate-200 pb-2.5">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Browse by Category & Classification
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore holdings catalogued under the Dewey Decimal Classification (DDC)
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 transition"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {categories.map((cat) => (
              <CategoryTile key={cat.id} {...cat} />
            ))}
          </div>
        </section>

        {/* Curated Row 2: Popular in Circulation */}
        <CuratedBookRow
          title="Frequently Borrowed Titles"
          subtitle="Current active loans, reference texts, and student circulation"
          viewAllLink="/search?sort=relevance"
          books={curated.popular}
        />

        {/* Curated Row 3: Recently Added Stacks */}
        <CuratedBookRow
          title="Recent Additions to the Stacks"
          subtitle="New accessions and editions verified in the physical inventory"
          viewAllLink="/search?sort=newest"
          books={curated.recentlyAdded}
        />

        {/* 4. Library Timings, Rules & Reading Hall Banner */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2.5">
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                Visit the Physical Library
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Public Reading Hall & Digital Reference Terminals
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Open to all citizens Monday through Saturday, 08:00 AM – 08:00 PM. Access high-speed National Knowledge Network terminals, reference encyclopedias, and quiet study alcoves.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1.5 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Free Public Entry</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Borrow up to 8 books</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>Online Reservations</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-2.5 text-center md:text-left">
              <h4 className="text-sm font-bold text-slate-900">
                Membership Cards
              </h4>
              <p className="text-xs text-slate-500">
                Register online or visit our circulation desk with government ID for instant issuance.
              </p>
              <div className="pt-1">
                <Link
                  href="/library-information#membership"
                  className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium transition"
                >
                  Membership Rules & Quotas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
