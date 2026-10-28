"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IndianRupee,
  Plus,
  Download,
  ArrowRight,
  TrendingUp,
  Receipt as ReceiptIcon,
  Printer,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

interface PaymentReceipt {
  id: string;
  receiptNo: string;
  member: string;
  description: string;
  method: "Cash" | "Manual" | "UPI" | "Card";
  amount: number;
  status: "Sample" | "Paid" | "Reversed";
  date?: string;
  reversalReason?: string;
}

const initialReceipts: PaymentReceipt[] = [
  {
    id: "rcp-1",
    receiptNo: "RCP-2026-1084",
    member: "Ananya Sharma",
    description: "Overdue fine",
    method: "Cash",
    amount: 40,
    status: "Sample",
    date: "21 Oct 2026, 11:20 AM",
  },
  {
    id: "rcp-2",
    receiptNo: "RCP-2026-1083",
    member: "Sana Qureshi",
    description: "Membership renewal",
    method: "Cash",
    amount: 100,
    status: "Sample",
    date: "21 Oct 2026, 10:45 AM",
  },
  {
    id: "rcp-3",
    receiptNo: "RCP-2026-1082",
    member: "Rahul Verma",
    description: "Lost book recovery",
    method: "Manual",
    amount: 250,
    status: "Sample",
    date: "21 Oct 2026, 09:15 AM",
  },
  {
    id: "rcp-4",
    receiptNo: "RCP-2026-1081",
    member: "Kabir Singh",
    description: "Annual subscription",
    method: "Cash",
    amount: 150,
    status: "Sample",
    date: "20 Oct 2026, 04:30 PM",
  },
];

