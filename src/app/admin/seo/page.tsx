"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, CheckCircle, AlertCircle, Clock, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { supabase } from "@/lib/supabase";

interface SeoItem {
  id: string;
  contentType: string;
  title: string;
  seoStatus: "optimized" | "missing" | "pending";
}

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
        onClick={() => alert("SEO generation feature coming soon.")}
        disabled={item.seoStatus === "optimized"}
      >
        <Sparkles className="w-3 h-3" />
        Generate
      </Button>
    ),
  },
];

export default function SeoPage() {
  const [seoItems, setSeoItems] = useState<SeoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const items: SeoItem[] = [];
        let idCounter = 1;

        // Fetch videos
        const { data: videos } = await supabase.from("videos").select("id, title, seo_title, seo_description");
        (videos || []).forEach((v) => {
          const hasSeo = v.seo_title && v.seo_description;
          items.push({
            id: String(idCounter++),
            contentType: "Video",
            title: v.title,
            seoStatus: hasSeo ? "optimized" : "missing",
          });
        });

        // Fetch coloring pages
        const { data: pages } = await supabase.from("coloring_pages").select("id, title, seo_title, seo_description");
        (pages || []).forEach((p) => {
          const hasSeo = p.seo_title && p.seo_description;
          items.push({
            id: String(idCounter++),
            contentType: "Coloring Page",
            title: p.title,
            seoStatus: hasSeo ? "optimized" : "missing",
          });
        });

        // Fetch wallpapers
        const { data: wallpapers } = await supabase.from("wallpapers").select("id, title, seo_title, seo_description");
        (wallpapers || []).forEach((w) => {
          const hasSeo = w.seo_title && w.seo_description;
          items.push({
            id: String(idCounter++),
            contentType: "Wallpaper",
            title: w.title,
            seoStatus: hasSeo ? "optimized" : "missing",
          });
        });

        // Fetch bible stories
        const { data: stories } = await supabase.from("bible_stories").select("id, title, seo_title, seo_description");
        (stories || []).forEach((s) => {
          const hasSeo = s.seo_title && s.seo_description;
          items.push({
            id: String(idCounter++),
            contentType: "Bible Story",
            title: s.title,
            seoStatus: hasSeo ? "optimized" : "missing",
          });
        });

        setSeoItems(items);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch SEO data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
        <Button
          onClick={() => alert("Bulk SEO generation coming soon.")}
          className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2"
        >
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

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium">Data Loading Issue</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#7A8A6E] animate-spin" />
        </div>
      ) : seoItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E4DC]/50 p-12 text-center">
          <Zap className="w-12 h-12 text-[#E8E4DC] mx-auto mb-4" />
          <h3 className="text-base font-medium text-[#222222]">No content yet</h3>
          <p className="text-sm text-[#888888] mt-1">Add content to see SEO status here.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
