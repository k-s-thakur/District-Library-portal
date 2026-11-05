"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  Banknote,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  CreditCard
} from "lucide-react";
import { Member } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
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

      const memberRes = await fetch(`/api/members/${authData.user.memberId}`);
      const memberData = await memberRes.json();
      setMember(memberData.member);
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-teal-700 mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading member portal...</p>
      </div>
    );
  }

  if (!member) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Clean Digital Member Card */}
      <div className="bg-teal-800 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-teal-200 text-xs font-medium">
            <CreditCard className="w-4 h-4" />
            <span>Digital Library Card</span>
          </div>

          <h1 className="font-serif text-2xl font-bold">{member.fullName}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-teal-100 font-mono pt-1">
            <span>Card No: <strong className="text-white">{member.memberNo}</strong></span>
            <span>Category: <strong className="text-white">{member.category}</strong></span>
            <span>Valid Until: <strong className="text-white">{new Date(member.expiryDate).toLocaleDateString()}</strong></span>
          </div>
        </div>

        <div className="bg-teal-900/60 p-3.5 rounded-xl border border-teal-700/60 text-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-teal-200 block">Quota</span>
          <span className="font-serif text-2xl font-bold">{member.activeLoansCount} / {member.maxBooks}</span>
          <span className="text-[10px] text-teal-300 block">Books issued</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Active Loans</span>
            <span className="font-serif text-xl font-bold text-slate-900">{member.activeLoansCount} Books</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Active Holds</span>
            <span className="font-serif text-xl font-bold text-slate-900">{member.reservations.length} Titles</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Outstanding Dues</span>
            <span className="font-serif text-xl font-bold text-slate-900">₹{member.totalOutstandingDues.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Borrowed Books */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-700" />
            <span>Currently Borrowed Books ({member.loans.length})</span>
          </h2>
          <Link
            href="/search"
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>Browse catalogue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {member.loans.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            You have no books currently checked out.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {member.loans.map((loan) => {
              const dueDate = new Date(loan.dueDate);
              const isOverdue = new Date() > dueDate;

              return (
                <div
                  key={loan.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <h3 className="font-serif text-sm font-bold text-slate-900">
                      {loan.copy.book.title}
                    </h3>
                    <div className="text-slate-500 flex items-center gap-3 font-mono text-[11px]">
                      <span>Acc No: <strong>{loan.copy.accessionNo}</strong></span>
                      <span>Location: {loan.copy.shelfLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Due Date</span>
                      <span className={`font-mono font-bold ${isOverdue ? "text-rose-600" : "text-slate-800"}`}>
                        {dueDate.toLocaleDateString()}
                      </span>
                    </div>

                    {isOverdue ? (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-bold">
                        Overdue
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Holds */}
      {member.reservations.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-serif text-base font-bold text-slate-900">Active Holds</h2>
          <div className="divide-y divide-slate-100">
            {member.reservations.map((res: any) => (
              <div key={res.id} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{res.bookTitle}</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  Queue Position #{res.queuePosition}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
