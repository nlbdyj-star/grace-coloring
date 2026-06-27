"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Download, Heart, Eye, Calendar, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { Wallpaper } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import UploadModal from "@/components/admin/upload-modal";

const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-50 text-gray-600 border-gray-200",
};

const columns: Column<Wallpaper>[] = [
  {
    key: "preview",
    header: "Preview",
    width: "80px",
    render: (wallpaper) => (
      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-[#F5F2EC]">
        {wallpaper.image_original ? (
          <img src={wallpaper.image_original} alt={wallpaper.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-[#888888]" />
          </div>
        )}
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (wallpaper) => (
      <div>
        <p className="text-sm font-medium text-[#222222]">{wallpaper.title}</p>
        <p className="text-xs text-[#888888]">{(wallpaper.tags || []).slice(0, 3).join(", ")}</p>
      </div>
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
          {(wallpaper.downloads_count || 0).toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {(wallpaper.views_count || 0).toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          {(wallpaper.favorites_count || 0).toLocaleString()}
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
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 提取 fetchWallpapers 到组件级别，便于 UploadModal 成功后刷新
  const fetchWallpapers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("wallpapers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setWallpapers(data || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch wallpapers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallpapers();
  }, [fetchWallpapers]);

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
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Wallpaper
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: wallpapers.length },
          { label: "Published", value: wallpapers.filter((w) => w.status === "published").length },
          { label: "Drafts", value: wallpapers.filter((w) => w.status === "draft").length },
          { label: "Downloads", value: wallpapers.reduce((sum, w) => sum + (w.downloads_count || 0), 0).toLocaleString() },
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
      ) : wallpapers.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E4DC]/50 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-[#E8E4DC] mx-auto mb-4" />
          <h3 className="text-base font-medium text-[#222222]">No wallpapers yet</h3>
          <p className="text-sm text-[#888888] mt-1">Wallpapers will appear here when you add them.</p>
        </div>
      ) : (
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
      )}
      <UploadModal
        open={showModal}
        onClose={() => setShowModal(false)}
        type="wallpaper"
        onSuccess={() => {
          setShowModal(false);
          fetchWallpapers();
        }}
      />
    </div>
  );
}
