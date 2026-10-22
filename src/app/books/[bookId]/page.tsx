import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Bookmark,
  Building2,
  Calendar,
  Layers,
  ArrowLeft,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { getBookDetails } from "@/lib/services/catalogue.service";
import ReservationButton from "./ReservationButton";

export const dynamic = "force-dynamic";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  let book: any;

  try {
    book = await getBookDetails(bookId);
  } catch (err) {
    notFound();
  }

  const getStatusBadge = () => {
    switch (book.availabilityStatus) {
      case "Available":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Available on Shelf ({book.availableCopies} of {book.totalCopies} copies)</span>
          </span>
        );
      case "All copies issued":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            <span>All Copies Currently Issued ({book.totalCopies} copies in circulation)</span>
          </span>
        );
      case "Reference only":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 border border-slate-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reference Hall Only (Not for Home Loan)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Availability Unknown</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Catalogue Link */}
      <div>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalogue Search</span>
        </Link>
      </div>

      {/* Main Detail Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8 items-start">
          {/* Col 1: Book Cover Presentation (4 Cols) */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4">
            <div className="relative aspect-[2/3] w-full max-w-[320px] mx-auto rounded-xl overflow-hidden book-shadow border border-slate-200/80 bg-slate-100">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-teal-900 to-slate-900 text-white">
                  <span className="text-xs uppercase font-bold text-teal-300">
                    {book.category?.name || "Library Holding"}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold leading-tight">{book.title}</h3>
                    <p className="text-sm text-teal-200 mt-2">{book.authorsString}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Government Public Library</span>
                </div>
              )}
            </div>

            {/* Quick Action: Reservation */}
            <div className="max-w-[320px] mx-auto pt-2">
              <ReservationButton
                bookId={book.id}
                availableCopies={book.availableCopies}
                totalCopies={book.totalCopies}
                activeReservationsCount={book.activeReservationsCount}
              />
            </div>
          </div>

          {/* Col 2: Bibliographic Details (8 Cols) */}
          <div className="md:col-span-2 lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                {book.category && (
                  <Link
                    href={`/search?category=${book.category.code}`}
                    className="text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-full uppercase tracking-wider transition"
                  >
                    {book.category.name}
                  </Link>
                )}
                {book.ddcCode && (
                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    DDC Classification: {book.ddcCode}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {book.title}
              </h1>

              {book.subtitle && (
                <p className="text-base text-slate-600 font-medium">{book.subtitle}</p>
              )}

              <p className="text-sm text-slate-700 pt-1">
                By <strong className="text-slate-900 font-bold">{book.authorsString}</strong>
              </p>
            </div>

            {/* Availability Status Highlight */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Circulation & Shelf Status</div>
                {getStatusBadge()}
              </div>

              {book.copies && book.copies.length > 0 && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Stack Location:</span>{" "}
                  <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {book.copies[0].shelfLocation}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <div className="space-y-2">
                <h3 className="font-serif text-base font-bold text-slate-900">Bibliographic Summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Bibliographic Metadata Grid */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Publication & Catalogue Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">ISBN</span>
                  <span className="font-mono font-bold text-slate-900">{book.isbn}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Call / Cutter Number</span>
                  <span className="font-mono font-bold text-slate-900">{book.bookNumber || "N/A"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Publisher</span>
                  <span className="font-medium text-slate-900">{book.publisher?.name || "Official Edition"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Publication Year</span>
                  <span className="font-medium text-slate-900">{book.publicationYear || "Classic"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Edition</span>
                  <span className="font-medium text-slate-900">{book.edition || "Standard"}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Catalogue Language</span>
                  <span className="font-medium text-slate-900">{book.language}</span>
                </div>
              </div>
            </div>

            {/* Physical Copies Inventory Table */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Physical Copies Register ({book.copies.length} Accessioned Holdings)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Accession No</th>
                      <th className="py-2.5 px-3">Copy No</th>
                      <th className="py-2.5 px-3">Stack Location</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {book.copies.map((copy: any) => (
                      <tr key={copy.accessionNo} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-900">{copy.accessionNo}</td>
                        <td className="py-2 px-3 text-slate-600">Copy #{copy.copyNumber}</td>
                        <td className="py-2 px-3 text-slate-700">{copy.shelfLocation}</td>
                        <td className="py-2 px-3">
                          {copy.status === "AVAILABLE" && (
                            <span className="text-emerald-700 font-sans font-semibold">Available</span>
                          )}
                          {copy.status === "ISSUED" && (
                            <span className="text-amber-700 font-sans font-semibold">Issued (On Loan)</span>
                          )}
                          {copy.status === "REFERENCE_ONLY" && (
                            <span className="text-slate-700 font-sans font-semibold">Reference Only</span>
                          )}
                          {copy.status === "RESERVED" && (
                            <span className="text-blue-700 font-sans font-semibold">Reserved on Hold</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
