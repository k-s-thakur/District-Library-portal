import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  MapPin
} from "lucide-react";

export default function LibraryInformationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Intro */}
      <div className="space-y-2">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Library Information &amp; Rules
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Open citizen access, stack guidelines, operating hours, and borrowing quotas.
        </p>
      </div>

      {/* Hours */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Clock className="w-4 h-4 text-teal-700" />
          <h2 className="font-serif text-base font-bold text-slate-900">
            Operating Hours
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-lg space-y-0.5">
            <span className="font-semibold text-slate-900 block">Reading Hall</span>
            <span className="text-teal-700 font-bold block">08:00 AM – 08:00 PM</span>
            <span className="text-slate-400 block text-[11px]">Monday to Saturday</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg space-y-0.5">
            <span className="font-semibold text-slate-900 block">Circulation Desk</span>
            <span className="text-teal-700 font-bold block">09:00 AM – 06:30 PM</span>
            <span className="text-slate-400 block text-[11px]">Book issues &amp; returns</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg space-y-0.5">
            <span className="font-semibold text-slate-900 block">Reference Section</span>
            <span className="text-teal-700 font-bold block">10:00 AM – 05:00 PM</span>
            <span className="text-slate-400 block text-[11px]">Mon – Fri (Gazetted closed)</span>
          </div>
        </div>
      </section>

      {/* Membership Quotas */}
      <section id="membership" className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Users className="w-4 h-4 text-teal-700" />
          <h2 className="font-serif text-base font-bold text-slate-900">
            Membership Categories &amp; Quotas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-slate-900">Student Member</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">STUDENT</span>
            </div>
            <p className="text-slate-600">Borrow up to <strong>4 books</strong> for 14 days. Security deposit: ₹100.</p>
          </div>

          <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-slate-900">General Citizen</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">CITIZEN</span>
            </div>
            <p className="text-slate-600">Borrow up to <strong>6 books</strong> for 21 days. Security deposit: ₹200.</p>
          </div>

          <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-slate-900">Senior Citizen (60+)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">SENIOR</span>
            </div>
            <p className="text-slate-600">Borrow up to <strong>8 books</strong> for 30 days. No deposit required.</p>
          </div>

          <div className="border border-slate-100 bg-slate-50/50 rounded-lg p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-slate-900">Research Scholar</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">SCHOLAR</span>
            </div>
            <p className="text-slate-600">Borrow up to <strong>8 books</strong> for 30 days with stack archives access.</p>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 scroll-mt-20">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="w-4 h-4 text-teal-700" />
          <h2 className="font-serif text-base font-bold text-slate-900">
            Circulation Rules
          </h2>
        </div>

        <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
          <li>Members must present their digital or physical card at check-out.</li>
          <li>Books can be renewed up to 2 times if no other patron has placed a hold.</li>
          <li>An overdue fine of <strong>₹2.00 per book/day</strong> applies past the due date.</li>
          <li>Damaged or lost books must be replaced with an identical edition or reimbursed.</li>
        </ul>
      </section>

      {/* Location */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <MapPin className="w-4 h-4 text-teal-700" />
          <h2 className="font-serif text-base font-bold text-slate-900">
            Location &amp; Contact
          </h2>
        </div>

        <div className="text-xs text-slate-600 space-y-1">
          <p><strong>Address:</strong> CGO Complex, Block 4, Lodhi Road, New Delhi – 110003</p>
          <p><strong>Transit:</strong> JLN Stadium Metro Station (Violet Line, Gate 2) – 400m</p>
          <p><strong>Enquiries:</strong> Phone: +91 (011) 2436-0000 | Email: circulation@library.gov.in</p>
        </div>
      </section>
    </div>
  );
}
