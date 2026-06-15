"use client";

import { motion } from "framer-motion";
import {
  Users,
  Download,
  Video,
  Palette,
  Image,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
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

const stats = [
  {
    label: "Total Users",
    value: "12,580",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "#7A8A6E",
  },
  {
    label: "Total Downloads",
    value: "58,231",
    change: "+23.1%",
    trend: "up",
    icon: Download,
    color: "#A8B8A1",
  },
  {
    label: "Videos",
    value: "328",
    change: "+5.2%",
    trend: "up",
    icon: Video,
    color: "#7A8A6E",
  },
  {
    label: "Coloring Pages",
    value: "1,842",
    change: "+18.7%",
    trend: "up",
    icon: Palette,
    color: "#A8B8A1",
  },
  {
    label: "Wallpapers",
    value: "3,520",
    change: "-2.1%",
    trend: "down",
    icon: Image,
    color: "#7A8A6E",
  },
];

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

const topContent = [
  { title: "Jesus Blesses the Children", type: "Coloring", downloads: 3420, trend: "up" },
  { title: "Noah's Ark Wallpaper Set", type: "Wallpaper", downloads: 2890, trend: "up" },
  { title: "Jesus Calms the Storm", type: "Video", views: 15600, trend: "up" },
  { title: "The Good Shepherd", type: "Coloring", downloads: 2650, trend: "down" },
  { title: "Nativity Scene Collection", type: "Coloring", downloads: 2380, trend: "up" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-medium text-[#222222]">Dashboard</h1>
        <p className="text-sm text-[#666666] mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-white rounded-xl border border-[#E8E4DC]/50 p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-[18px] h-[18px]" style={{ color: stat.color }} />
              </div>
              <div
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.trend === "up" ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#222222]">{stat.value}</p>
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
              <p className="text-xs text-[#888888] mt-0.5">Last 30 days</p>
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
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#888888" }}
                  interval={4}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#888888" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
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
                  fill="url(#colorDownloads)"
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#A8B8A1"
                  strokeWidth={2}
                  fill="url(#colorViews)"
                />
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
          <p className="text-xs text-[#888888] mb-5">Most downloaded this month</p>
          <div className="space-y-4">
            {topContent.map((item, index) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#888888] w-4">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#222222] truncate">{item.title}</p>
                  <p className="text-xs text-[#888888]">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#222222]">
                    {item.downloads?.toLocaleString() || item.views?.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#888888]">
                    {item.downloads ? "downloads" : "views"}
                  </p>
                </div>
              </div>
            ))}
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
              <p className="text-xs text-[#888888] mt-0.5">Daily registrations</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +24.5%
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#888888" }}
                  interval={2}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#888888" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E8E4DC",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
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
              { label: "Coloring Pages", count: 1842, total: 6000, color: "#7A8A6E" },
              { label: "Wallpapers", count: 3520, total: 6000, color: "#A8B8A1" },
              { label: "Videos", count: 328, total: 6000, color: "#C5D1BE" },
              { label: "Bible Stories", count: 156, total: 6000, color: "#E8EDE5" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#222222]">{item.label}</span>
                  <span className="text-sm font-medium text-[#222222]">
                    {item.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#F5F2EC] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / item.total) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
