"use client";

import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-context";
import Link from "next/link";

export function AdminHeader() {
  const { isSidebarOpen } = useAdmin();

  return (
    <header
      className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-[#E8E4DC]/50 flex items-center justify-between px-4 sm:px-6"
      style={{ marginLeft: isSidebarOpen ? 260 : 72 }}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search content, users..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-[#F5F2EC] border-none text-sm text-[#222222] placeholder:text-[#888888] focus:outline-none focus:ring-2 focus:ring-[#7A8A6E]/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* New Button - opens content form modal on current page */}
        <Button
          onClick={() => alert("Add new content via the 'Add' buttons on each page (Videos, Coloring Pages, etc.)")}
          className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-9 px-4 text-sm font-medium gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </Button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg hover:bg-[#F5F2EC] flex items-center justify-center text-[#666666] transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
