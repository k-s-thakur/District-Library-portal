"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Phone, Mail, MapPin, Clock, ShieldCheck } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/staff")) return null;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-6 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: Library Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">District Public Library</h3>
                <p className="text-[11px] text-slate-400">Online Public Access Catalogue (OPAC)</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Physical book discovery, Dewey Decimal Classification verification, and real-time shelf inventory tracking.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-teal-400">
              <ShieldCheck className="w-3 h-3" />
              <span>Digital India Compliant</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Catalogue & Stacks
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/search" className="hover:text-teal-400 transition">
                  Search Full Catalogue
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-teal-400 transition">
                  Browse All Categories & DDC
                </Link>
              </li>
              <li>
                <Link href="/search?category=LITERATURE" className="hover:text-teal-400 transition">
                  800 Indian & World Literature
                </Link>
              </li>
              <li>
                <Link href="/search?category=SCIENCE" className="hover:text-teal-400 transition">
                  500 Natural Sciences & Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Services & Policies
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/library-information" className="hover:text-teal-400 transition">
                  Reading Hall & Stack Timings
                </Link>
              </li>
              <li>
                <Link href="/library-information#rules" className="hover:text-teal-400 transition">
                  Borrowing Rules & Loan Durations
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition">
                  Member Portal & Digital Card
                </Link>
              </li>
              <li>
                <Link href="/staff/overview" className="hover:text-teal-400 transition">
                  Staff Administration Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Visit & Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Location & Hours
            </h4>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span>Central Secretariat Enclave, New Delhi 110003</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div>Mon – Sat: 08:00 AM – 08:00 PM</div>
                <div className="text-[10px] text-slate-500">Circulation closes 06:30 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>+91-11-23384501</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} Government Public Library System. Physical holdings rights reserved.</p>
          <p>Online Public Access Catalogue for physical book discovery.</p>
        </div>
      </div>
    </footer>
  );
}
