"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DownloadIcon, TrendingUp, BarChart3, Calendar } from "lucide-react";
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

const downloadsOverTime = [
  { date: "Mar 1", downloads: 120 },
  { date: "Mar 2", downloads: 145 },
  { date: "Mar 3", downloads: 132 },
  { date: "Mar 4", downloads: 178 },
  { date: "Mar 5", downloads: 190 },
  { date: "Mar 6", downloads: 210 },
  { date: "Mar 7", downloads: 245 },
  { date: "Mar 8", downloads: 230 },
  { date: "Mar 9", downloads: 267 },
  { date: "Mar 10", downloads: 289 },
];

const downloadsByType = [
  { type: "Coloring Pages", count: 1240, fill: "#7A8A6E" },
  { type: "Wallpapers", count: 890, fill: "#A8B89C" },
  { type: "Videos", count: 560, fill: "#C4D4B8" },
  { type: "PDFs", count: 420, fill: "#E0E8D8" },
];

const topDownloadedItems = [
  { id: "1", title: "Jesus Blesses the Children", type: "coloring", downloads: 3420 },
  { id: "2", title: "Sunset Cross", type: "wallpaper", downloads: 2890 },
  { id: "3", title: "The Good Shepherd", type: "coloring", downloads: 2650 },
  { id: "4", title: "Mountain Prayer", type: "wallpaper", downloads: 2100 },
  { id: "5", title: "Daniel in the Lions' Den", type: "coloring", downloads: 1980 },
  { id: "6", title: "Jesus Calms the Storm", type: "video", downloads: 1560 },
  { id: "7", title: "Walking on Water", type: "coloring", downloads: 1450 },
  { id: "8", title: "Bible Verse Typography", type: "wallpaper", downloads: 1320 },
];

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

interface TopItem {
  id: string;
  title: string;
  type: string;
  downloads: number;
}

const topItemsColumns: Column<TopItem>[] = [
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
          typeColors[item.type]
        }`}
      >
        {typeLabels[item.type]}
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
  const [topItems] = useState<TopItem[]>(topDownloadedItems);
  const totalDownloads = downloadsByType.reduce((sum, d) => sum + d.count, 0);
  const avgDaily = Math.round(
    downloadsOverTime.reduce((sum, d) => sum + d.downloads, 0) / downloadsOverTime.length
  );

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
          { label: "Avg Daily", value: avgDaily.toLocaleString(), icon: Calendar },
          { label: "Coloring Pages", value: downloadsByType[0].count.toLocaleString(), icon: BarChart3 },
          { label: "Growth", value: "+23%", icon: TrendingUp },
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downloads Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <h3 className="text-sm font-medium text-[#222222] mb-4">Downloads Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downloadsOverTime}>
                <defs>
                  <linearGradient id="downloadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7A8A6E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7A8A6E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DC" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#888888" }} axisLine={{ stroke: "#E8E4DC" }} />
                <YAxis tick={{ fontSize: 12, fill: "#888888" }} axisLine={{ stroke: "#E8E4DC" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E8E4DC",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stroke="#7A8A6E"
                  strokeWidth={2}
                  fill="url(#downloadsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Downloads by Content Type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <h3 className="text-sm font-medium text-[#222222] mb-4">Downloads by Content Type</h3>
          <div className="h-64">
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
          </div>
        </motion.div>
      </div>

      {/* Top Downloaded Items */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-sm font-medium text-[#222222] mb-4">Top Downloaded Items</h3>
        <DataTable
          data={topItems}
          columns={topItemsColumns}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search items..."
        />
      </motion.div>
    </div>
  );
}
