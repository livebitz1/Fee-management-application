"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-gray-200 bg-white fixed top-0 right-0 left-0 md:left-64 z-20">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>



      <div className="flex items-center gap-4">
      </div>
    </div>
  );
}