export default function StaffFinancePage() {
  const [activeTab, setActiveTab] = useState<"register" | "reversal">("register");
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(initialReceipts);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedReceiptPrint, setSelectedReceiptPrint] = useState<PaymentReceipt | null>(null);

  // Record Payment Form State
  const [payMember, setPayMember] = useState("");
  const [payAmount, setPayAmount] = useState("50");
  const [payDesc, setPayDesc] = useState("Overdue fine");
  const [payMethod, setPayMethod] = useState<"Cash" | "UPI" | "Card" | "Manual">("Cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reversal Form State (Original Feature)
  const [reversalRcpNo, setReversalRcpNo] = useState("");
  const [reversalReason, setReversalReason] = useState("");
  const [isSubmittingReversal, setIsSubmittingReversal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedRcp = `RCP-2026-${Math.floor(1085 + receipts.length)}`;
    const newReceipt: PaymentReceipt = {
      id: `rcp-${Date.now()}`,
      receiptNo: generatedRcp,
      member: payMember.trim(),
      description: payDesc,
      method: payMethod,
      amount: Number(payAmount),
      status: "Paid",
      date: "Just now",
    };

    setReceipts([newReceipt, ...receipts]);
    setIsSubmitting(false);
    setPaymentModalOpen(false);
    setPayMember("");
    showToast(`Payment of ₹${payAmount} recorded. Generated receipt ${generatedRcp}.`);
  };

  const handleReversalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReversal(true);
    setTimeout(() => {
      setReceipts((prev) =>
        prev.map((r) =>
          r.receiptNo.toLowerCase() === reversalRcpNo.trim().toLowerCase()
            ? { ...r, status: "Reversed", reversalReason }
            : r
        )
      );
      setIsSubmittingReversal(false);
      setReversalRcpNo("");
      setReversalReason("");
      showToast("Payment reversed and marked in audit ledger.");
      setActiveTab("register");
    }, 600);
  };

  const handleExportCSV = () => {
    const headers = ["Receipt No", "Member", "Description", "Method", "Amount", "Status"];
    const rows = receipts.map((r) => [
      r.receiptNo,
      `"${r.member}"`,
      `"${r.description}"`,
      r.method,
      `₹ ${r.amount}`,
      r.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Janata_Library_Payment_Register_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Finance payment register exported successfully.");
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
            Finance & Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cash desk collection, overdue fines, digital receipts, and reversal audit trail.
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setPaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Record payment</span>
          </button>
        </div>
      </div>

      {/* Finance Sub-tabs (Payment Register & Reversal Workflow) */}
      <div className="flex border-b border-slate-200 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab("register")}
          className={`py-2 px-3.5 border-b-2 font-semibold transition ${
            activeTab === "register"
              ? "border-teal-600 text-teal-800 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Payment Register ({receipts.length})
        </button>
        <button
          onClick={() => setActiveTab("reversal")}
          className={`py-2 px-3.5 border-b-2 font-semibold transition ${
            activeTab === "reversal"
              ? "border-teal-600 text-teal-800 bg-teal-50/50 rounded-t-lg"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Payment Reversal Desk (Audited)
        </button>
      </div>

      {/* TAB 1: Payment Register (Matching Photo 5) */}
      {activeTab === "register" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
                Recent Receipts
              </p>
              <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
                Payment register
              </h3>
            </div>
            <button
              onClick={() => showToast("Displaying all 18 receipts for current billing cycle.")}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-700 font-medium transition"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Receipt No.</th>
                  <th className="py-3 px-5">Member</th>
                  <th className="py-3 px-5">Description</th>
                  <th className="py-3 px-5">Method</th>
                  <th className="py-3 px-5">Amount</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((rcp) => (
                  <tr key={rcp.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-3.5 px-5 font-mono text-slate-600 text-[11px]">
                      {rcp.receiptNo}
                    </td>

                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {rcp.member}
                    </td>

                    <td className="py-3.5 px-5 text-slate-600">
                      {rcp.description}
                    </td>

                    <td className="py-3.5 px-5 text-slate-700">
                      {rcp.method}
                    </td>

                    <td className="py-3.5 px-5 font-mono font-semibold text-slate-900">
                      ₹ {rcp.amount}
                    </td>

                    <td className="py-3.5 px-5">
                      {rcp.status === "Reversed" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                          <span>Reversed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{rcp.status}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedReceiptPrint(rcp)}
                        className="text-slate-400 hover:text-teal-700 p-1"
                        title="View / Print Receipt"
                      >
                        <ReceiptIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="py-3 px-5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
            Payments and receipts cannot be posted, reversed or printed in this preview.
          </div>
        </div>
      )}

      {/* TAB 2: Payment Reversal Desk (Original Feature) */}
      {activeTab === "reversal" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs max-w-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Payment Reversal & Audit Desk
              </h3>
              <p className="text-xs text-slate-500">
                Supervisory override to void an erroneously posted receipt
              </p>
            </div>
          </div>

          <form onSubmit={handleReversalSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Receipt Number to Reverse *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RCP-2026-1084"
                value={reversalRcpNo}
                onChange={(e) => setReversalRcpNo(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-teal-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Reason for Reversal / Correction *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Duplicate cash entry recorded by trainee operator"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-teal-600"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
              <p className="font-semibold">Statutory Governance Audit Notice:</p>
              <p>• Reversals generate a permanent audit log entry tagged with your Staff User ID.</p>
              <p>• Associated fine charges will be reopened or cleared based on resolution.</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmittingReversal}
                className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-medium shadow-xs transition"
              >
                {isSubmittingReversal ? "Processing..." : "Authorize Void & Reversal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-serif font-bold text-slate-900 text-sm">
                Record Payment & Issue Receipt
              </span>
              <button onClick={() => setPaymentModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Member Name or Card No. *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma or MBR-2023-0984"
                  value={payMember}
                  onChange={(e) => setPayMember(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600 bg-white"
                  >
                    <option value="Cash">Cash Desk</option>
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Manual">Manual Book Voucher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Receipt Type</label>
                <select
                  value={payDesc}
                  onChange={(e) => setPayDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-teal-600 bg-white"
                >
                  <option>Overdue fine</option>
                  <option>Membership renewal</option>
                  <option>Lost book recovery</option>
                  <option>Duplicate card fee</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-teal-700 text-white font-medium hover:bg-teal-800"
                >
                  {isSubmitting ? "Generating..." : "Generate Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT PRINT MODAL */}
      {selectedReceiptPrint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Official Money Receipt
              </span>
              <button onClick={() => setSelectedReceiptPrint(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-2">
              <div className="text-center pb-2 border-b border-slate-200">
                <h4 className="font-serif font-bold text-slate-900 text-sm">Janata Library</h4>
                <p className="text-[10px] text-slate-500">Public Library System · Cash Desk</p>
                <p className="text-xs font-bold text-teal-800 mt-1">{selectedReceiptPrint.receiptNo}</p>
              </div>

              <div className="space-y-1 pt-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-semibold text-slate-800">{selectedReceiptPrint.date || "21 Oct 2026"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Received from:</span>
                  <span className="font-semibold text-slate-800">{selectedReceiptPrint.member}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">For:</span>
                  <span className="text-slate-800">{selectedReceiptPrint.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment mode:</span>
                  <span className="text-slate-800">{selectedReceiptPrint.method}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-sm">Total Paid:</span>
                <span className="font-bold text-teal-900 text-base">₹ {selectedReceiptPrint.amount}.00</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setSelectedReceiptPrint(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-700 text-white hover:bg-teal-800 text-xs font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
