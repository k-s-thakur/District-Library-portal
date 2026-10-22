import Link from "next/link";
import {
  Building2,
  Clock,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function LibraryInformationPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Title Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />
          <span>Public Institution · Ministry of Culture & State Library Board</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About the Government Public Library
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
          Established in 1954 to promote universal reading literacy, lifelong learning, and open access to knowledge. The library houses over 25,000 accessioned volumes spanning literature, regional texts, constitutional archives, science, and computing.
        </p>
      </div>

      {/* Timings & Hours */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Clock className="w-5 h-5 text-teal-700" />
          <h2 className="font-serif text-xl font-bold text-slate-900">
            Hours & Stack Availability
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">General Reading Hall</span>
            <span className="text-teal-700 font-bold block">08:00 AM – 08:00 PM</span>
            <span className="text-slate-500 block text-xs">Monday to Saturday</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">Circulation Desk (Issue/Return)</span>
            <span className="text-teal-700 font-bold block">09:00 AM – 06:30 PM</span>
            <span className="text-slate-500 block text-xs">Monday to Saturday</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">Sunday Reference Session</span>
            <span className="text-teal-700 font-bold block">10:00 AM – 05:00 PM</span>
            <span className="text-slate-500 block text-xs">Reading room only, no loans</span>
          </div>
        </div>
      </section>

      {/* Membership Categories & Quotas */}
      <section id="membership" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <Users className="w-5 h-5 text-teal-700" />
          <h2 className="font-serif text-xl font-bold text-slate-900">
            Citizen Membership Categories & Borrowing Quotas
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Max Books</th>
                <th className="py-3 px-4">Loan Duration</th>
                <th className="py-3 px-4">Late Fine Rate</th>
                <th className="py-3 px-4">Annual Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">General Citizen</td>
                <td className="py-3 px-4">3 Titles</td>
                <td className="py-3 px-4">14 Days</td>
                <td className="py-3 px-4">₹2 / day (2-day grace)</td>
                <td className="py-3 px-4 font-bold text-teal-700">₹100</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">Student & Youth</td>
                <td className="py-3 px-4">4 Titles</td>
                <td className="py-3 px-4">21 Days</td>
                <td className="py-3 px-4">₹1 / day (3-day grace)</td>
                <td className="py-3 px-4 font-bold text-teal-700">₹50</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">Senior Citizen (60+)</td>
                <td className="py-3 px-4">5 Titles</td>
                <td className="py-3 px-4">28 Days</td>
                <td className="py-3 px-4">₹1 / day (5-day grace)</td>
                <td className="py-3 px-4 font-bold text-emerald-700">Free</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">Doctoral / Academic Researcher</td>
                <td className="py-3 px-4">8 Titles</td>
                <td className="py-3 px-4">30 Days</td>
                <td className="py-3 px-4">₹2 / day (3-day grace)</td>
                <td className="py-3 px-4 font-bold text-teal-700">₹200</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900">Government Staff</td>
                <td className="py-3 px-4">5 Titles</td>
                <td className="py-3 px-4">28 Days</td>
                <td className="py-3 px-4">₹1 / day (4-day grace)</td>
                <td className="py-3 px-4 font-bold text-emerald-700">Free</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Rules & Integrity */}
      <section id="rules" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <BookOpen className="w-5 h-5 text-teal-700" />
          <h2 className="font-serif text-xl font-bold text-slate-900">
            Circulation & Stack Usage Rules
          </h2>
        </div>

        <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>Open Access: Any citizen is welcome to enter and consult books in the reading room without prior registration.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>Borrowing: Registered library card with photo identity is required to take physical books home.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>Renewals: Titles may be renewed up to 2 times online if no other member has an active reservation.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>Care of Books: Marking text, folding pages, or damaging barcodes and QR spine stickers is strictly prohibited.</span>
          </li>
        </ul>
      </section>

      {/* Contact & Map */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="font-serif text-xl font-bold">Contact & Location Guide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="space-y-1">
            <span className="font-bold text-teal-400 block">Address</span>
            <span className="text-slate-300 block">Central Secretariat Enclave, CGO Complex, New Delhi 110003</span>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-teal-400 block">Helpline Telephones</span>
            <span className="text-slate-300 block">+91-11-23384501 (Circulation)</span>
            <span className="text-slate-300 block">+91-11-23384502 (Chief Librarian)</span>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-teal-400 block">Email & Digital Portal</span>
            <span className="text-slate-300 block">helpdesk@library.gov.in</span>
            <span className="text-slate-300 block">www.library.gov.in</span>
          </div>
        </div>
      </section>
    </div>
  );
}
