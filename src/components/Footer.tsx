"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Phone, Mail, MapPin, Clock, BookOpen, ShieldCheck } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/staff")) return null;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Library Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">GPLMS OPAC</h3>
                <p className="text-[11px] text-slate-400">Government Public Library System</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Online Public Access Catalogue for physical book discovery, Dewey Decimal Classification verification, and real-time stack inventory availability.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NIC & Digital India Compliant</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Catalogue & Stacks
            </h4>
            <ul className="space-y-2 text-xs">
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
                  500 Natural Sciences & Astronomy
                </Link>
              </li>
              <li>
                <Link href="/search?category=CS_TECH" className="hover:text-teal-400 transition">
                  004 Computing & Algorithms
                </Link>
              </li>
              <li>
                <Link href="/search?category=HISTORY" className="hover:text-teal-400 transition">
                  900 History, Heritage & Biographies
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services & Rules */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Services & Policies
            </h4>
            <ul className="space-y-2 text-xs">
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
                <Link href="/library-information#membership" className="hover:text-teal-400 transition">
                  Citizen Membership Categories
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition">
                  Member Portal & Digital Card
                </Link>
              </li>
              <li>
                <Link href="/staff/circulation" className="hover:text-teal-400 transition">
                  Staff Circulation Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Visit & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wide uppercase mb-3">
              Visit the Library
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Central Secretariat Enclave, CGO Complex, New Delhi 110003</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div>Mon – Sat: 08:00 AM – 08:00 PM</div>
                <div className="text-[11px] text-slate-500">Circulation closes 06:30 PM</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-teal-400 shrink-0" />
              <span>+91-11-23384501 / 4502</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-teal-400 shrink-0" />
              <span>helpdesk@library.gov.in</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} Government Public Library System. All physical holdings rights reserved.</p>
          <p>This is an Online Public Access Catalogue for physical book discovery; not an commercial ebook repository.</p>
        </div>
      </div>
    </footer>
  );
}
