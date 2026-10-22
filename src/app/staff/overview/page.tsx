"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Clock,
  IndianRupee,
  Plus,
  ChevronDown,
  ArrowRight,
  RotateCcw,
  BookMarked,
  UserPlus,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import { useStaff } from "@/context/StaffContext";

export default function StaffOverviewPage() {
  const { setTransactionModalOpen } = useStaff();
  const [timeFilter, setTimeFilter] = useState("Today");
  const [activityFilter, setActivityFilter] = useState("Today");
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // SVG Chart data points for Library Activity
  const chartPoints = [
    { time: "08 AM", issues: 18, returns: 12 },
    { time: "10 AM", issues: 42, returns: 28 },
    { time: "12 PM", issues: 32, returns: 40 },
    { time: "02 PM", issues: 58, returns: 38 },
    { time: "04 PM", issues: 45, returns: 32 },
    { time: "06 PM", issues: 24, returns: 16 },
  ];

  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 25;
  const maxVal = 70;

  const getX = (index: number) =>
    paddingX + (index * (svgWidth - 2 * paddingX)) / (chartPoints.length - 1);
  const getY = (val: number) =>
    svgHeight - paddingY - (val * (svgHeight - 2 * paddingY)) / maxVal;

  const issuesPath = chartPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.issues)}`)
    .join(" ");

  const returnsPath = chartPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.returns)}`)
    .join(" ");

  const recentActivities = [
    {
      id: "act-1",
      type: "return",
      title: "Book returned",
      subtitle: "The White Tiger - MBR-2023-3904",
      time: "09:42 AM",
      icon: RotateCcw,
      iconColor: "text-teal-700 bg-teal-50 border-teal-200",
    },
    {
      id: "act-2",
      type: "issue",
      title: "Book issued",
      subtitle: "Wings of Fire - MBR-2024-0188",
      time: "09:12 AM",
      icon: BookOpen,
      iconColor: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      id: "act-3",
      type: "member",
      title: "New member registered",
      subtitle: "Priya Vance - MBR-2026-3142",
      time: "08:58 AM",
      icon: UserPlus,
      iconColor: "text-amber-700 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-widest uppercase font-semibold text-teal-700">
            Wednesday, 21 October 2026
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
            Good morning, Administrator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Here's what's happening across your library today.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium pl-3 pr-8 py-2 rounded-xl shadow-xs focus:outline-teal-600 cursor-pointer"
            >
              <option>Today</option>
              <option>This week</option>
              <option>This month</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => setTransactionModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New transaction</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards (Matching Image 2 in Slate & Teal theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Catalogue titles */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>Catalogue titles</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif font-bold text-slate-900">8,426</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-teal-700 font-semibold">↗ +174</span>
              <span>this month</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active members */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span>Active members</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif font-bold text-slate-900">3,218</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-teal-700 font-semibold">↗ +38</span>
              <span>this month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Books on loan */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span>Books on loan</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif font-bold text-slate-900">1,084</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-amber-700 font-semibold">🕒 32</span>
              <span>due this week</span>
            </div>
          </div>
        </div>

        {/* Card 4: Collections today */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <span>Collections today</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-serif font-bold text-slate-900">₹ 2,840</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-semibold">₹ 18 receipts</span>
              <span>issued</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle 2 Panels (Library Activity & Copy Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: AT A GLANCE / Library activity (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-teal-700">
                  At a glance
                </p>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
                  Library activity
                </h3>
              </div>
              <div className="relative">
                <select
                  value={activityFilter}
                  onChange={(e) => setActivityFilter(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium pl-2.5 pr-7 py-1 rounded-lg shadow-2xs focus:outline-teal-600 cursor-pointer"
                >
                  <option>Today</option>
                  <option>This week</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-serif text-slate-900">
                146 <span className="text-xs font-sans font-normal text-slate-500">transactions</span>
              </span>
              <span className="text-xs text-teal-700 font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> 12.8% vs previous period
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="mt-6 w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-44 text-slate-300 overflow-visible"
            >
              {[15, 35, 55].map((val) => (
                <line
                  key={val}
                  x1={paddingX}
                  y1={getY(val)}
                  x2={svgWidth - paddingX}
                  y2={getY(val)}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ))}

              <line
                x1={paddingX}
                y1={getY(0)}
                x2={svgWidth - paddingX}
                y2={getY(0)}
                stroke="#cbd5e1"
                strokeWidth="1"
              />

              {/* Returns line (blue/dashed) */}
              <path
                d={returnsPath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="transition-all"
              />

              {/* Issues line (teal/solid) */}
              <path
                d={issuesPath}
                fill="none"
                stroke="#0d9488"
                strokeWidth="2.5"
                className="transition-all"
              />

              {chartPoints.map((p, i) => (
                <g key={p.time}>
                  <circle
                    cx={getX(i)}
                    cy={getY(p.issues)}
                    r={hoveredPoint === i ? "6" : "4"}
                    fill="#0d9488"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx={getX(i)}
                    cy={getY(p.returns)}
                    r={hoveredPoint === i ? "5" : "3.5"}
                    fill="#3b82f6"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text
                    x={getX(i)}
                    y={svgHeight - 6}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    fontFamily="sans-serif"
                  >
                    {p.time}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Chart Legend & Caption */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <span className="text-[11px] font-medium text-slate-700">Issues</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[11px] font-medium text-slate-700">Returns</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400">Weekly trend - October 2026</span>
          </div>
        </div>

        {/* Right Panel: YOUR COLLECTION / Copy status */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-teal-700">
                  Your collection
                </p>
                <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
                  Copy status
                </h3>
              </div>
              <Link
                href="/staff/catalogue"
                className="text-slate-400 hover:text-slate-800 transition"
                title="Open catalogue"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-4">
              <span className="text-2xl font-bold font-serif text-slate-900">
                12,680 <span className="text-xs font-sans font-normal text-slate-500">physical copies</span>
              </span>
            </div>

            {/* Segmented Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden mt-5 shadow-inner">
              <div
                style={{ width: "58%" }}
                className="bg-teal-600 hover:opacity-90 transition"
                title="Available: 7,354 copies"
              />
              <div
                style={{ width: "31%" }}
                className="bg-blue-600 hover:opacity-90 transition"
                title="Issued: 3,934 copies"
              />
              <div
                style={{ width: "6%" }}
                className="bg-amber-500 hover:opacity-90 transition"
                title="Reserved: 750 copies"
              />
              <div
                style={{ width: "5%" }}
                className="bg-slate-400 hover:opacity-90 transition"
                title="Other: 642 copies"
              />
            </div>

            {/* Breakdown Legend List */}
            <div className="mt-6 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  <span className="text-slate-700 font-medium">Available</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono">7,354</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-slate-700 font-medium">Issued</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono">3,934</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-700 font-medium">Reserved</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono">750</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-slate-700 font-medium">Other</span>
                </div>
                <span className="font-semibold text-slate-900 font-mono">642</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6">
            <Link
              href="/staff/catalogue"
              className="w-full flex items-center justify-between text-xs font-medium text-slate-700 hover:text-teal-700 py-1 transition group"
            >
              <span>Open catalogue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition text-slate-400 group-hover:text-teal-700" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: DAILY OPERATIONS / Recent activity */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] tracking-widest uppercase font-semibold text-teal-700">
              Daily operations
            </p>
            <h3 className="font-serif text-lg font-bold text-slate-900 mt-0.5">
              Recent activity
            </h3>
          </div>
          <Link
            href="/staff/circulation"
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-teal-700 font-medium transition"
          >
            <span>View circulation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Activity Rows */}
        <div className="divide-y divide-slate-100">
          {recentActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 rounded-xl px-2 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${act.iconColor}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                      {act.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">{act.time}</span>
                  <button className="text-slate-400 hover:text-slate-700 p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
