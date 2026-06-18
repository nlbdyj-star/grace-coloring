"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Video,
  Palette,
  Image,
  BookOpen,
  Users,
  Download,
  Search,
  Settings,
  Mail,
  FolderTree,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Content",
    icon: BookOpen,
    children: [
      { label: "Videos", href: "/admin/videos", icon: Video },
      { label: "Coloring Pages", href: "/admin/coloring-pages", icon: Palette },
      { label: "Wallpapers", href: "/admin/wallpapers", icon: Image },
      { label: "Bible Stories", href: "/admin/bible-stories", icon: BookOpen },
    ],
  },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: Download },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { isSidebarOpen, toggleSidebar, user } = useAdmin();
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(["Content"]);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-[#E8E4DC]/50 z-50 flex flex-col",
          !isSidebarOpen && "items-center"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-4 border-b border-[#E8E4DC]/30">
          {isSidebarOpen ? (
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8">
                <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                  <path
                    d="M6 28V12L18 6L30 12V28L18 34L6 28Z"
                    stroke="#7A8A6E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M18 6V34" stroke="#7A8A6E" strokeWidth="1.5" />
                  <path d="M6 12L18 18L30 12" stroke="#7A8A6E" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-base font-medium text-[#222222]">Grace Admin</span>
            </Link>
          ) : (
            <div className="w-8 h-8">
              <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                <path
                  d="M6 28V12L18 6L30 12V28L18 34L6 28Z"
                  stroke="#7A8A6E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M18 6V34" stroke="#7A8A6E" strokeWidth="1.5" />
                <path d="M6 12L18 18L30 12" stroke="#7A8A6E" strokeWidth="1.5" />
              </svg>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              "ml-auto p-1.5 rounded-lg hover:bg-[#F5F2EC] text-[#666666] transition-colors",
              !isSidebarOpen && "ml-0 mt-2"
            )}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            if (item.children) {
              const isExpanded = expandedSections.includes(item.label);
              const hasActiveChild = item.children.some((c) => pathname === c.href);
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSection(item.label)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      hasActiveChild
                        ? "text-[#7A8A6E] bg-[#E8EDE5]/50"
                        : "text-[#666666] hover:bg-[#F5F2EC] hover:text-[#222222]"
                    )}
                  >
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    {isSidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </>
                    )}
                  </button>
                  <AnimatePresence>
                    {isExpanded && isSidebarOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-6 mt-0.5 space-y-0.5 border-l border-[#E8E4DC]/50 pl-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                                pathname === child.href
                                  ? "text-[#7A8A6E] bg-[#E8EDE5]/30 font-medium"
                                  : "text-[#888888] hover:text-[#222222] hover:bg-[#F5F2EC]/50"
                              )}
                            >
                              <child.icon className="w-[15px] h-[15px] shrink-0" />
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? "text-[#7A8A6E] bg-[#E8EDE5]/50"
                    : "text-[#666666] hover:bg-[#F5F2EC] hover:text-[#222222]"
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-[#E8E4DC]/30 p-3">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-[#7A8A6E] flex items-center justify-center text-white text-xs font-medium shrink-0">
              {user?.full_name?.charAt(0) || "A"}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#222222] truncate">{user?.full_name || "Admin"}</p>
                <p className="text-xs text-[#888888] capitalize">{user?.role}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button
                onClick={() => { window.location.href = "/admin/logout"; }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-[#888888] hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
