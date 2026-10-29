"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  BookOpen,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Bookmark,
  Building2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  memberId?: string | null;
  memberNo?: string | null;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const discoverRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setCurrentUser(data.user || null);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (discoverRef.current && !discoverRef.current.contains(event.target as Node)) {
        setDiscoverOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  const handleRoleQuickSwitch = async (role: string) => {
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      await fetchUser();
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/");
    router.refresh();
  };

  const isStaff =
    currentUser &&
    ["SUPER_ADMIN", "LIBRARY_ADMIN", "LIBRARIAN", "ACCOUNTS_OPERATOR", "APPROVING_OFFICER"].includes(
      currentUser.role
    );

  if (pathname?.startsWith("/staff")) {
    return null;
  }

  return (

    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      {/* 1. Official Government Utility Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          <span className="font-medium text-slate-200">
            District Public Library · Public Access Catalogue
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
            National Digital Library Node
          </span>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Demo:</span>
          {[
            { role: "MEMBER", label: "Citizen" },
            { role: "LIBRARIAN", label: "Librarian" },
            { role: "ACCOUNTS_OPERATOR", label: "Accounts" },
            { role: "SUPER_ADMIN", label: "Admin" },
          ].map((item) => {
            const active = currentUser?.role === item.role;
            return (
              <button
                key={item.role}
                onClick={() => handleRoleQuickSwitch(item.role)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                  active
                    ? "bg-teal-500 text-slate-950 font-semibold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center group-hover:bg-teal-800 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-base sm:text-lg text-slate-900 group-hover:text-teal-700 transition">
                  District Library
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-teal-50 text-teal-700 border border-teal-200 rounded">
                  OPAC
                </span>
              </div>
            </div>
          </Link>

          {/* Discover dropdown */}
          <div className="relative hidden md:block" ref={discoverRef}>
            <button
              onClick={() => setDiscoverOpen(!discoverOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Browse Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${discoverOpen ? "rotate-180" : ""}`} />
            </button>

            {discoverOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                <Link
                  href="/categories"
                  onClick={() => setDiscoverOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <span className="font-medium">All DDC Classifications</span>
                </Link>
                <Link
                  href="/search?sort=newest"
                  onClick={() => setDiscoverOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Recently Added Titles</span>
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Popular Sections
                </div>
                {[
                  { label: "800 Literature & Classics", code: "LITERATURE" },
                  { label: "500 Science & Technology", code: "SCIENCE" },
                  { label: "004 Computing & IT", code: "CS_TECH" },
                  { label: "900 History & Biography", code: "HISTORY" },
                ].map((item) => (
                  <Link
                    key={item.code}
                    href={`/search?category=${item.code}`}
                    onClick={() => setDiscoverOpen(false)}
                    className="block px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleGlobalSearch}
          className="flex-1 max-w-md hidden sm:flex items-center relative"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-medium transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3">
          <nav className="hidden lg:flex items-center gap-3 text-sm text-slate-600">
            <Link href="/library-information" className="hover:text-teal-700 transition">
              Info & Timings
            </Link>
            {isStaff && (
              <Link
                href="/staff/overview"
                className="px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-semibold text-xs flex items-center gap-1.5 hover:bg-teal-100 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Staff Portal</span>
              </Link>
            )}
          </nav>

          {/* User Account / Sign In */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition text-slate-800 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-medium max-w-[110px] truncate hidden sm:inline">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {currentUser.role}
                    </span>
                  </div>

                  {currentUser.role === "MEMBER" && (
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-teal-600" />
                      <span>My Loans & Dues</span>
                    </Link>
                  )}

                  {isStaff && (
                    <Link
                      href="/staff/overview"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <form onSubmit={handleGlobalSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </form>

          <nav className="flex flex-col space-y-1.5 text-sm font-medium text-slate-700">
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-teal-700"
            >
              Browse Categories
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-teal-700"
            >
              Search Catalogue
            </Link>
            <Link
              href="/library-information"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-teal-700"
            >
              Library Information & Timings
            </Link>
            {isStaff && (
              <Link
                href="/staff/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 font-semibold text-teal-700"
              >
                Staff Portal
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
