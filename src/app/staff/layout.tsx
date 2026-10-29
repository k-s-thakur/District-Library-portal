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
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Building2,
  Plus,
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
  }, [pathname]);

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
    if (pathname.includes("/staff/overview") || pathname === "/staff") return "Dashboard Overview";
    if (pathname.includes("/staff/catalogue") || pathname.includes("/staff/inventory")) return "Catalogue & Inventory";
    if (pathname.includes("/staff/members")) return "Members Directory";
    if (pathname.includes("/staff/circulation")) return "Circulation Desk";
    if (pathname.includes("/staff/finance")) return "Finance & Receipts";
    if (pathname.includes("/staff/reports")) return "Reports & Auditing";
    if (pathname.includes("/staff/administration")) return "Administration";
    return "Staff Portal";
  };

  const navSections = [
    {
      title: "Operations",
      items: [
        {
          href: "/staff/overview",
          label: "Dashboard",
          icon: LayoutDashboard,
          active: pathname === "/staff" || pathname.startsWith("/staff/overview"),
        },
        {
          href: "/staff/circulation",
          label: "Circulation Desk",
          icon: Repeat,
          badge: "12",
          active: pathname.startsWith("/staff/circulation"),
        },
        {
          href: "/staff/finance",
          label: "Finance & Receipts",
          icon: IndianRupee,
          active: pathname.startsWith("/staff/finance"),
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          href: "/staff/catalogue",
          label: "Catalogue & Stacks",
          icon: BookOpen,
          active: pathname.startsWith("/staff/catalogue") || pathname.startsWith("/staff/inventory"),
        },
        {
          href: "/staff/members",
          label: "Members Directory",
          icon: Users,
          active: pathname.startsWith("/staff/members"),
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          href: "/staff/reports",
          label: "Reports & Audit",
          icon: FileText,
          active: pathname.startsWith("/staff/reports"),
        },
        {
          href: "/staff/administration",
          label: "Administration",
          icon: Sliders,
          active: pathname.startsWith("/staff/administration"),
        },
      ],
    },
  ];

  const branches = [
    { name: "Central Library", sub: "Main Branch · New Delhi" },
    { name: "North Campus Library", sub: "Zonal Branch · North" },
    { name: "South Cultural Wing", sub: "Zonal Branch · South" },
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
      }, 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 antialiased font-sans">
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`w-full md:w-60 bg-slate-900 text-slate-300 shrink-0 flex flex-col justify-between border-r border-slate-800 z-40 transition-all ${
          mobileSidebarOpen ? "block" : "hidden md:flex"
        }`}
      >
        <div className="p-4 space-y-4">
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 px-1 py-1">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white tracking-tight truncate">
                District Library
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-teal-400 font-semibold truncate">
                Admin & Staff Portal
              </p>
            </div>
          </div>

          {/* Branch Selector Dropdown */}
          <div className="relative" ref={branchRef}>
            <button
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition text-left"
            >
              <div className="truncate">
                <div className="text-xs font-medium text-slate-200 truncate">
                  {branch.split("(")[0].trim()}
                </div>
                <div className="text-[10px] text-slate-400 truncate">Main Branch</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
            </button>

            {branchDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                {branches.map((b) => (
                  <button
                    key={b.name}
                    onClick={() => {
                      setBranch(`${b.name} (${b.sub})`);
                      setBranchDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-700 transition flex flex-col ${
                      branch.includes(b.name) ? "bg-teal-950/70 text-teal-300 font-medium" : "text-slate-300"
                    }`}
                  >
                    <span className="font-medium text-white">{b.name}</span>
                    <span className="text-[10px] text-slate-400">{b.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grouped Navigation Menus */}
          <nav className="space-y-4 pt-1">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-0.5">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                          item.active
                            ? "bg-teal-600 text-white font-semibold shadow-xs"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              item.active ? "text-white" : "text-slate-400"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
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
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Help Link */}
          <button
            onClick={() => setStaffGuideOpen(true)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>Staff Guide & SOPs</span>
            </div>
          </button>

          {/* User Profile Card */}
          <div className="relative" ref={profileRef}>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800 border border-slate-700/80">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-md bg-teal-800 text-teal-200 font-semibold text-xs flex items-center justify-center shrink-0">
                  {currentUser?.name ? currentUser.name.charAt(0) : "A"}
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-white truncate">
                    {currentUser?.name || "Admin Staff"}
                  </p>
                  <p className="text-[10px] text-teal-400 truncate">
                    {currentUser?.role || "LIBRARIAN"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Account options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {profileMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1 border-b border-slate-700 text-[10px] text-slate-400 truncate">
                  {currentUser?.email || "admin@library.gov.in"}
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public OPAC Portal</span>
                </Link>
                <button
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    router.push("/login");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-400 hover:bg-rose-950/40 transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
        {/* Official Government Utility Strip (Matching OPAC) */}
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span className="font-medium text-slate-200">
              District Public Library · Staff Administration Console
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
              { role: "MEMBER", label: "Citizen", path: "/" },
              { role: "LIBRARIAN", label: "Librarian", path: "/staff/overview" },
              { role: "ACCOUNTS_OPERATOR", label: "Accounts", path: "/staff/finance" },
              { role: "SUPER_ADMIN", label: "Admin", path: "/staff/administration" },
            ].map((item) => {
              const active = currentUser?.role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={async () => {
                    await fetch("/api/auth/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ role: item.role }),
                    });
                    if (item.path === "/") {
                      router.push("/");
                    } else {
                      window.location.reload();
                    }
                  }}
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
            <Link
              href="/"
              className="ml-2 pl-2 border-l border-slate-700 text-[11px] text-teal-300 hover:text-white flex items-center gap-1"
            >
              <span>Public OPAC</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Breadcrumb Left */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
            <span className="text-slate-400 font-normal">Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">{getPageTitle()}</span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Quick New Transaction Button */}
            <button
              onClick={() => setTransactionModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Action</span>
            </button>

            {/* Preview Data Toggle Badge */}
            <button
              onClick={() => setPreviewData(!previewData)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border transition cursor-pointer ${
                previewData
                  ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
              title="Toggle sample preview data vs live database"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  previewData ? "bg-amber-500" : "bg-slate-400"
                }`}
              />
              <span>Demo Mode</span>
            </button>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  markNotificationsAsRead();
                }}
                className="relative p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-teal-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Notifications</span>
                    <span className="text-[10px] text-slate-400 font-mono">System feed</span>
                  </div>
                  <div className="space-y-1.5 py-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 rounded-md border border-slate-100 bg-slate-50 text-slate-800"
                      >
                        <p className="text-[11px] leading-snug">{n.title}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="w-full text-center py-1 text-slate-500 hover:text-slate-800 text-[11px] border-t border-slate-100 mt-1 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-teal-700 font-medium hidden sm:inline transition"
              title="Return to Public OPAC"
            >
              Public OPAC ↗
            </Link>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* 3. QUICK TRANSACTION MODAL */}
      {transactionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Fast Circulation Desk</h3>
                  <p className="text-[11px] text-slate-500">Quick issue, return or fee collection</p>
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
            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
              <button
                onClick={() => setTxType("issue")}
                className={`flex-1 py-1 rounded-md transition ${
                  txType === "issue" ? "bg-white text-teal-800 shadow-xs font-semibold" : "text-slate-500"
                }`}
              >
                Issue Book
              </button>
              <button
                onClick={() => setTxType("return")}
                className={`flex-1 py-1 rounded-md transition ${
                  txType === "return" ? "bg-white text-teal-800 shadow-xs font-semibold" : "text-slate-500"
                }`}
              >
                Return Book
              </button>
              <button
                onClick={() => setTxType("payment")}
                className={`flex-1 py-1 rounded-md transition ${
                  txType === "payment" ? "bg-white text-teal-800 shadow-xs font-semibold" : "text-slate-500"
                }`}
              >
                Record Fee
              </button>
            </div>

            <form onSubmit={handleExecuteTx} className="space-y-3 text-xs">
              {txType !== "return" && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Member Number (GPL-XXXXX)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GPL-2026-00001"
                    value={txMemberNo}
                    onChange={(e) => setTxMemberNo(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
              )}

              {txType !== "payment" && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Accession No. or Barcode
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ACC-2026-0001"
                    value={txAccessionNo}
                    onChange={(e) => setTxAccessionNo(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
              )}

              {txType === "payment" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Receipt Type</label>
                    <select
                      value={txReason}
                      onChange={(e) => setTxReason(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                    >
                      <option>Overdue fine</option>
                      <option>Membership renewal</option>
                      <option>Lost book recovery</option>
                    </select>
                  </div>
                </div>
              )}

              {txStatus && (
                <div className="p-2 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
                  {txStatus}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTransactionModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-xs cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. STAFF GUIDE MODAL */}
      {staffGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-5 space-y-3.5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Staff Operations Guide & SOPs
                  </h3>
                  <p className="text-[11px] text-slate-500">Circulation rules and reference codes</p>
                </div>
              </div>
              <button
                onClick={() => setStaffGuideOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <h4 className="font-semibold text-slate-900 text-xs">1. Loan & Circulation Limits</h4>
                <p>• General Citizen quota: 3 titles for 14 days.</p>
                <p>• Students: 5 titles for 21 days; Researchers: 7 titles for 30 days.</p>
                <p>• Overdue fine: ₹2 per calendar day after grace period.</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <h4 className="font-semibold text-slate-900 text-xs">2. Cash Receipts & Auditing</h4>
                <p>• Every fine or fee payment generates a unique receipt (RCP-YYYYMM-XXXX).</p>
                <p>• Reversals require approving officer authorization.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setStaffGuideOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-teal-700 text-white font-medium hover:bg-teal-800 text-xs cursor-pointer"
              >
                Close Guide
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
