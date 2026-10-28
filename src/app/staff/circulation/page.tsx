"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Repeat,
  QrCode,
  Plus,
  Download,
  Bell,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  ArrowRight,
  X,
  Search,
  Scan,
  User,
  BookOpen,
  Calendar,
  Layers,
  ArrowLeftRight,
} from "lucide-react";

interface FollowUpItem {
  id: string;
  member: string;
  memberSubtitle: string;
  book: string;
  dueDate: string;
  followUp: "Due today" | "Overdue 2 days" | "Due tomorrow";
  reminded?: boolean;
}

const initialFollowUps: FollowUpItem[] = [
  {
    id: "f-1",
    member: "Rahul Verma",
    memberSubtitle: "Member record - sample",
    book: "The Discovery of India",
    dueDate: "21 Oct 2026",
    followUp: "Due today",
  },
  {
    id: "f-2",
    member: "Sana Qureshi",
    memberSubtitle: "Member record - sample",
    book: "The Argumentative Indian",
    dueDate: "21 Oct 2026",
    followUp: "Due today",
  },
  {
    id: "f-3",
    member: "Arjun Mehta",
    memberSubtitle: "Member record - sample",
    book: "India After Gandhi",
    dueDate: "21 Oct 2026",
    followUp: "Overdue 2 days",
  },
  {
    id: "f-4",
    member: "Riya Kapoor",
    memberSubtitle: "Member record - sample",
    book: "A Fine Balance",
    dueDate: "21 Oct 2026",
    followUp: "Due tomorrow",
  },
];

interface ActiveLoanRecord {
  id: string;
  memberNo: string;
  memberName: string;
  accessionNo: string;
  bookTitle: string;
  issuedAt: string;
  dueDate: string;
  renewals: number;
  status: "ACTIVE" | "OVERDUE";
}

const initialActiveLoans: ActiveLoanRecord[] = [
  {
    id: "l-1",
    memberNo: "MBR-2023-0984",
    memberName: "Rahul Verma",
    accessionNo: "ACC-2024-0043",
    bookTitle: "The Discovery of India",
    issuedAt: "07 Oct 2026",
    dueDate: "21 Oct 2026",
    renewals: 0,
    status: "ACTIVE",
  },
  {
    id: "l-2",
    memberNo: "MBR-2024-0185",
    memberName: "Aranya Sharma",
    accessionNo: "ACC-2024-0913",
    bookTitle: "A Brief History of Time",
    issuedAt: "10 Oct 2026",
    dueDate: "24 Oct 2026",
    renewals: 1,
    status: "ACTIVE",
  },
  {
    id: "l-3",
    memberNo: "MBR-2022-0455",
    memberName: "Kabir Singh",
    accessionNo: "ACC-2022-0051",
    bookTitle: "India After Gandhi",
    issuedAt: "01 Oct 2026",
    dueDate: "19 Oct 2026",
    renewals: 0,
    status: "OVERDUE",
  },
];

