"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, User, Lock, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please check credentials.");
      }

      if (data.user?.role === "MEMBER") {
        router.push("/account");
      } else {
        router.push("/staff/circulation");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: string) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Quick sign-in failed.");

      if (role === "MEMBER") {
        router.push("/account");
      } else {
        router.push("/staff/circulation");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center mx-auto shadow-md">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Sign In to GPLMS
          </h1>
          <p className="text-xs text-slate-500">
            Government Public Library · Citizen Member & Staff Access Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Email Address or Member No (GPL-XXXX)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. GPL-2026-00001 or email@domain.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Sign In</span>
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick Demo Access
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("MEMBER")}
                className="p-2 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-900 font-medium transition cursor-pointer"
              >
                Citizen (Rahul)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("LIBRARIAN")}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium transition cursor-pointer"
              >
                Librarian (Patel)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("ACCOUNTS_OPERATOR")}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium transition cursor-pointer"
              >
                Accounts Officer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("SUPER_ADMIN")}
                className="p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-medium transition cursor-pointer"
              >
                Super Admin
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-teal-700 transition">
            ← Return to Public Discovery Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
