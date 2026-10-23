"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  TrendingUp,
  PieChart,
  BookOpen,
  Users,
  IndianRupee,
  CheckCircle2,
  Printer,
} from "lucide-react";

export default function StaffReportsPage() {
  const [reportType, setReportType] = useState("circulation");
  const [dateRange, setDateRange] = useState("October 2026");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-800 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-teal-500 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-teal-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-widest uppercase font-semibold text-teal-700">
            Analytics & Auditing
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
            Reports & Insights
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate monthly circulation, collection usage, and audit reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              window.print();
              showToast("Printing official monthly report.");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => showToast("Exporting comprehensive audit dataset as CSV.")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="text-3xl font-serif font-bold text-slate-900">4,812</div>
          <div className="text-xs text-slate-500 mt-1">Total checkouts this month</div>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="text-3xl font-serif font-bold text-teal-700">96.8%</div>
          <div className="text-xs text-slate-500 mt-1">On-time return rate</div>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="text-3xl font-serif font-bold text-slate-900">₹ 18,620</div>
          <div className="text-xs text-slate-500 mt-1">Revenue collected</div>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="text-3xl font-serif font-bold text-blue-700">142</div>
          <div className="text-xs text-slate-500 mt-1">New member enrolments</div>
        </div>
      </div>

      {/* Report Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Borrowed Categories */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900">
            Circulation by Category (October 2026)
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { name: "History & Geography (900s)", pct: 36, count: 1732 },
              { name: "Pure & Applied Sciences (500s/600s)", pct: 24, count: 1154 },
              { name: "Literature & Fiction (800s)", pct: 21, count: 1010 },
              { name: "Social Sciences (300s)", pct: 12, count: 577 },
              { name: "Philosophy & Psychology (100s)", pct: 7, count: 339 },
            ].map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>{cat.name}</span>
                  <span className="font-mono">{cat.count} loans ({cat.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${cat.pct}%` }}
                    className="h-full bg-teal-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Circulation Books */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900">
            Top Borrowed Titles
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { title: "The Discovery of India", author: "Jawaharlal Nehru", loans: 94 },
              { title: "Wings of Fire", author: "A. P. J. Abdul Kalam", loans: 88 },
              { title: "India After Gandhi", author: "Ramachandra Guha", loans: 72 },
              { title: "A Brief History of Time", author: "Stephen Hawking", loans: 65 },
              { title: "The God of Small Things", author: "Arundhati Roy", loans: 59 },
            ].map((b, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{b.title}</p>
                  <p className="text-[11px] text-slate-400">{b.author}</p>
                </div>
                <span className="font-mono font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                  {b.loans} loans
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
