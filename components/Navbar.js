"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, LayoutDashboard, PlusCircle, BarChart2, TrendingUp, Target, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: BookOpen },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-entry", label: "Add Entry", icon: PlusCircle },
  { href: "/progress-page", label: "Progress", icon: BarChart2 },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/goals", label: "Goals", icon: Target },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-cyan-500/10 bg-[#030714]/95 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-cyan-300 font-bold text-lg sm:text-xl">
          <BookOpen size={22} />
          <span>LearnTracker</span>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="sm:hidden inline-flex items-center justify-center rounded-2xl border border-cyan-500/20 bg-slate-950/70 px-3 py-2 text-cyan-200 hover:border-cyan-300/30 hover:text-cyan-100 transition"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div
          className={`w-full sm:w-auto flex-col sm:flex-row sm:flex items-start sm:items-center gap-2 ${
            isOpen ? "flex" : "hidden sm:flex"
          }`}
        >
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex w-full sm:w-auto items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-cyan-500/15 text-cyan-200 border border-cyan-400/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/80"
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
