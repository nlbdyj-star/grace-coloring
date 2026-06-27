"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Shield, Crown, UserX, Calendar, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { User } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import EditModal from "@/components/admin/edit-modal";

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setUsers(data || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E4DC]/50 p-12 text-center">
          <Shield className="w-12 h-12 text-[#E8E4DC] mx-auto mb-4" />
          <h3 className="text-base font-medium text-[#222222]">No users yet</h3>
          <p className="text-sm text-[#888888] mt-1">Users will appear here when they sign up on your website.</p>
        </div>
      ) : (
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
          onEdit={(user) => setEditItem(user)}
        />
      )}
      {editItem && (
        <EditModal
          open={!!editItem}
          onClose={() => setEditItem(null)}
          type="user"
          initialData={editItem}
          onSuccess={() => {
            setEditItem(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
