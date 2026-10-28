"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Repeat,
  IndianRupee,
  FileText,
  Sliders,
  HelpCircle,
  Bell,
  ChevronDown,
  MoreHorizontal,
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Building2,
  Layers,
  ArrowLeft,
  Sparkles,
  Menu,
  Clock,
  Search,
} from "lucide-react";
import { StaffProvider, useStaff } from "@/context/StaffContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";

function StaffLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const {
    previewData,
    setPreviewData,
    branch,
    setBranch,
    transactionModalOpen,
    setTransactionModalOpen,
    staffGuideOpen,
    setStaffGuideOpen,
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationsAsRead,
  } = useStaff();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // New Transaction Modal State
  const [txType, setTxType] = useState<"issue" | "return" | "payment">("issue");
  const [txMemberNo, setTxMemberNo] = useState("");
  const [txAccessionNo, setTxAccessionNo] = useState("");
  const [txAmount, setTxAmount] = useState("50");
  const [txReason, setTxReason] = useState("Overdue fine");
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
      }
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setNotificationsOpen]);

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

  const getPageTitle = () => {
    if (pathname.includes("/staff/overview") || pathname === "/staff") return "Overview";
    if (pathname.includes("/staff/catalogue") || pathname.includes("/staff/inventory")) return "Catalogue & Stacks";
    if (pathname.includes("/staff/circulation")) return "Circulation Desk";
    if (pathname.includes("/staff/finance")) return "Finance & Receipts";
    if (pathname.includes("/staff/members")) return "Members Directory";
    if (pathname.includes("/staff/reports")) return "Reports & Insights";
    if (pathname.includes("/staff/administration")) return "Administration";
    return "Staff Operations";
  };

  const navItems = [
    {
      href: "/staff/overview",
      label: "Overview",
      desc: "Daily Stats & Activity",
      icon: LayoutDashboard,
      active: pathname === "/staff" || pathname.startsWith("/staff/overview"),
    },
    {
      href: "/staff/catalogue",
      label: "Catalogue & Stacks",
      desc: "DDC, Copies & Labels",
      icon: BookOpen,
      active: pathname.startsWith("/staff/catalogue") || pathname.startsWith("/staff/inventory"),
    },
    {
      href: "/staff/circulation",
      label: "Circulation Desk",
      desc: "Fast Issue, Return & Due",
      icon: Repeat,
      badge: "12",
      active: pathname.startsWith("/staff/circulation"),
    },
    {
      href: "/staff/finance",
      label: "Finance & Receipts",
      desc: "Cash Desk & Reversals",
      icon: IndianRupee,
      active: pathname.startsWith("/staff/finance"),
    },
    {
      href: "/staff/members",
      label: "Members Directory",
      desc: "Registration & Digital Cards",
      icon: Users,
      active: pathname.startsWith("/staff/members"),
    },
    {
      href: "/staff/reports",
      label: "Reports & Insights",
      desc: "Auditing & Monthly Stats",
      icon: FileText,
      active: pathname.startsWith("/staff/reports"),
    },
    {
      href: "/staff/administration",
      label: "Administration",
      desc: "Fine Tariffs & Policies",
      icon: Sliders,
      active: pathname.startsWith("/staff/administration"),
    },
  ];

  const handleExecuteTx = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxStatus("Processing transaction...");
    setTimeout(() => {
      setTxStatus(`Success! ${txType.toUpperCase()} recorded successfully.`);
      setTimeout(() => {
        setTxStatus(null);
        setTransactionModalOpen(false);
        setTxMemberNo("");
        setTxAccessionNo("");
      }, 1200);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Main Masthead & Unified Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        {/* Top Masthead Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/staff/overview" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-800 transition">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition">
                    GPLMS
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200/60 rounded-full">
                    Staff Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Janata Library · Desk & Operations
                </p>
              </div>
            </Link>
          </div>

          {/* Right Action Controls: Public Portal Link, ThemeSwitcher, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
              title="Open Public Online Public Access Catalogue"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
              <span>Public OPAC</span>
            </Link>

            {/* Dynamic Theme Switcher */}
            <ThemeSwitcher />

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  markNotificationsAsRead();
                }}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200 cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Notifications & Alerts</span>
                    <span className="text-[10px] text-teal-700 font-mono font-medium">Automated queue</span>
                  </div>
                  <div className="space-y-2 py-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border flex gap-2.5 ${
                          n.type === "warning"
                            ? "bg-amber-50/70 border-amber-200 text-amber-900"
                            : n.type === "success"
                            ? "bg-teal-50/70 border-teal-200 text-teal-900"
                            : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.type === "warning" ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          ) : n.type === "success" ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                          ) : (
                            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-[11px] leading-snug">{n.title}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full text-center py-1.5 text-slate-500 hover:text-slate-800 text-[11px] border-t border-slate-100 mt-1 cursor-pointer"
                  >
                    Close panel
                  </button>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-800 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "AS"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser?.name || "Admin Staff"}
                  </p>
                  <p className="text-[10px] text-teal-700 leading-tight">
                    {currentUser?.role === "SUPER_ADMIN" ? "Super Admin" : "Librarian"}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{currentUser?.name || "Admin Staff"}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || "admin@library.gov.in"}</p>
                  </div>

                  <Link
                    href="/"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-teal-50 hover:text-teal-900 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
                    <span>View Public OPAC</span>
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      router.push("/login");
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="border-t border-slate-100 bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      item.active
                        ? "bg-teal-700 text-white shadow-xs font-bold"
                        : "text-slate-600 hover:text-teal-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.active ? "text-white" : "text-teal-700"}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                          item.active
                            ? "bg-teal-900 text-teal-100"
                            : "bg-teal-100 text-teal-900 font-bold"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Workspace Sections
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    item.active
                      ? "bg-teal-700 text-white font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>

      {/* Quick Transaction Modal */}
      {transactionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">New Fast Transaction</h3>
                  <p className="text-xs text-slate-500">Quick issue, return or cash fee desk</p>
                </div>
              </div>
              <button
                onClick={() => setTransactionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transaction Type Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-medium">
              <button
                onClick={() => setTxType("issue")}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  txType === "issue" ? "bg-white text-teal-800 shadow-xs font-semibold" : "text-slate-500"
                }`}
              >
                Issue Book
              </button>
              <button
                onClick={() => setTxType("return")}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  txType === "return" ? "bg-white text-teal-800 shadow-xs font-semibold" : "text-slate-500"
                }`}
              >
                Return Book
              </button>
              <button
                onClick={() => setTxType("payment")}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  txType === "payment" ? "bg-white text-teal-800 shadow-xs font-semibold" : "text-slate-500"
                }`}
              >
                Record Payment
              </button>
            </div>

            <form onSubmit={handleExecuteTx} className="space-y-3 text-xs">
              {txType !== "return" && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Member Number or Mobile
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MBR-2024-0185 or 9811002233"
                    value={txMemberNo}
                    onChange={(e) => setTxMemberNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  />
                </div>
              )}

              {txType !== "payment" && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Accession No. or Scan Barcode
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACC-2024-0043"
                    value={txAccessionNo}
                    onChange={(e) => setTxAccessionNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  />
                </div>
              )}

              {txType === "payment" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Receipt Type</label>
                    <select
                      value={txReason}
                      onChange={(e) => setTxReason(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                    >
                      <option>Overdue fine</option>
                      <option>Membership renewal</option>
                      <option>Lost book recovery</option>
                    </select>
                  </div>
                </div>
              )}

              {txStatus && (
                <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
                  {txStatus}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-xs cursor-pointer"
                >
                  Submit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <StaffProvider>
      <StaffLayoutInner>{children}</StaffLayoutInner>
    </StaffProvider>
  );
}
