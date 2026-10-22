import Link from "next/link";
import { ArrowLeft, BookOpen, Compass } from "lucide-react";
import CategoryTile from "@/components/CategoryTile";
import { getCategoriesWithCounts } from "@/lib/services/catalogue.service";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 text-teal-800 rounded-xl">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-extrabold text-slate-900 tracking-tight">
              Catalogue Categories & DDC Taxonomy
            </h1>
            <p className="text-sm text-slate-600">
              Browse all physical collections structured under the Dewey Decimal Classification
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryTile key={cat.id} {...cat} />
        ))}
      </div>
    </div>
  );
}
