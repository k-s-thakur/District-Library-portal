import Link from "next/link";
import {
  Search,
  BookOpen,
  Sparkles,
  Award,
  Layers,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Building2,
  Users,
} from "lucide-react";
import CuratedBookRow from "@/components/CuratedBookRow";
import CategoryTile from "@/components/CategoryTile";
import { getCuratedCatalog, getCategoriesWithCounts } from "@/lib/services/catalogue.service";

// Ensure dynamic rendering for real-time availability counters
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [curated, categories] = await Promise.all([
    getCuratedCatalog(),
    getCategoriesWithCounts(),
  ]);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. ManyBooks-Inspired Hero Discovery Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-slate-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle Decorative Geometry */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-600/40 text-xs text-teal-200">
            <Building2 className="w-3.5 h-3.5 text-teal-400" />
            <span>Government Public Library · Online Public Access Catalogue</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover Your Next Book in Our Physical Stacks
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Search published holdings across the Dewey Decimal Classification, verify real-time copy availability, and locate shelf positions before your visit.
          </p>

          {/* Prominent Center Search Form */}
          <form
            action="/search"
            method="GET"
            className="flex flex-col sm:flex-row items-center gap-2.5 max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl border border-slate-200/40 text-slate-900"
          >
            <div className="flex items-center gap-3 flex-1 w-full px-3">
              <Search className="w-5 h-5 text-teal-700 shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search by title, author name, ISBN, or subject..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 py-2 outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shrink-0 cursor-pointer"
            >
              Search Catalogue
            </button>
          </form>

          {/* Quick Keyword Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-slate-300 pt-2">
            <span className="text-slate-400">Popular searches:</span>
            {[
              { label: "Wings of Fire", q: "Wings of Fire" },
              { label: "Munshi Premchand", q: "Premchand" },
              { label: "Constitution", q: "Constitution" },
              { label: "Operating Systems", q: "Operating Systems" },
              { label: "Tagore Poetry", q: "Tagore" },
            ].map((tag) => (
              <Link
                key={tag.q}
                href={`/search?q=${encodeURIComponent(tag.q)}`}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-teal-800 hover:text-white border border-slate-700 transition"
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
          title="Editor's Choice & Essential Classics"
          subtitle="Handpicked foundational titles recommended by the Library Board"
          viewAllLink="/search?category=LITERATURE"
          books={curated.editorsChoice}
        />

        {/* 3. ManyBooks-style "Browse Categories / Genres" Grid */}
        <section className="py-6 space-y-5">
          <div className="flex items-end justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                Browse by Category & Classification
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Explore holdings catalogued under the Dewey Decimal Classification
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <CategoryTile key={cat.id} {...cat} />
            ))}
          </div>
        </section>

        {/* Curated Row 2: Popular & Frequently Circulated */}
        <CuratedBookRow
          title="Popular in Circulation"
          subtitle="Frequently borrowed reference texts, biographies, and academic works"
          viewAllLink="/search?sort=relevance"
          books={curated.popular}
        />

        {/* Curated Row 3: Recently Added Stacks */}
        <CuratedBookRow
          title="Recently Added to the Stacks"
          subtitle="New editions and accessions verified in the library inventory"
          viewAllLink="/search?sort=newest"
          books={curated.recentlyAdded}
        />

        {/* 4. Library Timings, Rules & Reading Hall Banner */}
        <section className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200/80 p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                Visit the Physical Library
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Peaceful Public Reading Hall & Digital Reference Nodes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Open to all citizens Monday through Saturday, 08:00 AM – 08:00 PM. Access high-speed National Knowledge Network terminals, reference encyclopedias, and quiet study alcoves.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Free Public Entry</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Borrow up to 8 books</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Online Reservations</span>
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm space-y-3 text-center md:text-left">
              <h4 className="font-serif text-base font-bold text-slate-900">
                Need a Membership Card?
              </h4>
              <p className="text-xs text-slate-500">
                Register online or visit our circulation desk with government ID for instant issuance.
              </p>
              <div className="pt-1">
                <Link
                  href="/library-information#membership"
                  className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition"
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
