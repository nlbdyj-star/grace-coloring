"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Download,
  Video,
  Palette,
  Image,
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

interface ActivityDataPoint {
  date: string;
  downloads: number;
}

interface UserGrowthDataPoint {
  date: string;
  users: number;
}

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
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(true);

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

    async function fetchChartData() {
      try {
        // Fetch downloads for the last 30 days
        const { data: downloads } = await supabase
          .from("downloads")
          .select("created_at")
          .order("created_at", { ascending: false })
          .limit(1000);

        // Fetch users for the last 30 days
        const { data: users } = await supabase
          .from("users")
          .select("created_at")
          .order("created_at", { ascending: false })
          .limit(1000);

        // Generate last 30 days date labels
        const today = new Date();
        const last30Days: string[] = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          last30Days.push(d.toISOString().split("T")[0]);
        }

        const formatDate = (isoDate: string) => {
          const d = new Date(isoDate);
          return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        };

        // Group downloads by date
        const downloadCounts: Record<string, number> = {};
        if (downloads) {
          downloads.forEach((d) => {
            const day = d.created_at.split("T")[0];
            if (last30Days.includes(day)) {
              downloadCounts[day] = (downloadCounts[day] || 0) + 1;
            }
          });
        }

        // Group users by date
        const userCounts: Record<string, number> = {};
        if (users) {
          users.forEach((u) => {
            const day = u.created_at.split("T")[0];
            if (last30Days.includes(day)) {
              userCounts[day] = (userCounts[day] || 0) + 1;
            }
          });
        }

        // Build activity data (last 30 days)
        const activity: ActivityDataPoint[] = last30Days.map((day) => ({
          date: formatDate(day),
          downloads: downloadCounts[day] || 0,
        }));

        // Build user growth data (last 14 days)
        const last14Days = last30Days.slice(-14);
        const userGrowth: UserGrowthDataPoint[] = last14Days.map((day) => ({
          date: formatDate(day),
          users: userCounts[day] || 0,
        }));

        // Only set data if there are actual downloads/users
        const hasDownloads = Object.values(downloadCounts).some((c) => c > 0);
        const hasUsers = Object.values(userCounts).some((c) => c > 0);

        setActivityData(hasDownloads ? activity : []);
        setUserGrowthData(hasUsers ? userGrowth : []);
      } catch {
        setActivityData([]);
        setUserGrowthData([]);
      } finally {
        setChartLoading(false);
      }
    }

    fetchChartData();
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
              <p className="text-xs text-[#888888] mt-0.5">Daily downloads over the last 30 days</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7A8A6E]" />
                <span className="text-xs text-[#666666]">Downloads</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-[#7A8A6E] animate-spin" />
              </div>
            ) : activityData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-[#888888]">Waiting for data...</p>
                <p className="text-xs text-[#888888] mt-1">Download activity will appear here once users start downloading.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7A8A6E" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7A8A6E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888888" }} interval={4} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888888" }} />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E8E4DC", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="downloads" stroke="#7A8A6E" strokeWidth={2} fill="url(#colorDownloads)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
              <p className="text-xs text-[#888888] mt-0.5">Daily new registrations over the last 14 days</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Live
            </div>
          </div>
          <div className="h-[220px]">
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-[#7A8A6E] animate-spin" />
              </div>
            ) : userGrowthData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-[#888888]">Waiting for data...</p>
                <p className="text-xs text-[#888888] mt-1">User registrations will appear here once new users sign up.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888888" }} interval={2} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#888888" }} />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #E8E4DC", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="users" fill="#7A8A6E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
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