export default function StaffCirculationPage() {
  const [activeTab, setActiveTab] = useState<"followups" | "issue" | "return" | "active">("followups");
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(initialFollowUps);
  const [activeLoans, setActiveLoans] = useState<ActiveLoanRecord[]>(initialActiveLoans);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  // Issue Form State
  const [issueMember, setIssueMember] = useState("");
  const [issueBookAcc, setIssueBookAcc] = useState("");
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);

  // Return Form State
  const [returnAcc, setReturnAcc] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  // Scan simulation state
  const [scanCode, setScanCode] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemind = (id: string, member: string) => {
    setFollowUps((prev) =>
      prev.map((item) => (item.id === id ? { ...item, reminded: true } : item))
    );
    showToast(`Reminder notice dispatched to ${member} via SMS & Email.`);
  };

  const handleRenewLoan = (id: string) => {
    setActiveLoans((prev) =>
      prev.map((loan) =>
        loan.id === id
          ? {
              ...loan,
              dueDate: "04 Nov 2026",
              renewals: loan.renewals + 1,
              status: "ACTIVE",
            }
          : loan
      )
    );
    showToast("Loan successfully renewed for 14 additional days.");
  };

  const handleExportRegister = () => {
    const headers = ["Member", "Book", "Due Date", "Follow-up Status"];
    const rows = followUps.map((f) => [
      `"${f.member}"`,
      `"${f.book}"`,
      f.dueDate,
      f.followUp,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Janata_Library_Due_Register_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Due register exported as CSV.");
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingIssue(true);
    setTimeout(() => {
      const newLoan: ActiveLoanRecord = {
        id: `l-${Date.now()}`,
        memberNo: issueMember.trim().toUpperCase(),
        memberName: "Enrolled Member",
        accessionNo: issueBookAcc.trim().toUpperCase(),
        bookTitle: "Issued Book Title",
        issuedAt: "21 Oct 2026",
        dueDate: "04 Nov 2026",
        renewals: 0,
        status: "ACTIVE",
      };
      setActiveLoans([newLoan, ...activeLoans]);
      setIsSubmittingIssue(false);
      setIssueModalOpen(false);
      showToast(`Book ${issueBookAcc} issued successfully to ${issueMember}.`);
      setIssueMember("");
      setIssueBookAcc("");
    }, 600);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReturn(true);
    setTimeout(() => {
      setActiveLoans((prev) =>
        prev.filter((l) => l.accessionNo.toLowerCase() !== returnAcc.trim().toLowerCase())
      );
      setIsSubmittingReturn(false);
      setReturnModalOpen(false);
      showToast(`Accession ${returnAcc} checked in and returned to stacks.`);
      setReturnAcc("");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-800 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-teal-500 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Circulation Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage issues, returns, renewals, and reservation follow-ups.
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setScanModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <Scan className="w-3.5 h-3.5 text-slate-500" />
            <span>Scan a book</span>
          </button>

          <button
            onClick={() => setIssueModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Issue a book</span>
          </button>
        </div>
      </div>

      {/* Circulation Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab("followups")}
          className={`py-2 px-3.5 border-b-2 font-semibold transition whitespace-nowrap ${
            activeTab === "followups"
              ? "border-teal-600 text-teal-800 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Due Dates & Follow-ups (Action Required)
        </button>
        <button
          onClick={() => setActiveTab("issue")}
          className={`py-2 px-3.5 border-b-2 font-semibold transition whitespace-nowrap ${
            activeTab === "issue"
              ? "border-teal-600 text-teal-800 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Fast Issue Desk
        </button>
        <button
          onClick={() => setActiveTab("return")}
          className={`py-2 px-3.5 border-b-2 font-semibold transition whitespace-nowrap ${
            activeTab === "return"
              ? "border-teal-600 text-teal-800 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Fast Return Desk
        </button>
        <button
          onClick={() => setActiveTab("active")}
          className={`py-2 px-3.5 border-b-2 font-semibold transition whitespace-nowrap ${
            activeTab === "active"
              ? "border-teal-600 text-teal-800 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Active Loans Directory ({activeLoans.length})
        </button>
      </div>

      {/* TAB 1: Due Dates & Follow-ups (From Photo 4) */}
      {activeTab === "followups" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-rose-600">
                Action Required
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
                Due dates & follow-ups
              </h3>
            </div>
            <button
              onClick={handleExportRegister}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium self-start sm:self-auto transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export register</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Member</th>
                  <th className="py-3 px-5">Book</th>
                  <th className="py-3 px-5">Due Date</th>
                  <th className="py-3 px-5">Follow-up</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {followUps.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {item.member}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.memberSubtitle}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 font-medium text-slate-800">
                      {item.book}
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-600 text-[11px]">
                      {item.dueDate}
                    </td>

                    <td className="py-3.5 px-5">
                      {item.followUp === "Due today" ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          Due today
                        </span>
                      ) : item.followUp === "Overdue 2 days" ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                          Overdue 2 days
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
                          Due tomorrow
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleRemind(item.id, item.member)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition ${
                          item.reminded
                            ? "bg-teal-50 text-teal-800 border-teal-300"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {item.reminded ? "Reminded ✓" : "Remind"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-3 px-5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
            Reminder and issue records require staff access controls.
          </div>
        </div>
      )}

      {/* TAB 2: Fast Issue Desk (Original Feature) */}
      {activeTab === "issue" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs max-w-2xl space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Fast Book Checkout Desk</h3>
            <p className="text-xs text-slate-500">Scan or input citizen ID & copy barcode</p>
          </div>

          <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Citizen Member Number or Phone *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MBR-2023-0984 or 9871154321"
                value={issueMember}
                onChange={(e) => setIssueMember(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-teal-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Book Copy Accession Token *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ACC-2024-0043"
                value={issueBookAcc}
                onChange={(e) => setIssueBookAcc(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-teal-600"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-900 space-y-1">
              <p className="font-semibold">Standard Circulation Policy Verified:</p>
              <p>• 14 calendar days checkout duration (Due date: 04 Nov 2026).</p>
              <p>• Grace period: 2 days. Subsequent overdue fine: ₹2 per day.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmittingIssue}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-xs transition"
              >
                {isSubmittingIssue ? "Issuing..." : "Complete Checkout & Print Slip"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Fast Return Desk (Original Feature) */}
      {activeTab === "return" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs max-w-2xl space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900">Book Return & Inward Check-in</h3>
            <p className="text-xs text-slate-500">Scan accession barcode or enter copy number</p>
          </div>

          <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Accession Number / Barcode *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ACC-2024-0043"
                value={returnAcc}
                onChange={(e) => setReturnAcc(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-teal-600"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Check-in Process:</p>
              <p>• Automatically checks overdue status and assesses fine if applicable.</p>
              <p>• Automatically updates copy status back to "Available" in the stacks.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmittingReturn}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-medium shadow-xs transition"
              >
                {isSubmittingReturn ? "Checking in..." : "Check-in Book to Stacks"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Active Loans Directory (Original Feature) */}
      {activeTab === "active" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                All Active Loans Across Library
              </h3>
              <p className="text-xs text-slate-500">Live circulation records</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Member</th>
                  <th className="py-3 px-5">Book Title</th>
                  <th className="py-3 px-5">Accession</th>
                  <th className="py-3 px-5">Issued On</th>
                  <th className="py-3 px-5">Due Date</th>
                  <th className="py-3 px-5">Renewals</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900">{loan.memberName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{loan.memberNo}</div>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-800">{loan.bookTitle}</td>
                    <td className="py-3.5 px-5 font-mono text-slate-600">{loan.accessionNo}</td>
                    <td className="py-3.5 px-5 text-slate-600">{loan.issuedAt}</td>
                    <td className="py-3.5 px-5 font-mono font-medium">
                      <span className={loan.status === "OVERDUE" ? "text-rose-600" : "text-slate-800"}>
                        {loan.dueDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{loan.renewals} / 2</td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleRenewLoan(loan.id)}
                        disabled={loan.renewals >= 2}
                        className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium disabled:opacity-40"
                      >
                        Renew
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Bottom Quick Action Cards (Matching Photo 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Process a return */}
        <button
          onClick={() => {
            setActiveTab("return");
            setReturnModalOpen(true);
          }}
          className="bg-white border border-slate-200/90 hover:border-teal-600 p-5 rounded-2xl shadow-xs text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60 group-hover:bg-teal-700 group-hover:text-white transition">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Process a return</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Scan or enter an accession number
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition" />
        </button>

        {/* Card 2: Reservation queue */}
        <button
          onClick={() => setReservationModalOpen(true)}
          className="bg-white border border-slate-200/90 hover:border-amber-600 p-5 rounded-2xl shadow-xs text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60 group-hover:bg-amber-700 group-hover:text-white transition">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Reservation queue</p>
              <p className="text-xs text-slate-500 mt-0.5">27 titles awaiting pickup</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* SCAN MODAL */}
      {scanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-serif font-bold text-slate-900 text-sm">
                Scan Accession / Barcode
              </span>
              <button onClick={() => setScanModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="border-2 border-dashed border-teal-600/60 rounded-2xl p-8 bg-teal-50/40 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center animate-pulse">
                <Scan className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600">
                Hold barcode label or QR token up to optical scanner
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-slate-600 font-medium">Or type Accession code:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ACC-2024-0043"
                  value={scanCode}
                  onChange={(e) => setScanCode(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                />
                <button
                  onClick={() => {
                    showToast(`Found book record for ${scanCode || "ACC-2024-0043"}.`);
                    setScanModalOpen(false);
                  }}
                  className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-medium"
                >
                  Lookup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE MODAL */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-serif font-bold text-slate-900 text-sm">
                Issue Book to Member
              </span>
              <button onClick={() => setIssueModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Member Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="MBR-2024-0185"
                  value={issueMember}
                  onChange={(e) => setIssueMember(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Accession Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="ACC-2024-0043"
                  value={issueBookAcc}
                  onChange={(e) => setIssueBookAcc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                Loan duration: 14 days · Due date will be 04 Nov 2026.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingIssue}
                  className="px-4 py-2 rounded-xl bg-teal-700 text-white font-medium hover:bg-teal-800"
                >
                  {isSubmittingIssue ? "Issuing..." : "Complete Issue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RETURN MODAL */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-serif font-bold text-slate-900 text-sm">
                Process Book Return
              </span>
              <button onClick={() => setReturnModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Accession Number or Scan Barcode
                </label>
                <input
                  type="text"
                  required
                  placeholder="ACC-2023-0318"
                  value={returnAcc}
                  onChange={(e) => setReturnAcc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReturn}
                  className="px-4 py-2 rounded-xl bg-teal-700 text-white font-medium hover:bg-teal-800"
                >
                  {isSubmittingReturn ? "Processing..." : "Process Check-in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESERVATION QUEUE MODAL */}
      {reservationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-sm">
                  Active Reservation Queue
                </h4>
                <p className="text-xs text-slate-500">27 patrons waiting for copy returns</p>
              </div>
              <button onClick={() => setReservationModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
              {[
                { member: "Priya Sharma", title: "India After Gandhi", wait: "Position #1" },
                { member: "Amit Sengupta", title: "Wings of Fire", wait: "Position #1" },
                { member: "Neha Patel", title: "The Discovery of India", wait: "Position #2" },
              ].map((res, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{res.title}</p>
                    <p className="text-[11px] text-slate-500">Reserved by {res.member}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 text-amber-800">
                    {res.wait}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setReservationModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
