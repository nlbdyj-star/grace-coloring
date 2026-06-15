"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Download, Heart, Eye, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { ColoringPage } from "@/lib/supabase";

const mockPages: ColoringPage[] = [
  {
    id: "1",
    title: "Jesus Blesses the Children",
    slug: "jesus-blesses-children",
    category_id: "1",
    bible_character: "Jesus",
    story: "Jesus welcomes the little children",
    tags: ["jesus", "children", "blessing"],
    line_art_image: "/images/coloring/jesus-children-line.jpg",
    colored_preview_image: "/images/coloring/jesus-children-color.jpg",
    pdf_file: "/downloads/jesus-children.pdf",
    difficulty: "easy",
    downloads_count: 3420,
    views_count: 8900,
    favorites_count: 1250,
    seo_title: "Jesus Blesses the Children Coloring Page",
    seo_description: "Color Jesus blessing the children. A beautiful Bible coloring page for all ages.",
    seo_keywords: ["jesus", "children", "coloring page", "bible"],
    status: "published",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    title: "The Good Shepherd",
    slug: "the-good-shepherd",
    category_id: "1",
    bible_character: "Jesus",
    story: "Jesus is the Good Shepherd",
    tags: ["jesus", "shepherd", "sheep", "john 10"],
    line_art_image: "/images/coloring/good-shepherd-line.jpg",
    colored_preview_image: "/images/coloring/good-shepherd-color.jpg",
    pdf_file: "/downloads/good-shepherd.pdf",
    difficulty: "medium",
    downloads_count: 2650,
    views_count: 7200,
    favorites_count: 980,
    seo_title: "The Good Shepherd Coloring Page",
    seo_description: "Color Jesus as the Good Shepherd with His flock. A peaceful Bible coloring activity.",
    seo_keywords: ["good shepherd", "jesus", "sheep", "coloring"],
    status: "published",
    created_at: "2024-01-20T10:00:00Z",
    updated_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "3",
    title: "Walking on Water",
    slug: "walking-on-water",
    category_id: "5",
    bible_character: "Jesus",
    story: "Peter walks on water with Jesus",
    tags: ["miracle", "jesus", "water", "peter"],
    line_art_image: "/images/coloring/walking-water-line.jpg",
    colored_preview_image: "/images/coloring/walking-water-color.jpg",
    pdf_file: "/downloads/walking-water.pdf",
    difficulty: "hard",
    downloads_count: 1890,
    views_count: 5400,
    favorites_count: 650,
    seo_title: "Walking on Water Coloring Page",
    seo_description: "Color the miracle of Jesus walking on water. An inspiring Bible story coloring page.",
    seo_keywords: ["walking on water", "miracle", "jesus", "peter"],
    status: "published",
    created_at: "2024-02-05T10:00:00Z",
    updated_at: "2024-02-05T10:00:00Z",
  },
  {
    id: "4",
    title: "Daniel in the Lions' Den",
    slug: "daniel-lions-den",
    category_id: "3",
    bible_character: "Daniel",
    story: "Daniel survives the lions' den through faith",
    tags: ["daniel", "lions", "faith", "courage"],
    line_art_image: "/images/coloring/daniel-line.jpg",
    colored_preview_image: "/images/coloring/daniel-color.jpg",
    pdf_file: "/downloads/daniel-lions.pdf",
    difficulty: "medium",
    downloads_count: 2100,
    views_count: 6100,
    favorites_count: 780,
    seo_title: "Daniel in the Lions' Den Coloring Page",
    seo_description: "Color Daniel peacefully among the lions. A story of faith and divine protection.",
    seo_keywords: ["daniel", "lions", "faith", "coloring page"],
    status: "published",
    created_at: "2024-02-15T10:00:00Z",
    updated_at: "2024-02-15T10:00:00Z",
  },
  {
    id: "5",
    title: "The Last Supper",
    slug: "the-last-supper",
    category_id: "1",
    bible_character: "Jesus",
    story: "Jesus shares the last supper with His disciples",
    tags: ["jesus", "last supper", "disciples", "easter"],
    line_art_image: "/images/coloring/last-supper-line.jpg",
    colored_preview_image: "/images/coloring/last-supper-color.jpg",
    pdf_file: "/downloads/last-supper.pdf",
    difficulty: "hard",
    downloads_count: 1560,
    views_count: 4800,
    favorites_count: 520,
    seo_title: "The Last Supper Coloring Page",
    seo_description: "Color the Last Supper scene. A detailed Bible coloring page for older children and adults.",
    seo_keywords: ["last supper", "jesus", "disciples", "easter"],
    status: "draft",
    created_at: "2024-03-01T10:00:00Z",
    updated_at: "2024-03-01T10:00:00Z",
  },
];

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-red-50 text-red-700 border-red-200",
};

const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-50 text-gray-600 border-gray-200",
};

const columns: Column<ColoringPage>[] = [
  {
    key: "preview",
    header: "Preview",
    width: "70px",
    render: (page) => (
      <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-[#F5F2EC]">
        <img
          src={page.line_art_image}
          alt={page.title}
          className="w-full h-full object-cover"
        />
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (page) => (
      <div>
        <p className="text-sm font-medium text-[#222222]">{page.title}</p>
        <p className="text-xs text-[#888888]">{page.slug}</p>
      </div>
    ),
  },
  {
    key: "difficulty",
    header: "Difficulty",
    width: "100px",
    render: (page) => (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${
          difficultyColors[page.difficulty]
        }`}
      >
        {page.difficulty}
      </span>
    ),
  },
  {
    key: "stats",
    header: "Stats",
    width: "160px",
    render: (page) => (
      <div className="flex items-center gap-3 text-xs text-[#666666]">
        <span className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          {page.downloads_count.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          {page.favorites_count.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {page.views_count.toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "110px",
    render: (page) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          statusColors[page.status]
        }`}
      >
        {page.status}
      </span>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    width: "130px",
    sortable: true,
    render: (page) => (
      <div className="flex items-center gap-1 text-xs text-[#888888]">
        <Calendar className="w-3 h-3" />
        {new Date(page.created_at).toLocaleDateString()}
      </div>
    ),
  },
];

export default function ColoringPagesPage() {
  const [pages] = useState<ColoringPage[]>(mockPages);

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
          <h1 className="text-2xl font-medium text-[#222222]">Coloring Pages</h1>
          <p className="text-sm text-[#666666] mt-1">Manage your coloring page collection</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-[#E8E4DC] text-[#666666] hover:bg-[#F5F2EC] rounded-lg h-10 px-4 text-sm gap-2"
          >
            <Zap className="w-4 h-4" />
            Batch SEO
          </Button>
          <Link href="/admin/coloring-pages/new">
            <Button className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2">
              <Plus className="w-4 h-4" />
              Add Page
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: pages.length },
          { label: "Published", value: pages.filter((p) => p.status === "published").length },
          { label: "Drafts", value: pages.filter((p) => p.status === "draft").length },
          { label: "Downloads", value: pages.reduce((sum, p) => sum + p.downloads_count, 0).toLocaleString() },
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
        data={pages}
        columns={columns}
        keyExtractor={(p) => p.id}
        searchPlaceholder="Search coloring pages..."
        filterOptions={[
          { label: "Published", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Easy", value: "easy" },
          { label: "Medium", value: "medium" },
          { label: "Hard", value: "hard" },
        ]}
        onEdit={(page) => console.log("Edit", page.id)}
        onDelete={(page) => console.log("Delete", page.id)}
      />
    </div>
  );
}
