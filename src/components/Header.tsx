"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Bookmark,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Building2,
  Compass,
} from "lucide-react";
import { User as UserType } from "@/types";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setCurrentUser(data.user || null);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/");
    router.refresh();
  };

  if (pathname?.startsWith("/staff")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-800 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition">
                District Library
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded border border-teal-200/60">
                OPAC
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Online Public Access Catalogue
            </p>
          </div>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-md hidden md:flex items-center relative"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, subject, ISBN..."
              className="w-full pl-9 pr-20 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 bg-slate-50 hover:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-medium transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/search"
            className={`transition ${
              pathname === "/search"
                ? "text-teal-700 font-semibold"
                : "text-slate-600 hover:text-teal-700"
            }`}
          >
            Catalogue
          </Link>
          <Link
            href="/categories"
            className={`transition ${
              pathname === "/categories"
                ? "text-teal-700 font-semibold"
                : "text-slate-600 hover:text-teal-700"
            }`}
          >
            Categories
          </Link>
          <Link
            href="/library-information"
            className={`transition ${
              pathname === "/library-information"
                ? "text-teal-700 font-semibold"
                : "text-slate-600 hover:text-teal-700"
            }`}
          >
            Library Info
          </Link>
        </nav>

        {/* Right Section: Member Profile or Sign In */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <Link
                href={currentUser.role === "MEMBER" ? "/account" : "/staff/overview"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50 hover:bg-teal-50/50 transition text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[11px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="font-semibold text-slate-800 block leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {currentUser.memberNo || currentUser.role}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-50 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalogue..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
            />
          </form>

          <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              Catalogue
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              Categories
            </Link>
            <Link
              href="/library-information"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              Library Info &amp; Rules
            </Link>
            {currentUser ? (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={currentUser.role === "MEMBER" ? "/account" : "/staff/overview"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-teal-700 font-semibold"
                >
                  My Account ({currentUser.name})
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-xs text-rose-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 py-2.5 px-4 bg-teal-700 text-white font-medium rounded-xl text-center text-xs"
              >
                Member Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
