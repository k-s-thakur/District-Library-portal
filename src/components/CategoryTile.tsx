"use client";

import Link from "next/link";
import {
  BookOpen,
  Compass,
  Cpu,
  Landmark,
  Scale,
  Brain,
  Sparkles,
  Palette,
  FolderOpen,
} from "lucide-react";

interface CategoryTileProps {
  id: string;
  name: string;
  code: string;
  ddcPrefix?: string | null;
  description?: string | null;
  booksCount: number;
  iconName?: string | null;
  accentColor?: string | null;
}

const iconMap: Record<string, any> = {
  BookOpen,
  Compass,
  Cpu,
  Landmark,
  Scale,
  Brain,
  Sparkles,
  Palette,
};

const colorStyles: Record<string, { bg: string; border: string; icon: string; text: string }> = {
  teal: {
    bg: "bg-teal-50 hover:bg-teal-100/80",
    border: "border-teal-200/80",
    icon: "text-teal-700 bg-teal-100",
    text: "text-teal-950",
  },
  blue: {
    bg: "bg-sky-50 hover:bg-sky-100/80",
    border: "border-sky-200/80",
    icon: "text-sky-700 bg-sky-100",
    text: "text-sky-950",
  },
  indigo: {
    bg: "bg-indigo-50 hover:bg-indigo-100/80",
    border: "border-indigo-200/80",
    icon: "text-indigo-700 bg-indigo-100",
    text: "text-indigo-950",
  },
  amber: {
    bg: "bg-amber-50 hover:bg-amber-100/80",
    border: "border-amber-200/80",
    icon: "text-amber-700 bg-amber-100",
    text: "text-amber-950",
  },
  rose: {
    bg: "bg-rose-50 hover:bg-rose-100/80",
    border: "border-rose-200/80",
    icon: "text-rose-700 bg-rose-100",
    text: "text-rose-950",
  },
  purple: {
    bg: "bg-purple-50 hover:bg-purple-100/80",
    border: "border-purple-200/80",
    icon: "text-purple-700 bg-purple-100",
    text: "text-purple-950",
  },
  emerald: {
    bg: "bg-emerald-50 hover:bg-emerald-100/80",
    border: "border-emerald-200/80",
    icon: "text-emerald-700 bg-emerald-100",
    text: "text-emerald-950",
  },
};

export default function CategoryTile({
  name,
  code,
  ddcPrefix,
  booksCount,
  iconName,
  accentColor = "teal",
}: CategoryTileProps) {
  const IconComponent = (iconName && iconMap[iconName]) || FolderOpen;
  const style = colorStyles[accentColor || "teal"] || colorStyles.teal;

  return (
    <Link
      href={`/search?category=${encodeURIComponent(code)}`}
      className={`group relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${style.bg} ${style.border} hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-teal-600`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-lg ${style.icon} transition-transform group-hover:scale-110`}>
          <IconComponent className="w-5 h-5" />
        </div>
        {ddcPrefix && (
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/80 text-slate-600 border border-slate-200/60">
            DDC {ddcPrefix}
          </span>
        )}
      </div>

      <div className="mt-4">
        <h3 className={`font-serif text-base font-bold leading-tight ${style.text}`}>
          {name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {booksCount} {booksCount === 1 ? "holding" : "holdings"} catalogued
        </p>
      </div>
    </Link>
  );
}
