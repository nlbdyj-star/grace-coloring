"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, CheckCircle, XCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { Newsletter } from "@/lib/supabase";

const mockSubscribers: Newsletter[] = [
  {
    id: "1",
    email: "sarah.johnson@email.com",
    subscribed: true,
    source: "website",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    email: "michael.chen@email.com",
    subscribed: true,
    source: "popup",
    created_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    email: "emma.davis@email.com",
    subscribed: false,
    source: "website",
    created_at: "2024-02-10T10:00:00Z",
  },
  {
    id: "4",
    email: "james.wilson@email.com",
    subscribed: true,
    source: "footer",
    created_at: "2023-12-20T10:00:00Z",
  },
  {
    id: "5",
    email: "olivia.brown@email.com",
    subscribed: true,
    source: "popup",
    created_at: "2024-03-01T10:00:00Z",
  },
  {
    id: "6",
    email: "william.taylor@email.com",
    subscribed: true,
    source: "website",
    created_at: "2024-01-25T10:00:00Z",
  },
  {
    id: "7",
    email: "sophia.martinez@email.com",
    subscribed: false,
    source: "footer",
    created_at: "2024-02-28T10:00:00Z",
  },
  {
    id: "8",
    email: "benjamin.lee@email.com",
    subscribed: true,
    source: "popup",
    created_at: "2024-03-05T10:00:00Z",
  },
];

const columns: Column<Newsletter>[] = [
  {
    key: "email",
    header: "Email",
    render: (subscriber) => (
      <div className="flex items-center gap-2">
        <Mail className="w-3.5 h-3.5 text-[#888888]" />
        <p className="text-sm font-medium text-[#222222]">{subscriber.email}</p>
      </div>
    ),
  },
  {
    key: "subscribed",
    header: "Status",
    width: "120px",
    render: (subscriber) => (
      <button
        onClick={() => console.log("Toggle subscription", subscriber.id)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
          subscriber.subscribed
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
        }`}
      >
        {subscriber.subscribed ? (
          <>
            <CheckCircle className="w-3 h-3" />
            Subscribed
          </>
        ) : (
          <>
            <XCircle className="w-3 h-3" />
            Unsubscribed
          </>
        )}
      </button>
    ),
  },
  {
    key: "source",
    header: "Source",
    width: "100px",
    render: (subscriber) => (
      <span className="text-sm text-[#666666] capitalize">{subscriber.source}</span>
    ),
  },
  {
    key: "created_at",
    header: "Signup Date",
    width: "140px",
    sortable: true,
    render: (subscriber) => (
      <div className="flex items-center gap-1 text-xs text-[#888888]">
        <Calendar className="w-3 h-3" />
        {new Date(subscriber.created_at).toLocaleDateString()}
      </div>
    ),
  },
];

export default function NewsletterPage() {
  const [subscribers] = useState<Newsletter[]>(mockSubscribers);
  const activeSubscribers = subscribers.filter((s) => s.subscribed).length;

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
          <h1 className="text-2xl font-medium text-[#222222]">Newsletter</h1>
          <p className="text-sm text-[#666666] mt-1">Manage newsletter subscribers</p>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Subscribers", value: subscribers.length },
          { label: "Active", value: activeSubscribers },
          { label: "Unsubscribed", value: subscribers.filter((s) => !s.subscribed).length },
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

      {/* Table */}
      <DataTable
        data={subscribers}
        columns={columns}
        keyExtractor={(s) => s.id}
        searchPlaceholder="Search subscribers..."
        filterOptions={[
          { label: "Subscribed", value: "subscribed" },
          { label: "Unsubscribed", value: "unsubscribed" },
        ]}
        onEdit={(subscriber) => console.log("Edit", subscriber.id)}
        onDelete={(subscriber) => console.log("Delete", subscriber.id)}
      />
    </div>
  );
}
