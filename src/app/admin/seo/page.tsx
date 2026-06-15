"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle, AlertCircle, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";

interface SeoItem {
  id: string;
  contentType: string;
  title: string;
  seoStatus: "optimized" | "missing" | "pending";
}

const mockSeoItems: SeoItem[] = [
  { id: "1", contentType: "Coloring Page", title: "Jesus Blesses the Children", seoStatus: "optimized" },
  { id: "2", contentType: "Video", title: "Jesus Calms the Storm", seoStatus: "optimized" },
  { id: "3", contentType: "Wallpaper", title: "Sunset Cross", seoStatus: "missing" },
  { id: "4", contentType: "Bible Story", title: "The Creation Story", seoStatus: "optimized" },
  { id: "5", contentType: "Coloring Page", title: "Walking on Water", seoStatus: "pending" },
  { id: "6", contentType: "Video", title: "The Good Shepherd", seoStatus: "optimized" },
  { id: "7", contentType: "Wallpaper", title: "Mountain Prayer", seoStatus: "missing" },
  { id: "8", contentType: "Bible Story", title: "Noah's Ark", seoStatus: "pending" },
  { id: "9", contentType: "Coloring Page", title: "The Last Supper", seoStatus: "missing" },
  { id: "10", contentType: "Video", title: "Walking on Water", seoStatus: "optimized" },
];

const statusColors: Record<string, string> = {
  optimized: "bg-emerald-50 text-emerald-700 border-emerald-200",
  missing: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  optimized: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
  missing: <AlertCircle className="w-3.5 h-3.5 text-red-600" />,
  pending: <Clock className="w-3.5 h-3.5 text-amber-600" />,
};

const columns: Column<SeoItem>[] = [
  {
    key: "contentType",
    header: "Content Type",
    width: "130px",
    render: (item) => (
      <span className="text-sm text-[#666666]">{item.contentType}</span>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (item) => (
      <p className="text-sm font-medium text-[#222222]">{item.title}</p>
    ),
  },
  {
    key: "seoStatus",
    header: "SEO Status",
    width: "130px",
    render: (item) => (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
          statusColors[item.seoStatus]
        }`}
      >
        {statusIcons[item.seoStatus]}
        {item.seoStatus}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    width: "140px",
    render: (item) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 text-xs text-[#666666] hover:text-[#7A8A6E] gap-1"
        onClick={() => console.log("Generate SEO for", item.id)}
        disabled={item.seoStatus === "optimized"}
      >
        <Sparkles className="w-3 h-3" />
        Generate
      </Button>
    ),
  },
];

export default function SeoPage() {
  const [seoItems] = useState<SeoItem[]>(mockSeoItems);

  const optimizedCount = seoItems.filter((i) => i.seoStatus === "optimized").length;
  const missingCount = seoItems.filter((i) => i.seoStatus === "missing").length;
  const pendingCount = seoItems.filter((i) => i.seoStatus === "pending").length;

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
          <h1 className="text-2xl font-medium text-[#222222]">SEO Management</h1>
          <p className="text-sm text-[#666666] mt-1">Optimize and manage SEO for your content</p>
        </div>
        <Button className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2">
          <Zap className="w-4 h-4" />
          Generate All
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Optimized", value: optimizedCount, color: "text-emerald-600", icon: CheckCircle },
          { label: "Missing SEO", value: missingCount, color: "text-red-600", icon: AlertCircle },
          { label: "Pending Auto-Gen", value: pendingCount, color: "text-amber-600", icon: Clock },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-[#E8E4DC]/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-lg font-semibold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-[#888888]">{stat.label}</p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={seoItems}
        columns={columns}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search content..."
        filterOptions={[
          { label: "Optimized", value: "optimized" },
          { label: "Missing", value: "missing" },
          { label: "Pending", value: "pending" },
        ]}
      />
    </div>
  );
}
