"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Shield, Crown, UserX, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { User } from "@/lib/supabase";

const mockUsers: User[] = [
  {
    id: "1",
    email: "sarah.johnson@email.com",
    full_name: "Sarah Johnson",
    avatar_url: "/images/avatars/sarah.jpg",
    role: "admin",
    membership: "premium",
    downloads_today: 5,
    downloads_reset_at: "2024-03-10T00:00:00Z",
    created_at: "2023-12-01T10:00:00Z",
    last_login: "2024-03-10T08:30:00Z",
    is_banned: false,
  },
  {
    id: "2",
    email: "michael.chen@email.com",
    full_name: "Michael Chen",
    avatar_url: "/images/avatars/michael.jpg",
    role: "user",
    membership: "premium",
    downloads_today: 3,
    downloads_reset_at: "2024-03-10T00:00:00Z",
    created_at: "2024-01-15T10:00:00Z",
    last_login: "2024-03-09T14:20:00Z",
    is_banned: false,
  },
  {
    id: "3",
    email: "emma.davis@email.com",
    full_name: "Emma Davis",
    avatar_url: null,
    role: "user",
    membership: "free",
    downloads_today: 1,
    downloads_reset_at: "2024-03-10T00:00:00Z",
    created_at: "2024-02-01T10:00:00Z",
    last_login: "2024-03-08T09:15:00Z",
    is_banned: false,
  },
  {
    id: "4",
    email: "james.wilson@email.com",
    full_name: "James Wilson",
    avatar_url: "/images/avatars/james.jpg",
    role: "editor",
    membership: "premium",
    downloads_today: 7,
    downloads_reset_at: "2024-03-10T00:00:00Z",
    created_at: "2023-11-20T10:00:00Z",
    last_login: "2024-03-10T10:45:00Z",
    is_banned: false,
  },
  {
    id: "5",
    email: "olivia.brown@email.com",
    full_name: "Olivia Brown",
    avatar_url: null,
    role: "user",
    membership: "free",
    downloads_today: 0,
    downloads_reset_at: "2024-03-10T00:00:00Z",
    created_at: "2024-02-20T10:00:00Z",
    last_login: "2024-03-05T16:30:00Z",
    is_banned: true,
  },
  {
    id: "6",
    email: "william.taylor@email.com",
    full_name: "William Taylor",
    avatar_url: "/images/avatars/william.jpg",
    role: "user",
    membership: "premium",
    downloads_today: 4,
    downloads_reset_at: "2024-03-10T00:00:00Z",
    created_at: "2024-01-05T10:00:00Z",
    last_login: "2024-03-10T07:00:00Z",
    is_banned: false,
  },
  {
    id: "7",
    email: "sophia.martinez@email.com",
    full_name: "Sophia Martinez",
    avatar_url: null,
    role: "user",
    membership: "free",
    downloads_today: 2,
    downloads_reset_at: "2024-03-10T00:00:00Z",
    created_at: "2024-03-01T10:00:00Z",
    last_login: "2024-03-10T11:00:00Z",
    is_banned: false,
  },
  {
    id: "8",
    email: "benjamin.lee@email.com",
    full_name: "Benjamin Lee",
    avatar_url: "/images/avatars/benjamin.jpg",
    role: "editor",
    membership: "free",
    downloads_today: 1,
    downloads_reset_at: "2024-03-10T00:00:00Z",
    created_at: "2024-02-10T10:00:00Z",
    last_login: "2024-03-09T20:00:00Z",
    is_banned: false,
  },
];

const roleColors: Record<string, string> = {
  admin: "bg-red-50 text-red-700 border-red-200",
  editor: "bg-blue-50 text-blue-700 border-blue-200",
  user: "bg-gray-50 text-gray-600 border-gray-200",
};

const membershipColors: Record<string, string> = {
  premium: "bg-amber-50 text-amber-700 border-amber-200",
  free: "bg-gray-50 text-gray-600 border-gray-200",
};

const columns: Column<User>[] = [
  {
    key: "user",
    header: "User",
    render: (user) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#F5F2EC] overflow-hidden flex items-center justify-center">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name || ""} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-medium text-[#888888]">
              {(user.full_name || user.email).charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-[#222222]">{user.full_name || "Anonymous"}</p>
          <p className="text-xs text-[#888888]">{user.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    header: "Role",
    width: "100px",
    render: (user) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
          roleColors[user.role]
        }`}
      >
        {user.role}
      </span>
    ),
  },
  {
    key: "membership",
    header: "Membership",
    width: "110px",
    render: (user) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${
          membershipColors[user.membership]
        }`}
      >
        {user.membership === "premium" && <Crown className="w-3 h-3 mr-1" />}
        {user.membership}
      </span>
    ),
  },
  {
    key: "downloads_today",
    header: "Downloads Today",
    width: "130px",
    render: (user) => (
      <span className="text-sm text-[#666666]">{user.downloads_today} / 10</span>
    ),
  },
  {
    key: "last_login",
    header: "Last Login",
    width: "140px",
    render: (user) => (
      <div className="flex items-center gap-1 text-xs text-[#888888]">
        <Clock className="w-3 h-3" />
        {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "100px",
    render: (user) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          user.is_banned
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-emerald-50 text-emerald-700 border-emerald-200"
        }`}
      >
        {user.is_banned ? "Banned" : "Active"}
      </span>
    ),
  },
];

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);

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
          <h1 className="text-2xl font-medium text-[#222222]">Users</h1>
          <p className="text-sm text-[#666666] mt-1">Manage your users and memberships</p>
        </div>
        <Button
          variant="outline"
          className="border-[#E8E4DC] text-[#666666] hover:bg-[#F5F2EC] rounded-lg h-10 px-4 text-sm gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: Shield },
          { label: "Premium", value: users.filter((u) => u.membership === "premium").length, icon: Crown },
          { label: "Free", value: users.filter((u) => u.membership === "free").length, icon: Calendar },
          { label: "Banned", value: users.filter((u) => u.is_banned).length, icon: UserX },
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

      {/* Table */}
      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(u) => u.id}
        searchPlaceholder="Search users..."
        filterOptions={[
          { label: "Admin", value: "admin" },
          { label: "Editor", value: "editor" },
          { label: "User", value: "user" },
          { label: "Premium", value: "premium" },
          { label: "Free", value: "free" },
        ]}
        onEdit={(user) => console.log("Edit", user.id)}
        onDelete={(user) => console.log("Delete", user.id)}
      />
    </div>
  );
}
