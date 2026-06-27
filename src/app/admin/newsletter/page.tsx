"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Mail, CheckCircle, XCircle, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { Newsletter } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

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
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          subscriber.subscribed
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-700 border-red-200"
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
      </span>
    ),
  },
  {
    key: "source",
    header: "Source",
    width: "100px",
    render: (subscriber) => (
      <span className="text-sm text-[#666666] capitalize">{subscriber.source || "—"}</span>
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
  const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscribers() {
      try {
        const { data, error } = await supabase
          .from("newsletter")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setSubscribers(data || []);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    }

    fetchSubscribers();
  }, []);

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
      ) : subscribers.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E4DC]/50 p-12 text-center">
          <Mail className="w-12 h-12 text-[#E8E4DC] mx-auto mb-4" />
          <h3 className="text-base font-medium text-[#222222]">No subscribers yet</h3>
          <p className="text-sm text-[#888888] mt-1">Subscribers will appear here when they sign up for your newsletter.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
