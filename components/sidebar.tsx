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
  Settings,
  X,
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
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
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
        "fixed inset-0 z-40 transition-transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )
    : "hidden md:flex";

  const overlayClasses = isMobile && isOpen ? "fixed inset-0 bg-black/50 z-30" : "hidden";

  return (
    <>
      <div className={overlayClasses} onClick={onClose} />
      <div className={cn("flex flex-col w-64 border-r border-gray-200 bg-white h-screen fixed left-0 top-0 md:relative md:top-auto", sidebarClasses)}>
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 px-6 py-8 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-black rounded-lg">
            <span className="text-lg font-bold text-white">FM</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-black">FeeManage</h1>
            <p className="text-xs text-gray-500">Management</p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-black"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2024 FeeManage. All rights reserved.
        </p>
      </div>
    </div>
    </>
  );
}
