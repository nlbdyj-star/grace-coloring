"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Download, Heart, Eye, Calendar, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { Wallpaper } from "@/lib/supabase";

const mockWallpapers: Wallpaper[] = [
  {
    id: "1",
    title: "Sunset Cross",
    category_id: "1",
    image_original: "/images/wallpapers/sunset-cross.jpg",
    image_mobile: "/images/wallpapers/sunset-cross-mobile.jpg",
    image_desktop: "/images/wallpapers/sunset-cross-desktop.jpg",
    image_4k: "/images/wallpapers/sunset-cross-4k.jpg",
    image_8k: null,
    tags: ["cross", "sunset", "faith"],
    downloads_count: 4520,
    views_count: 12800,
    favorites_count: 1890,
    seo_title: "Sunset Cross Wallpaper",
    seo_description: "A beautiful cross at sunset wallpaper for your devices.",
    status: "published",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Mountain Prayer",
    category_id: "2",
    image_original: "/images/wallpapers/mountain-prayer.jpg",
    image_mobile: "/images/wallpapers/mountain-prayer-mobile.jpg",
    image_desktop: "/images/wallpapers/mountain-prayer-desktop.jpg",
    image_4k: "/images/wallpapers/mountain-prayer-4k.jpg",
    image_8k: null,
    tags: ["mountain", "prayer", "nature"],
    downloads_count: 3210,
    views_count: 9500,
    favorites_count: 1340,
    seo_title: "Mountain Prayer Wallpaper",
    seo_description: "Prayer hands against mountain backdrop wallpaper.",
    status: "published",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    title: "Bible Verse Typography",
    category_id: "3",
    image_original: "/images/wallpapers/bible-typography.jpg",
    image_mobile: "/images/wallpapers/bible-typography-mobile.jpg",
    image_desktop: "/images/wallpapers/bible-typography-desktop.jpg",
    image_4k: null,
    image_8k: null,
    tags: ["bible", "typography", "verse"],
    downloads_count: 2890,
    views_count: 8100,
    favorites_count: 1120,
    seo_title: "Bible Verse Typography Wallpaper",
    seo_description: "Inspirational Bible verse typography wallpaper.",
    status: "published",
    created_at: "2024-02-20T10:00:00Z",
    updated_at: "2024-02-20T10:00:00Z",
  },
  {
    id: "4",
    title: "Stained Glass Window",
    category_id: "1",
    image_original: "/images/wallpapers/stained-glass.jpg",
    image_mobile: "/images/wallpapers/stained-glass-mobile.jpg",
    image_desktop: "/images/wallpapers/stained-glass-desktop.jpg",
    image_4k: "/images/wallpapers/stained-glass-4k.jpg",
    image_8k: null,
    tags: ["stained glass", "church", "art"],
    downloads_count: 1560,
    views_count: 5200,
    favorites_count: 780,
    seo_title: "Stained Glass Window Wallpaper",
    seo_description: "Beautiful stained glass window wallpaper.",
    status: "draft",
    created_at: "2024-03-05T10:00:00Z",
    updated_at: "2024-03-05T10:00:00Z",
  },
  {
    id: "5",
    title: "Dove of Peace",
    category_id: "2",
    image_original: "/images/wallpapers/dove-peace.jpg",
    image_mobile: "/images/wallpapers/dove-peace-mobile.jpg",
    image_desktop: "/images/wallpapers/dove-peace-desktop.jpg",
    image_4k: null,
    image_8k: null,
    tags: ["dove", "peace", "holy spirit"],
    downloads_count: 2100,
    views_count: 6700,
    favorites_count: 950,
    seo_title: "Dove of Peace Wallpaper",
    seo_description: "White dove symbolizing peace and the Holy Spirit.",
    status: "published",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
  },
];

const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-50 text-gray-600 border-gray-200",
};

const categoryMap: Record<string, string> = {
  "1": "Faith",
  "2": "Nature",
  "3": "Typography",
};

const columns: Column<Wallpaper>[] = [
  {
    key: "preview",
    header: "Preview",
    width: "80px",
    render: (wallpaper) => (
      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-[#F5F2EC]">
        <img
          src={wallpaper.image_original}
          alt={wallpaper.title}
          className="w-full h-full object-cover"
        />
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (wallpaper) => (
      <div>
        <p className="text-sm font-medium text-[#222222]">{wallpaper.title}</p>
        <p className="text-xs text-[#888888]">{wallpaper.tags.slice(0, 3).join(", ")}</p>
      </div>
    ),
  },
  {
    key: "category",
    header: "Category",
    width: "110px",
    render: (wallpaper) => (
      <span className="text-sm text-[#666666]">
        {categoryMap[wallpaper.category_id || ""] || "Uncategorized"}
      </span>
    ),
  },
  {
    key: "stats",
    header: "Stats",
    width: "180px",
    render: (wallpaper) => (
      <div className="flex items-center gap-3 text-xs text-[#666666]">
        <span className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          {wallpaper.downloads_count.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {wallpaper.views_count.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          {wallpaper.favorites_count.toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "110px",
    render: (wallpaper) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          statusColors[wallpaper.status]
        }`}
      >
        {wallpaper.status}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    width: "130px",
    sortable: true,
    render: (wallpaper) => (
      <div className="flex items-center gap-1 text-xs text-[#888888]">
        <Calendar className="w-3 h-3" />
        {new Date(wallpaper.created_at).toLocaleDateString()}
      </div>
    ),
  },
];

export default function WallpapersPage() {
  const [wallpapers] = useState<Wallpaper[]>(mockWallpapers);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-medium text-[#222222]">Wallpapers</h1>
          <p className="text-sm text-[#666666] mt-1">Manage your wallpaper collection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-[#E8E4DC] text-[#666666] hover:bg-[#F5F2EC] rounded-lg h-10 px-4 text-sm gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Batch Upload
          </Button>
          <Link href="/admin/wallpapers/new">
            <Button className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2">
              <Plus className="w-4 h-4" />
              Add Wallpaper
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: wallpapers.length },
          { label: "Published", value: wallpapers.filter((w) => w.status === "published").length },
          { label: "Drafts", value: wallpapers.filter((w) => w.status === "draft").length },
          { label: "Downloads", value: wallpapers.reduce((sum, w) => sum + w.downloads_count, 0).toLocaleString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-[#E8E4DC]/50 p-4"
          >
            <p className="text-lg font-semibold text-[#222222]">{stat.value}</p>
            <p className="text-xs text-[#888888]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={wallpapers}
        columns={columns}
        keyExtractor={(w) => w.id}
        searchPlaceholder="Search wallpapers..."
        filterOptions={[
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived" },
        ]}
        onEdit={(wallpaper) => console.log("Edit", wallpaper.id)}
        onDelete={(wallpaper) => console.log("Delete", wallpaper.id)}
      />
    </div>
  );
}
