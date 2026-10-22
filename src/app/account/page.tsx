"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  BookOpen,
  Bookmark,
  Calendar,
  Clock,
  Banknote,
  Receipt as ReceiptIcon,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function MemberAccountPage() {
  const router = useRouter();
  const [member, setMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMemberData = async () => {
    setLoading(true);
    try {
      const authRes = await fetch("/api/auth/me");
      const authData = await authRes.json();

      if (!authData.user || authData.user.role !== "MEMBER" || !authData.user.memberId) {
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/members/${authData.user.memberId}`);
      const data = await res.json();
      setMember(data.member);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-700 mx-auto" />
        <p className="text-sm text-slate-500">Loading citizen membership dashboard...</p>
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Digital Library Card Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#2dd4bf_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-700/60 border border-teal-500/30 text-[11px] text-teal-200 uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Official Digital Library Card</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              {member.fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-teal-100 font-mono">
              <span>Card No: <strong className="text-white">{member.memberNo}</strong></span>
              <span>Category: <strong className="text-white">{member.category}</strong></span>
              <span>Valid Thru: <strong className="text-white">{new Date(member.expiryDate).toLocaleDateString()}</strong></span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center space-y-2 shrink-0">
            <div className="text-[10px] uppercase font-bold text-teal-200">Borrowing Quota</div>
            <div className="font-serif text-3xl font-extrabold text-white">
              {member.activeLoansCount} / {member.maxBooks}
            </div>
            <div className="text-[10px] text-teal-200">Titles currently on loan</div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Loans</div>
            <div className="font-serif text-2xl font-bold text-slate-900">{member.activeLoansCount} Books</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-lg">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Active Holds</div>
            <div className="font-serif text-2xl font-bold text-slate-900">{member.reservations.length} Titles</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-700 rounded-lg">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Outstanding Dues</div>
            <div className="font-serif text-2xl font-bold text-slate-900">
              ₹{member.totalOutstandingDues.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Loans Section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <span>Currently Borrowed Books ({member.loans.length})</span>
          </h2>
          <Link
            href="/search"
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>Discover more titles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {member.loans.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <p>You have no books currently checked out.</p>
            <Link href="/search" className="inline-block text-teal-700 font-semibold underline">
              Browse the library catalogue
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {member.loans.map((loan: any) => {
              const dueDate = new Date(loan.dueDate);
              const isOverdue = new Date() > dueDate;

              return (
                <div key={loan.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-bold text-slate-900">
                      {loan.copy.book.title}
                    </h3>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 font-mono">
                      <span>Acc No: <strong>{loan.copy.accessionNo}</strong></span>
                      <span>Location: {loan.copy.shelfLocation}</span>
                      <span>Renewals: {loan.renewalCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs">
                      <span className="text-slate-400 block">Due Date</span>
                      <span className={`font-mono font-bold ${isOverdue ? "text-rose-600" : "text-slate-800"}`}>
                        {dueDate.toLocaleDateString()}
                      </span>
                    </div>
                    {isOverdue ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Overdue</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Active Holds / Reservations */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bookmark className="w-5 h-5 text-amber-600" />
          <span>Reservation Queue & Holds</span>
        </h2>

        {member.reservations.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No active reservations.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {member.reservations.map((res: any) => (
              <div key={res.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-slate-900">{res.book.title}</h4>
                  <p className="text-xs text-slate-500">Reserved on {new Date(res.reservedAt).toLocaleDateString()}</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                  <span>Queue Position: #{res.queuePosition}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Payments & Receipts Archive */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ReceiptIcon className="w-5 h-5 text-teal-700" />
          <span>Payment Receipts Archive</span>
        </h2>

        {member.receipts.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No payment receipts on record.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {member.receipts.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-teal-800">{r.receiptNo}</td>
                    <td className="py-2 px-3 text-slate-600">{new Date(r.issueDate).toLocaleDateString()}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">₹{r.totalAmount.toFixed(2)}</td>
                    <td className="py-2 px-3 text-emerald-700 font-sans font-semibold">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
