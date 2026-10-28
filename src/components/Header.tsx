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
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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

  // Close discover dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (discoverRef.current && !discoverRef.current.contains(event.target as Node)) {
        setDiscoverOpen(false);
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Main Discovery Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Library Brand Identity */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-800 transition">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition">
                  GPLMS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-teal-100 text-teal-800 rounded">
                  OPAC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Online Public Access Catalogue
              </p>
            </div>
          </Link>

          {/* Discover Menu Dropdown */}
          <div className="relative hidden md:block" ref={discoverRef}>
            <button
              onClick={() => setDiscoverOpen(!discoverOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition cursor-pointer"
              aria-expanded={discoverOpen}
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Discover</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${discoverOpen ? "rotate-180" : ""}`} />
            </button>

            {discoverOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Catalogue Discovery
                </div>
                <Link
                  href="/categories"
                  onClick={() => setDiscoverOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <BookOpen className="w-4 h-4 text-teal-600" />
                  <div>
                    <div className="font-medium">Browse All Categories</div>
                    <div className="text-xs text-slate-500">Explore by subject taxonomy</div>
                  </div>
                </Link>
                <Link
                  href="/search?sort=newest"
                  onClick={() => setDiscoverOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-900"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-medium">Recently Added Titles</div>
                    <div className="text-xs text-slate-500">Fresh catalogue acquisitions</div>
                  </div>
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Popular Classifications
                </div>
                {[
                  { label: "800 Literature & Classics", code: "LITERATURE" },
                  { label: "500 Science & Astronomy", code: "SCIENCE" },
                  { label: "004 Computing & Technology", code: "CS_TECH" },
                  { label: "900 History & Heritage", code: "HISTORY" },
                  { label: "340 Constitution & Law", code: "LAW_GOV" },
                ].map((item) => (
                  <Link
                    key={item.code}
                    href={`/search?category=${item.code}`}
                    onClick={() => setDiscoverOpen(false)}
                    className="block px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-teal-700"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar (Dominant Header Action) */}
        <form
          onSubmit={handleGlobalSearch}
          className="flex-1 max-w-lg hidden sm:flex items-center relative"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalogue by title, author, ISBN or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-full bg-slate-50 border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-full text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        {/* Navigation Links & Account Actions */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/library-information" className="hover:text-teal-700 transition">
              About & Timings
            </Link>
            {isStaff && (
              <Link
                href="/staff/circulation"
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                <span>Staff Portal</span>
              </Link>
            )}
          </nav>

          {/* User Account / Sign In */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition text-slate-800 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                      {currentUser.role}
                    </span>
                  </div>

                  {currentUser.role === "MEMBER" && (
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Bookmark className="w-4 h-4 text-teal-600" />
                      <span>My Borrowed Books & Dues</span>
                    </Link>
                  )}

                  {isStaff && (
                    <>
                      <Link
                        href="/staff/circulation"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        <span>Circulation Desk</span>
                      </Link>
                      <Link
                        href="/staff/finance"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <span>Cash Receipts & Dues</span>
                      </Link>
                    </>
                  )}

                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Member Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleGlobalSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-100 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </form>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-teal-700"
            >
              Browse All Categories
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-teal-700"
            >
              Full Search Stacks
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
                href="/staff/circulation"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 font-bold text-teal-700"
              >
                Staff Circulation Portal
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Theme</span>
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
