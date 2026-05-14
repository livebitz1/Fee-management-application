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

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 rounded-lg border-gray-200 bg-gray-50 text-sm"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Bell className="w-5 h-5" />
        </Button>

        <div className="h-8 border-l border-gray-200"></div>

        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
