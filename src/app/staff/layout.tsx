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
} from "lucide-react";
import { StaffProvider, useStaff } from "@/context/StaffContext";

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

  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // New Transaction Modal State
  const [txType, setTxType] = useState<"issue" | "return" | "payment">("issue");
  const [txMemberNo, setTxMemberNo] = useState("");
  const [txAccessionNo, setTxAccessionNo] = useState("");
  const [txAmount, setTxAmount] = useState("50");
  const [txReason, setTxReason] = useState("Overdue fine");
  const [txStatus, setTxStatus] = useState<string | null>(null);

  const branchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setBranchDropdownOpen(false);
      }
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

  const getPageTitle = () => {
    if (pathname.includes("/staff/overview") || pathname === "/staff") return "Overview";
    if (pathname.includes("/staff/catalogue") || pathname.includes("/staff/inventory")) return "Catalogue";
    if (pathname.includes("/staff/members")) return "Members";
    if (pathname.includes("/staff/circulation")) return "Circulation";
    if (pathname.includes("/staff/finance")) return "Finance";
    if (pathname.includes("/staff/reports")) return "Reports";
    if (pathname.includes("/staff/administration")) return "Administration";
    return "Overview";
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

  const branches = [
    { name: "Central Library", sub: "New Delhi · Main branch" },
    { name: "North Campus Library", sub: "Delhi University · North branch" },
    { name: "South Delhi Cultural Wing", sub: "Hauz Khas · South branch" },
    { name: "East Delhi Zonal Library", sub: "Preet Vihar · East branch" },
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
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 antialiased font-sans">
      {/* 1. LEFT SIDEBAR (Matching Old Theme: Slate 900 & Teal 600) */}
      <aside
        className={`w-full md:w-64 bg-slate-900 text-slate-300 shrink-0 flex flex-col justify-between border-r border-slate-800 z-40 transition-all ${
          mobileSidebarOpen ? "block" : "hidden md:flex"
        }`}
      >
        <div className="p-4 sm:p-5 space-y-5">
          {/* Brand Header */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-900/50">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-[16px] font-bold text-white tracking-tight leading-none">
                Janata Library
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-teal-400 font-semibold mt-1">
                GPLMS Staff Portal
              </p>
            </div>
          </div>

          {/* Branch Selector Dropdown */}
          <div className="relative" ref={branchRef}>
            <button
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 transition text-left group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-teal-900/70 text-teal-300 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-700/60">
                  JL
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-100 leading-tight truncate">
                    {branch.split("(")[0].trim()}
                  </div>
                  <div className="text-[10px] text-teal-400 truncate leading-tight">
                    New Delhi · Main branch
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0 ml-1" />
            </button>

            {branchDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
                {branches.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => {
                      setBranch(`${b.name} (${b.sub})`);
                      setBranchDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-700/80 transition flex flex-col ${
                      branch.includes(b.name) ? "bg-teal-950/70 text-teal-300 font-medium" : "text-slate-300"
                    }`}
                  >
                    <span className="font-semibold text-white">{b.name}</span>
                    <span className="text-[10px] text-slate-400">{b.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2.5 mb-1.5">
              Workspace
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      item.active
                        ? "bg-teal-600 text-white shadow-sm font-semibold"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          item.active ? "text-white" : "text-slate-400"
                        }`}
                      />
                      <div className="truncate">
                        <div>{item.label}</div>
                      </div>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        item.active
                          ? "bg-teal-800 text-teal-100"
                          : "bg-slate-800 text-teal-400 border border-slate-700"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: Staff Guide & Admin User */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {/* Help Box */}
          <button
            onClick={() => setStaffGuideOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition text-xs text-slate-300 group"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-teal-400 group-hover:text-teal-300" />
              <div>
                <p className="text-[10px] text-slate-400 leading-none">Need a hand?</p>
                <p className="text-xs font-medium text-slate-200 leading-tight mt-0.5">
                  View staff guide
                </p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition" />
          </button>

          {/* Admin Staff User Card */}
          <div className="relative" ref={profileRef}>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-teal-900/60 text-teal-300 font-semibold text-xs flex items-center justify-center border border-teal-700/60 shrink-0">
                  AS
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate">
                    {currentUser?.name || "Admin Staff"}
                  </p>
                  <p className="text-[10px] text-teal-400 truncate">
                    {currentUser?.role === "SUPER_ADMIN"
                      ? "Super Administrator"
                      : "Library Administrator"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-1 hover:text-white text-slate-400 rounded transition"
                title="Account options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {profileMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-slate-700 text-[11px] text-slate-400">
                  Signed in as <span className="font-semibold text-white">{currentUser?.email || "admin@library.gov.in"}</span>
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public OPAC Portal</span>
                </Link>
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/40 transition text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-teal-400 text-xs py-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public OPAC</span>
          </Link>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        {/* Top Header Bar across all workspace views */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 shadow-xs">
          {/* Breadcrumb Left */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <span className="text-slate-400 font-medium">Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-teal-700 font-semibold">{getPageTitle()}</span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Preview Data Toggle Badge */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewData(!previewData)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition cursor-pointer ${
                  previewData
                    ? "bg-amber-50 text-amber-800 border-amber-300/80 hover:bg-amber-100"
                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                }`}
                title="Toggle sample preview data vs live database"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    previewData ? "bg-amber-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                <span>Preview data</span>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  markNotificationsAsRead();
                }}
                className="relative p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-teal-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Notifications & Alerts</span>
                    <span className="text-[10px] text-teal-600 font-mono">Automated queue</span>
                  </div>
                  <div className="space-y-2 py-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border flex gap-2.5 ${
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
                    className="w-full text-center py-1.5 text-slate-500 hover:text-slate-800 text-[11px] border-t border-slate-100 mt-1"
                  >
                    Close panel
                  </button>
                </div>
              )}
            </div>

            {/* Date Display */}
            <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1.5">
              <span>Wednesday, 21 October 2026</span>
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* 3. QUICK TRANSACTION MODAL */}
      {transactionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
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
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transaction Type Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-medium">
              <button
                onClick={() => setTxType("issue")}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  txType === "issue" ? "bg-white text-teal-800 shadow-xs font-semibold" : "text-slate-500"
                }`}
              >
                Issue Book
              </button>
              <button
                onClick={() => setTxType("return")}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  txType === "return" ? "bg-white text-teal-800 shadow-xs font-semibold" : "text-slate-500"
                }`}
              >
                Return Book
              </button>
              <button
                onClick={() => setTxType("payment")}
                className={`flex-1 py-1.5 rounded-lg transition ${
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
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
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-xs"
                >
                  Submit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. STAFF GUIDE MODAL */}
      {staffGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Janata Library · Staff Operations Guide
                  </h3>
                  <p className="text-xs text-slate-500">Standard Operating Procedures & Shortcuts</p>
                </div>
              </div>
              <button
                onClick={() => setStaffGuideOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-semibold text-slate-900 text-sm">1. Loan & Circulation Rules</h4>
                <p>• Standard citizen quota: 3 titles for 14 days.</p>
                <p>• Students: 5 titles for 21 days; Researchers: 7 titles for 30 days.</p>
                <p>• Overdue fine: ₹2 per day after grace period of 2 calendar days.</p>
                <p>• Maximum 2 renewals permitted if no other member has placed an active reservation.</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-semibold text-slate-900 text-sm">2. Dewey Decimal Classification (DDC) Quick Index</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>000 - Computer science & info</div>
                  <div>100 - Philosophy & psychology</div>
                  <div>200 - Religion & theology</div>
                  <div>300 - Social sciences & Law</div>
                  <div>500 - Pure Sciences & Math</div>
                  <div>800 - Literature & Rhetoric</div>
                  <div>900 - History & Geography</div>
                  <div>954 - History of India & South Asia</div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <h4 className="font-semibold text-slate-900 text-sm">3. Cash Desk & Receipts</h4>
                <p>• Every fine or fee payment must generate an automated receipt (RCP-YYYYMM-XXXX).</p>
                <p>• Receipts cannot be modified once posted. Reversals require approving officer review.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setStaffGuideOpen(false)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white font-medium hover:bg-teal-800"
              >
                Understood, close guide
              </button>
            </div>
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
