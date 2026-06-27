"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, Calendar, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { BibleStory } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import UploadModal from "@/components/admin/upload-modal";
import EditModal from "@/components/admin/edit-modal";
import DeleteDialog from "@/components/admin/delete-dialog";

const statusColors: Record<string, string> = {
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-gray-50 text-gray-600 border-gray-200",
};

const columns: Column<BibleStory>[] = [
  {
    key: "hero_image",
    header: "Hero",
    width: "80px",
    render: (story) => (
      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-[#F5F2EC]">
        {story.hero_image ? (
          <img src={story.hero_image} alt={story.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#888888]" />
          </div>
        )}
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (story) => (
      <div>
        <p className="text-sm font-medium text-[#222222]">{story.title}</p>
        <p className="text-xs text-[#888888]">{story.slug}</p>
      </div>
    ),
  },
  {
    key: "bible_verse",
    header: "Bible Verse",
    width: "240px",
    render: (story) => (
      <div>
        <p className="text-xs text-[#666666] italic line-clamp-1">"{story.bible_verse}"</p>
        <p className="text-xs text-[#7A8A6E] font-medium">{story.bible_reference}</p>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    width: "110px",
    render: (story) => (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
          statusColors[story.status]
        }`}
      >
        {story.status}
      </span>
    ),
  },
  {
    key: "related",
    header: "Related Content",
    width: "130px",
    render: (story) => (
      <div className="text-xs text-[#666666]">
        {(story.related_coloring_pages || []).length} coloring, {(story.related_videos || []).length} videos
      </div>
    ),
  },
  {
    key: "created_at",
    header: "Created",
    width: "130px",
    sortable: true,
    render: (story) => (
      <div className="flex items-center gap-1 text-xs text-[#888888]">
        <Calendar className="w-3 h-3" />
        {new Date(story.created_at).toLocaleDateString()}
      </div>
    ),
  },
];

export default function BibleStoriesPage() {
  const [stories, setStories] = useState<BibleStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<BibleStory | null>(null);
  const [deleteItem, setDeleteItem] = useState<BibleStory | null>(null);

  // 提取 fetchStories 到组件级别，便于 UploadModal 成功后刷新
  const fetchStories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("bible_stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setStories(data || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch Bible stories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

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
          <h1 className="text-2xl font-medium text-[#222222]">Bible Stories</h1>
          <p className="text-sm text-[#666666] mt-1">Manage your Bible story collection</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-[#7A8A6E] hover:bg-[#6A7A5E] text-white rounded-lg h-10 px-5 text-sm font-medium gap-2"
        >
          <Plus className="w-4 h-4" />
          New Story
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stories.length },
          { label: "Published", value: stories.filter((s) => s.status === "published").length },
          { label: "Drafts", value: stories.filter((s) => s.status === "draft").length },
          { label: "Related Content", value: stories.reduce((sum, s) => sum + (s.related_coloring_pages || []).length + (s.related_videos || []).length, 0) },
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
      ) : stories.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E8E4DC]/50 p-12 text-center">
          <BookOpen className="w-12 h-12 text-[#E8E4DC] mx-auto mb-4" />
          <h3 className="text-base font-medium text-[#222222]">No Bible stories yet</h3>
          <p className="text-sm text-[#888888] mt-1">Bible stories will appear here when you add them.</p>
        </div>
      ) : (
        <DataTable
          data={stories}
          columns={columns}
          keyExtractor={(s) => s.id}
          searchPlaceholder="Search stories..."
          filterOptions={[
            { label: "Published", value: "published" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ]}
          onEdit={(story) => setEditItem(story)}
          onDelete={(story) => setDeleteItem(story)}
        />
      )}
      <UploadModal
        open={showModal}
        onClose={() => setShowModal(false)}
        type="bible-story"
        onSuccess={() => {
          setShowModal(false);
          fetchStories();
        }}
      />
      {editItem && (
        <EditModal
          open={!!editItem}
          onClose={() => setEditItem(null)}
          type="bible-story"
          initialData={editItem}
          onSuccess={() => {
            setEditItem(null);
            fetchStories();
          }}
        />
      )}
      <DeleteDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Delete Bible Story"
        itemName={deleteItem?.title || ""}
        onConfirm={async () => {
          if (!deleteItem) return;
          const { error } = await supabase.from("bible_stories").delete().eq("id", deleteItem.id);
          if (error) throw new Error(error.message);
          setDeleteItem(null);
          fetchStories();
        }}
      />
    </div>
  );
}
