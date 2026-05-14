"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  BarChart3,
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Students",
    href: "/students",
    icon: Users,
  },
  {
    name: "Collect Fee",
    href: "/collect-fee",
    icon: CreditCard,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: TrendingUp,
  },
  {
    name: "Receipts",
    href: "/receipts",
    icon: FileText,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
];

export function Sidebar({ isOpen = false, onClose = () => {} }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarClasses = isMobile
    ? cn(
        "fixed inset-0 z-40 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )
    : "hidden md:flex";

  const overlayClasses = isMobile && isOpen ? "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30" : "hidden";

  return (
    <>
      <div className={overlayClasses} onClick={onClose} />
      <div className={cn("flex flex-col w-72 border-r border-slate-100 bg-white h-screen fixed left-0 top-0 md:relative md:top-auto z-40", sidebarClasses)}>
      {/* Logo Section */}
      <div className="flex items-center justify-between gap-3 px-8 py-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-12 h-12 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">SmartFee</h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mt-1">Management Pro</p>
          </div>
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-4">
                <Icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-900"
                )} />
                <span className="tracking-tight">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile Placeholder */}
      <div className="px-6 py-8 border-t border-slate-50">
        <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black text-slate-900 truncate">Administrator</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Full Control</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-300 font-bold text-center mt-6 uppercase tracking-[0.2em]">
          Version 1.0.4
        </p>
      </div>
    </div>
    </>
  );
}
