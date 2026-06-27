"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DownloadIcon, TrendingUp, BarChart3, Calendar, Loader2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { DataTable, Column } from "@/components/admin/data-table";
import { supabase } from "@/lib/supabase";

interface DownloadItem {
  id: string;
  title: string;
  type: string;
  downloads: number;
}

const typeLabels: Record<string, string> = {
  coloring: "Coloring Page",
  wallpaper: "Wallpaper",
  video: "Video",
  pdf: "PDF",
};

const typeColors: Record<string, string> = {
  coloring: "bg-purple-50 text-purple-700 border-purple-200",
  wallpaper: "bg-pink-50 text-pink-700 border-pink-200",
  video: "bg-blue-50 text-blue-700 border-blue-200",
  pdf: "bg-amber-50 text-amber-700 border-amber-200",
};

const topItemsColumns: Column<DownloadItem>[] = [
  {
    key: "title",
    header: "Title",
    render: (item) => (
      <p className="text-sm font-medium text-[#222222]">{item.title}</p>
    ),
  },
  {
    key: "type",
    header: "Type",
    width: "120px",
    render: (item) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          typeColors[item.type] || typeColors.pdf
        }`}
      >
        {typeLabels[item.type] || item.type}
      </span>
    ),
  },
  {
    key: "downloads",
    header: "Downloads",
    width: "120px",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-1 text-sm text-[#666666]">
        <DownloadIcon className="w-3.5 h-3.5" />
        {item.downloads.toLocaleString()}
      </div>
    ),
  },
];

export default function AnalyticsPage() {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<DownloadItem[]>([]);
  const [downloadsByType, setDownloadsByType] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all downloads
        const { data: downloadData, error: downloadError } = await supabase
          .from("downloads")
          .select("*")
          .order("created_at", { ascending: false });

        if (downloadError) {
          setError(downloadError.message);
          setLoading(false);
          return;
        }

        setDownloads(downloadData || []);

        // Aggregate downloads by type
        const typeCounts: Record<string, number> = {};
        (downloadData || []).forEach((d) => {
          typeCounts[d.content_type] = (typeCounts[d.content_type] || 0) + 1;
        });

        const byType = Object.entries(typeCounts).map(([type, count]) => ({
          type: typeLabels[type] || type,
          count,
          fill: type === "coloring" ? "#7A8A6E" : type === "wallpaper" ? "#A8B89C" : type === "video" ? "#C4D4B8" : "#E0E8D8",
        }));
        setDownloadsByType(byType);

        // For top items, we need to join with content tables
        // Since we can't do complex joins easily, let's just show download records grouped by content
        const contentCounts: Record<string, { title: string; type: string; count: number }> = {};
        (downloadData || []).forEach((d) => {
          const key = `${d.content_type}-${d.content_id}`;
          if (!contentCounts[key]) {
            contentCounts[key] = { title: `${d.content_type} #${d.content_id}`, type: d.content_type, count: 0 };
          }
          contentCounts[key].count += 1;
        });

        const top = Object.values(contentCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
          .map((item, index) => ({
            id: String(index + 1),
            title: item.title,
            type: item.type,
            downloads: item.count,
          }));

        setTopItems(top);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalDownloads = downloads.length;
  const avgDaily = 0; // Would need historical data

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-[#222222]">Downloads Analytics</h1>
        <p className="text-sm text-[#666666] mt-1">Track downloads and content performance</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Downloads", value: totalDownloads.toLocaleString(), icon: DownloadIcon },
          { label: "Avg Daily", value: "—", icon: Calendar },
          { label: "Content Types", value: downloadsByType.length.toString(), icon: BarChart3 },
          { label: "Growth", value: "Live", icon: TrendingUp },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-[#E8E4DC]/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-[#222222]">{stat.value}</p>
                <p className="text-xs text-[#888888]">{stat.label}</p>
              </div>
              <stat.icon className="w-5 h-5 text-[#7A8A6E]" />
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
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Downloads by Content Type */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
            >
              <h3 className="text-sm font-medium text-[#222222] mb-4">Downloads by Content Type</h3>
              <div className="h-64">
                {downloadsByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={downloadsByType}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DC" />
                      <XAxis dataKey="type" tick={{ fontSize: 12, fill: "#888888" }} axisLine={{ stroke: "#E8E4DC" }} />
                      <YAxis tick={{ fontSize: 12, fill: "#888888" }} axisLine={{ stroke: "#E8E4DC" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #E8E4DC",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-[#888888]">
                    No download data yet
                  </div>
                )}
              </div>
            </motion.div>

            {/* Top Downloaded Items */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
            >
              <h3 className="text-sm font-medium text-[#222222] mb-4">Top Downloaded Items</h3>
              {topItems.length > 0 ? (
                <DataTable
                  data={topItems}
                  columns={topItemsColumns}
                  keyExtractor={(item) => item.id}
                  searchPlaceholder="Search items..."
                />
              ) : (
                <div className="flex items-center justify-center h-48 text-sm text-[#888888]">
                  No download data yet
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
