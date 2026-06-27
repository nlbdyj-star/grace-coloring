"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Download,
  Video,
  Palette,
  Image,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
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
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalUsers: number;
  totalVideos: number;
  totalColoringPages: number;
  totalWallpapers: number;
  totalBibleStories: number;
  totalDownloads: number;
  loading: boolean;
  error: string | null;
}

interface TopContentItem {
  title: string;
  type: string;
  count: number;
}

const chartData = [
  { date: "May 16", users: 320, downloads: 1200, pageViews: 4500 },
  { date: "May 17", users: 380, downloads: 1450, pageViews: 5200 },
  { date: "May 18", users: 410, downloads: 1380, pageViews: 4800 },
  { date: "May 19", users: 450, downloads: 1620, pageViews: 6100 },
  { date: "May 20", users: 390, downloads: 1500, pageViews: 5500 },
  { date: "May 21", users: 480, downloads: 1800, pageViews: 6800 },
  { date: "May 22", users: 520, downloads: 2100, pageViews: 7200 },
  { date: "May 23", users: 490, downloads: 1950, pageViews: 6900 },
  { date: "May 24", users: 560, downloads: 2300, pageViews: 8100 },
  { date: "May 25", users: 610, downloads: 2500, pageViews: 8900 },
  { date: "May 26", users: 580, downloads: 2400, pageViews: 8500 },
  { date: "May 27", users: 650, downloads: 2800, pageViews: 9200 },
  { date: "May 28", users: 720, downloads: 3100, pageViews: 10500 },
  { date: "May 29", users: 680, downloads: 2900, pageViews: 9800 },
  { date: "May 30", users: 750, downloads: 3300, pageViews: 11200 },
  { date: "May 31", users: 810, downloads: 3600, pageViews: 12500 },
  { date: "Jun 1", users: 780, downloads: 3400, pageViews: 11800 },
  { date: "Jun 2", users: 850, downloads: 3800, pageViews: 13200 },
  { date: "Jun 3", users: 920, downloads: 4100, pageViews: 14500 },
  { date: "Jun 4", users: 880, downloads: 3900, pageViews: 13800 },
  { date: "Jun 5", users: 950, downloads: 4300, pageViews: 15200 },
  { date: "Jun 6", users: 1020, downloads: 4600, pageViews: 16800 },
  { date: "Jun 7", users: 980, downloads: 4400, pageViews: 15900 },
  { date: "Jun 8", users: 1050, downloads: 4800, pageViews: 17500 },
  { date: "Jun 9", users: 1120, downloads: 5100, pageViews: 18900 },
  { date: "Jun 10", users: 1080, downloads: 4900, pageViews: 18200 },
  { date: "Jun 11", users: 1150, downloads: 5300, pageViews: 19800 },
  { date: "Jun 12", users: 1220, downloads: 5600, pageViews: 21500 },
  { date: "Jun 13", users: 1180, downloads: 5400, pageViews: 20800 },
  { date: "Jun 14", users: 1250, downloads: 5800, pageViews: 22500 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVideos: 0,
    totalColoringPages: 0,
    totalWallpapers: 0,
    totalBibleStories: 0,
    totalDownloads: 0,
    loading: true,
    error: null,
  });
  const [topContent, setTopContent] = useState<TopContentItem[]>([]);
  const [topLoading, setTopLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: userCount, error: userError },
          { count: videoCount, error: videoError },
          { count: coloringCount, error: coloringError },
          { count: wallpaperCount, error: wallpaperError },
          { count: storyCount, error: storyError },
          { count: downloadCount, error: downloadError },
        ] = await Promise.all([
          supabase.from("users").select("*", { count: "exact", head: true }),
          supabase.from("videos").select("*", { count: "exact", head: true }),
          supabase.from("coloring_pages").select("*", { count: "exact", head: true }),
          supabase.from("wallpapers").select("*", { count: "exact", head: true }),
          supabase.from("bible_stories").select("*", { count: "exact", head: true }),
          supabase.from("downloads").select("*", { count: "exact", head: true }),
        ]);

        if (userError || videoError || coloringError || wallpaperError || storyError || downloadError) {
          setStats((prev) => ({
            ...prev,
            loading: false,
            error: "Database permission error. Please run the SQL fix in Supabase.",
          }));
          return;
        }

        setStats({
          totalUsers: userCount || 0,
          totalVideos: videoCount || 0,
          totalColoringPages: coloringCount || 0,
          totalWallpapers: wallpaperCount || 0,
          totalBibleStories: storyCount || 0,
          totalDownloads: downloadCount || 0,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err?.message || "Failed to fetch stats",
        }));
      }
    }

    async function fetchTopContent() {
      try {
        const { data: downloads } = await supabase.from("downloads").select("content_type, content_id");
        if (!downloads || downloads.length === 0) {
          setTopContent([]);
          setTopLoading(false);
          return;
        }

        // Count downloads by content
        const counts: Record<string, { type: string; count: number }> = {};
        downloads.forEach((d) => {
          const key = `${d.content_type}-${d.content_id}`;
          if (!counts[key]) counts[key] = { type: d.content_type, count: 0 };
          counts[key].count++;
        });

        // Get top 5
        const sorted = Object.entries(counts)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 5);

        // Try to fetch titles from content tables
        const topItems: TopContentItem[] = [];
        for (const [key, value] of sorted) {
          const [, contentId] = key.split("-");
          let title = `${value.type} #${contentId}`;

          if (value.type === "video") {
            const { data } = await supabase.from("videos").select("title").eq("id", contentId).single();
            if (data) title = data.title;
          } else if (value.type === "coloring") {
            const { data } = await supabase.from("coloring_pages").select("title").eq("id", contentId).single();
            if (data) title = data.title;
          } else if (value.type === "wallpaper") {
            const { data } = await supabase.from("wallpapers").select("title").eq("id", contentId).single();
            if (data) title = data.title;
          }

          topItems.push({
            title,
            type: value.type === "coloring" ? "Coloring Page" : value.type === "wallpaper" ? "Wallpaper" : value.type === "video" ? "Video" : value.type,
            count: value.count,
          });
        }

        setTopContent(topItems);
      } catch {
        setTopContent([]);
      } finally {
        setTopLoading(false);
      }
    }

    fetchStats();
    fetchTopContent();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "#7A8A6E" },
    { label: "Total Downloads", value: stats.totalDownloads, icon: Download, color: "#A8B8A1" },
    { label: "Videos", value: stats.totalVideos, icon: Video, color: "#7A8A6E" },
    { label: "Coloring Pages", value: stats.totalColoringPages, icon: Palette, color: "#A8B8A1" },
    { label: "Wallpapers", value: stats.totalWallpapers, icon: Image, color: "#7A8A6E" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-medium text-[#222222]">Dashboard</h1>
        <p className="text-sm text-[#666666] mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </motion.div>

      {stats.error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium">Data Loading Issue</p>
          <p className="mt-1">{stats.error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white rounded-xl border border-[#E8E4DC]/50 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-[18px] h-[18px]" style={{ color: stat.color }} />
              </div>
              {stats.loading ? (
                <Loader2 className="w-4 h-4 text-[#888888] animate-spin" />
              ) : (
                <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  Live
                </div>
              )}
            </div>
            <p className="text-2xl font-semibold text-[#222222]">
              {stats.loading ? "-" : stat.value.toLocaleString()}
            </p>
            <p className="text-xs text-[#888888] mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-medium text-[#222222]">Activity Overview</h2>
              <p className="text-xs text-[#888888] mt-0.5">Sample data — real tracking coming soon</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7A8A6E]" />
                <span className="text-xs text-[#666666]">Downloads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A8B8A1]" />
                <span className="text-xs text-[#666666]">Page Views</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7A8A6E" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7A8A6E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A8B8A1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#A8B8A1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888888" }} interval={4} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888888" }} />
                <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E8E4DC", borderRadius: "8px", fontSize: "12px" }} />
                <Area type="monotone" dataKey="downloads" stroke="#7A8A6E" strokeWidth={2} fill="url(#colorDownloads)" />
                <Area type="monotone" dataKey="pageViews" stroke="#A8B8A1" strokeWidth={2} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <h2 className="text-base font-medium text-[#222222] mb-1">Top Content</h2>
          <p className="text-xs text-[#888888] mb-5">Most downloaded</p>
          <div className="space-y-4">
            {topLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-[#7A8A6E] animate-spin" />
              </div>
            ) : topContent.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#888888]">No downloads yet</p>
                <p className="text-xs text-[#888888] mt-1">Top content will appear here once users start downloading.</p>
              </div>
            ) : (
              topContent.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#888888] w-4">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#222222] truncate">{item.title}</p>
                    <p className="text-xs text-[#888888]">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#222222]">{item.count.toLocaleString()}</p>
                    <p className="text-xs text-[#888888]">downloads</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-medium text-[#222222]">New Users</h2>
              <p className="text-xs text-[#888888] mt-0.5">Sample data — real tracking coming soon</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Live
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888888" }} interval={2} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888888" }} />
                <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E8E4DC", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="users" fill="#7A8A6E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Content Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl border border-[#E8E4DC]/50 p-6"
        >
          <h2 className="text-base font-medium text-[#222222] mb-1">Content Breakdown</h2>
          <p className="text-xs text-[#888888] mb-6">Distribution by type</p>
          <div className="space-y-5">
            {[
              { label: "Coloring Pages", count: stats.totalColoringPages, color: "#7A8A6E" },
              { label: "Wallpapers", count: stats.totalWallpapers, color: "#A8B8A1" },
              { label: "Videos", count: stats.totalVideos, color: "#C5D1BE" },
              { label: "Bible Stories", count: stats.totalBibleStories, color: "#8A9A7E" },
            ].map((item) => {
              const total = Math.max(
                stats.totalColoringPages + stats.totalWallpapers + stats.totalVideos + stats.totalBibleStories,
                1
              );
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#222222]">{item.label}</span>
                    <span className="text-sm font-medium text-[#222222]">
                      {stats.loading ? "-" : item.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F5F2EC] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
