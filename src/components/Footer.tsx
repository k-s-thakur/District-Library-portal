"use client";

import Link from "next/link";
import { BookOpen, MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Library Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-sm font-bold tracking-tight">
                District Public Library
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Open Knowledge Infrastructure for citizens, researchers, and students.
              Explore our digitized catalog, physical collections, and study spaces.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 text-[11px] text-teal-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Government of India · NIC Compliant</span>
            </div>
          </div>

          {/* Col 2: Quick Catalog Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Explore Catalogue
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/search" className="hover:text-teal-400 transition">
                  Search All Titles
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-teal-400 transition">
                  Browse by Dewey Subject
                </Link>
              </li>
              <li>
                <Link href="/search?available=true" className="hover:text-teal-400 transition">
                  Available on Shelf Now
                </Link>
              </li>
              <li>
                <Link href="/search?sort=newest" className="hover:text-teal-400 transition">
                  Recently Added Acquisitions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Services &amp; Portals
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/library-information" className="hover:text-teal-400 transition">
                  Reading Hall &amp; Stack Timings
                </Link>
              </li>
              <li>
                <Link href="/library-information#rules" className="hover:text-teal-400 transition">
                  Borrowing Rules &amp; Loan Durations
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-teal-400 transition">
                  Citizen Member OPAC (No Password)
                </Link>
              </li>
              <li>
                <Link href="/staff/overview" className="hover:text-teal-400 transition font-medium text-teal-300">
                  Staff &amp; Admin Portal (Open Access)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Visit & Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Location &amp; Hours
            </h4>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
              <span>Central Secretariat Enclave, New Delhi 110003</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Mon – Sat: 08:00 AM – 08:00 PM (IST)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>+91 (011) 2338-2026</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>library-helpdesk@nic.in</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© 2026 District Public Library Management System (GPLMS). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for District Open Public Access Catalogue
          </p>
        </div>
      </div>
    </footer>
  );
}
