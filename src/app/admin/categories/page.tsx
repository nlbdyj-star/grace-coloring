"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { Category } from "@/lib/supabase";

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Jesus & Miracles",
    slug: "jesus-miracles",
    description: "Stories and coloring pages about Jesus and His miracles",
    type: "all",
    sort_order: 1,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Old Testament",
    slug: "old-testament",
    description: "Stories from the Old Testament",
    type: "story",
    sort_order: 2,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "3",
    name: "New Testament",
    slug: "new-testament",
    description: "Stories from the New Testament",
    type: "story",
    sort_order: 3,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "4",
    name: "Animals & Nature",
    slug: "animals-nature",
    description: "Coloring pages featuring animals and nature scenes",
    type: "coloring",
    sort_order: 4,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "5",
    name: "Faith & Prayer",
    slug: "faith-prayer",
    description: "Wallpapers and content about faith and prayer",
    type: "wallpaper",
    sort_order: 5,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "6",
    name: "Bible Verses",
    slug: "bible-verses",
    description: "Typography and verse-based content",
    type: "wallpaper",
    sort_order: 6,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "7",
    name: "Parables",
    slug: "parables",
    description: "Jesus' parables and teachings",
    type: "video",
    sort_order: 7,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "8",
    name: "Heroes of Faith",
    slug: "heroes-of-faith",
    description: "Stories of biblical heroes",
    type: "all",
    sort_order: 8,
    created_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "9",
    name: "Holiday Specials",
    slug: "holiday-specials",
    description: "Christmas, Easter, and other holiday content",
    type: "all",
    sort_order: 9,
    created_at: "2024-01-01T10:00:00Z",
  },
];

const typeColors: Record<string, string> = {
  all: "bg-[#7A8A6E]/10 text-[#7A8A6E] border-[#7A8A6E]/20",
  video: "bg-blue-50 text-blue-700 border-blue-200",
  coloring: "bg-purple-50 text-purple-700 border-purple-200",
  wallpaper: "bg-pink-50 text-pink-700 border-pink-200",
  story: "bg-amber-50 text-amber-700 border-amber-200",
};

const columns: Column<Category>[] = [
  {
    key: "name",
    header: "Name",
    render: (category) => (
      <div>
        <p className="text-sm font-medium text-[#222222]">{category.name}</p>
        <p className="text-xs text-[#888888]">{category.slug}</p>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    width: "110px",
    render: (category) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
          typeColors[category.type]
        }`}
      >
        {category.type}
      </span>
    ),
  },
  {
    key: "description",
    header: "Description",
    render: (category) => (
      <p className="text-sm text-[#666666] line-clamp-1">{category.description}</p>
    ),
  },
  {
    key: "sort_order",
    header: "Sort Order",
    width: "100px",
    sortable: true,
    render: (category) => (
      <span className="text-sm text-[#666666]">{category.sort_order}</span>
    ),
  },
];

export default function CategoriesPage() {
  const [categories] = useState<Category[]>(mockCategories);

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
          <h1 className="text-2xl font-medium text-[#222222]">Categories</h1>
          <p className="text-sm text-[#666666] mt-1">Manage content categories</p>
        </div>
        <Link href="/admin/categories/new">
          <Button className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2">
            <Plus className="w-4 h-4" />
            New Category
          </Button>
        </Link>
      </motion.div>

      {/* Table */}
      <DataTable
        data={categories}
        columns={columns}
        keyExtractor={(c) => c.id}
        searchPlaceholder="Search categories..."
        filterOptions={[
          { label: "All", value: "all" },
          { label: "Video", value: "video" },
          { label: "Coloring", value: "coloring" },
          { label: "Wallpaper", value: "wallpaper" },
          { label: "Story", value: "story" },
        ]}
        onEdit={(category) => console.log("Edit", category.id)}
        onDelete={(category) => console.log("Delete", category.id)}
      />
    </div>
  );
}
